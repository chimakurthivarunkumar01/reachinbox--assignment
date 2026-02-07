import { Request, Response } from 'express';
import { scheduleEmailJob } from '../services/emailScheduler';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export async function scheduleEmails(req: Request, res: Response) {
  try {
    const { emails, subject, body, startTime, delayBetweenEmails, maxEmailsPerHour } = req.body;
    const userId = (req.user as any).id;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: 'Emails array is required' });
    }

    const scheduledEmails = [];
    let currentTime = new Date(startTime);

    for (let i = 0; i < emails.length; i++) {
      const email = await prisma.email.create({
        data: {
          userId,
          to: emails[i],
          subject,
          body,
          scheduledFor: currentTime,
          status: 'SCHEDULED',
        },
      });

      await scheduleEmailJob(email, maxEmailsPerHour || 200);
      scheduledEmails.push(email);

      // Add delay for next email
      currentTime = new Date(currentTime.getTime() + (delayBetweenEmails || 2000));
    }

    res.json({ 
      message: `${scheduledEmails.length} emails scheduled`,
      emails: scheduledEmails 
    });
  } catch (error) {
    console.error('Error scheduling emails:', error);
    res.status(500).json({ error: 'Failed to schedule emails' });
  }
}

export async function getScheduledEmails(req: Request, res: Response) {
  try {
    const userId = (req.user as any).id;
    const emails = await prisma.email.findMany({
      where: {
        userId,
        status: { in: ['SCHEDULED', 'RATE_LIMITED'] },
      },
      orderBy: { scheduledFor: 'asc' },
    });
    res.json(emails);
  } catch (error) {
    console.error('Error fetching scheduled emails:', error);
    res.status(500).json({ error: 'Failed to fetch scheduled emails' });
  }
}

export async function getSentEmails(req: Request, res: Response) {
  try {
    const userId = (req.user as any).id;
    const emails = await prisma.email.findMany({
      where: {
        userId,
        status: { in: ['SENT', 'FAILED'] },
      },
      orderBy: { sentAt: 'desc' },
    });
    res.json(emails);
  } catch (error) {
    console.error('Error fetching sent emails:', error);
    res.status(500).json({ error: 'Failed to fetch sent emails' });
  }
}

export async function getEmailById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = (req.user as any).id;
    
    const email = await prisma.email.findFirst({
      where: { id, userId },
    });

    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    res.json(email);
  } catch (error) {
    console.error('Error fetching email:', error);
    res.status(500).json({ error: 'Failed to fetch email' });
  }
}
