# ReachInbox Email Scheduler

A production-grade email scheduler service with dashboard for scheduling and sending emails at scale.

##  Features

### Backend
- Express.js API with TypeScript
- BullMQ for persistent job scheduling (backed by Redis)
- PostgreSQL for data persistence
- Ethereal Email for SMTP testing
- Google OAuth authentication
- Rate limiting per sender (configurable per hour)
- Worker concurrency (5 simultaneous jobs)
- Delay between emails (2 seconds minimum)
- Restart persistence (jobs survive server restart)

### Frontend
- Next.js 14 with App Router
- TypeScript + Tailwind CSS
- React Query for data fetching
- Google OAuth login
- User profile display (name, email, avatar)
- Compose email modal with CSV upload
- Scheduled and sent emails tables
- Real-time status updates

## Architecture

### How Scheduling Works
1. User schedules emails via dashboard
2. Email jobs stored in PostgreSQL with metadata
3. BullMQ creates delayed jobs in Redis with exact send times
4. Worker processes jobs with configured concurrency
5. Rate limiting enforced via Redis counters (per-hour windows)
6. Jobs delayed to next available slot if rate limit exceeded

### Persistence on Restart
- All scheduled jobs stored in PostgreSQL with status tracking
- BullMQ persists jobs in Redis (survives restarts)
- On startup, system reconciles DB state with queue state
- No duplicate sends (idempotency via unique job IDs)

### Rate Limiting & Concurrency
- **Worker Concurrency**: 5 concurrent jobs (configurable)
- **Delay Between Emails**: 2 seconds minimum
- **Hourly Rate Limit**: 200 emails per sender (configurable)
- **Implementation**: Redis-backed counters with sliding window
- **Behavior on Limit**: Jobs delayed to next hour window

## 🚀 Tech Stack

### Backend
- TypeScript
- Express.js
- BullMQ + Redis
- PostgreSQL with Prisma ORM
- Nodemailer + Ethereal Email
- Passport.js (Google OAuth)

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Query
- Axios

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Google OAuth credentials

##  Setup Instructions

### 1. Clone Repository
```bash
git clone <repository-url>
cd reachinbox-scheduler
```

### 2. Environment Setup

#### Backend (.env)
Create `backend/.env`:
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/emailscheduler"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Ethereal Email (get from https://ethereal.email)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-ethereal-user
SMTP_PASS=your-ethereal-pass

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# Rate Limiting
MAX_EMAILS_PER_HOUR_PER_SENDER=200
WORKER_CONCURRENCY=5
MIN_DELAY_BETWEEN_EMAILS=2000

# Server
PORT=3001
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your-session-secret
```

#### Frontend (.env.local)
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Get Ethereal Email Credentials
1. Visit https://ethereal.email
2. Click "Create Ethereal Account"
3. Copy SMTP credentials to `backend/.env`

### 4. Setup Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:3001/auth/google/callback`
4. Copy Client ID and Secret to `backend/.env`

### 5. Start Infrastructure
```bash
docker-compose up -d
```

### 6. Backend Setup
```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

### 7. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 8. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

##  Project Structure

```
reachinbox-scheduler/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── workers/         # Background workers
│   │   └── index.ts         # Entry point
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js pages
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities
│   │   └── types/           # TypeScript types
│   └── package.json
├── docker-compose.yml       # Docker services
└── README.md
```

## API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/logout` - Logout
- `GET /auth/me` - Get current user

### Email Scheduling
- `POST /api/emails/schedule` - Schedule emails
- `GET /api/emails/scheduled` - Get scheduled emails
- `GET /api/emails/sent` - Get sent emails
- `GET /api/emails/:id` - Get email details

## Testing

### Schedule Test Emails
1. Login with Google
2. Click "Compose"
3. Enter recipient emails or upload CSV
4. Set subject, message, and timing
5. Click "Schedule Emails"
6. View in Scheduled tab
7. Check Ethereal Email inbox for sent emails

### Test Rate Limiting
1. Schedule 300+ emails with same start time
2. Set hourly limit to 50
3. Observe first 50 send in first hour
4. Next 50 delayed to hour 2
5. Pattern continues until all sent

## Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  googleId  String   @unique
  email     String   @unique
  name      String?
  picture   String?
  emails    Email[]
}

model Email {
  id            String      @id @default(uuid())
  userId        String
  to            String
  subject       String
  body          String
  scheduledFor  DateTime
  sentAt        DateTime?
  status        EmailStatus
  jobId         String?     @unique
  errorMessage  String?
}

enum EmailStatus {
  SCHEDULED
  SENDING
  SENT
  FAILED
  RATE_LIMITED
}
```

## 🎨 UI Features

- Clean, modern design with Tailwind CSS
- Responsive layout (mobile, tablet, desktop)
- Loading states and error handling
- Empty states with helpful messages
- Color-coded status badges
- Real-time updates via React Query

##  Security

- Google OAuth for authentication
- Session-based auth with secure cookies
- CORS configuration for frontend
- Environment variables for secrets
- SQL injection prevention (Prisma)
- XSS protection (React)

## Status Codes

- `SCHEDULED` - Email queued for sending
- `SENDING` - Currently being sent
- `SENT` - Successfully sent
- `FAILED` - Send failed (with error message)
- `RATE_LIMITED` - Delayed due to rate limit

##  Performance

- Concurrent processing: 5 emails simultaneously
- Rate limiting: Configurable per sender
- Delay between sends: 2 seconds minimum
- Job persistence: Survives server restarts
- Efficient queries: Database indexes on key fields




