import { Worker, Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { redisConnection } from '../config/redis';
import { transporter } from '../config/email';
import { checkRateLimit } from '../services/rateLimiter';

const prisma = new PrismaClient();

const WORKER_CONCURRENCY = parseInt(process.env.WORKER_CONCURRENCY || '5');
const MIN_DELAY = parseInt(process.env.MIN_DELAY_BETWEEN_EMAILS || '2000');

export function startWorker() {
  const worker = new Worker(
    'email-queue',
    async (job: Job) => {
      const { emailId, to, subject, body, userId, maxEmailsPerHour } = job.data;

      try {
        // Update status to SENDING
        await prisma.email.update({
          where: { id: emailId },
          data: { status: 'SENDING' },
        });

        // Check rate limit
        const rateLimitCheck = await checkRateLimit(userId, maxEmailsPerHour);
        
        if (!rateLimitCheck.allowed) {
          // Reschedule for next available time
          await prisma.email.update({
            where: { id: emailId },
            data: {
              status: 'RATE_LIMITED',
              scheduledFor: rateLimitCheck.nextAvailableTime,
            },
          });

          // Re-add to queue with new delay
          const delay = rateLimitCheck.nextAvailableTime!.getTime() - Date.now();
          await job.updateData({ ...job.data, rescheduled: true });
          
          throw new Error(`Rate limit exceeded. Rescheduled for ${rateLimitCheck.nextAvailableTime}`);
        }

        // Send email
        const info = await transporter.sendMail({
          from: process.env.SMTP_USER,
          to,
          subject,
          html: body,
        });

        // Update status to SENT
        await prisma.email.update({
          where: { id: emailId },
          data: {
            status: 'SENT',
            sentAt: new Date(),
          },
        });

        console.log(`Email sent to ${to}. Preview: ${info.messageId}`);
        
        // Add delay between emails
        await new Promise(resolve => setTimeout(resolve, MIN_DELAY));

        return { success: true, messageId: info.messageId };
      } catch (error: any) {
        console.error(`Failed to send email ${emailId}:`, error.message);

        // Update status to FAILED if not rate limited
        if (!error.message.includes('Rate limit')) {
          await prisma.email.update({
            where: { id: emailId },
            data: {
              status: 'FAILED',
              errorMessage: error.message,
            },
          });
        }

        throw error;
      }
    },
    {
      connection: redisConnection,
      concurrency: WORKER_CONCURRENCY,
      limiter: {
        max: 1,
        duration: MIN_DELAY,
      },
    }
  );

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.log(`Job ${job?.id} failed:`, err.message);
  });

  console.log('Email worker started');
  return worker;
}
