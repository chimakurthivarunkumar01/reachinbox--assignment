import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';
import { Email } from '@prisma/client';

export const emailQueue = new Queue('email-queue', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: {
      count: 1000,
    },
    removeOnFail: {
      count: 5000,
    },
  },
});

export async function scheduleEmailJob(email: Email, maxEmailsPerHour: number) {
  const delay = Math.max(0, email.scheduledFor.getTime() - Date.now());
  
  await emailQueue.add(
    'send-email',
    {
      emailId: email.id,
      to: email.to,
      subject: email.subject,
      body: email.body,
      userId: email.userId,
      maxEmailsPerHour,
    },
    {
      jobId: email.id,
      delay,
    }
  );
}
