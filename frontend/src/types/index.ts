export interface User {
  id: string
  email: string
  name: string | null
  picture: string | null
}

export interface Email {
  id: string
  userId: string
  to: string
  subject: string
  body: string
  scheduledFor: string
  sentAt: string | null
  status: 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED' | 'RATE_LIMITED'
  errorMessage: string | null
  createdAt: string
  updatedAt: string
}

export interface ScheduleEmailRequest {
  emails: string[]
  subject: string
  body: string
  startTime: string
  delayBetweenEmails: number
  maxEmailsPerHour: number
}
