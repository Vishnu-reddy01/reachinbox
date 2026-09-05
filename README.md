# ReachInbox Email Scheduler

A full-stack email scheduling application for sending individual and bulk emails with scheduling, rate limiting, background processing, and email tracking.

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Google OAuth
- Lucide React

### Backend
- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- Redis
- BullMQ
- Nodemailer
- Ethereal Email

---

## Features

### Backend
- Email scheduling
- Bulk email scheduling
- PostgreSQL persistence
- Redis + BullMQ job queue
- Background email worker
- Configurable email delay
- Configurable hourly limit
- Worker concurrency
- Email cancellation
- Email status tracking
- Retry handling

### Frontend
- Google Login
- Dashboard
- Compose Email
- CSV recipient upload
- Date & time scheduling
- Delay configuration
- Hourly limit configuration
- Scheduled Emails table
- Sent Emails table
- Cancel scheduled email
- Email status tracking

---

# Project Structure

```text
ReachInbox/
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── queues/
│   │   ├── services/
│   │   ├── workers/
│   │   └── server.ts
│   ├── prisma/
│   └── package.json
│
├── client/
│   ├── src/
│   └── package.json
│
├── README.md
└── .gitignore
Setup
Prerequisites

Install:

Node.js
npm
PostgreSQL
Redis
## **⚡ Running the Project **

The project requires 3 terminals.

** Terminal 1 — Backend **
cd server
npm install
npm run dev

This starts the Express backend server.

** Terminal 2 — BullMQ Worker **

Open a second terminal:

cd server
npm run worker

You should see:

Email worker started

The worker processes scheduled emails in the background.

** Terminal 3 — Frontend **

Open a third terminal:

cd client
npm install
npm run dev

Open the URL shown by Vite, usually:

http://localhost:5173
Environment Variables
Backend

Create:

server/.env

Add:

PORT=5000

DATABASE_URL="your_postgresql_connection_string"

REDIS_HOST=localhost
REDIS_PORT=6379

GOOGLE_CLIENT_ID="your_google_client_id"

JWT_SECRET="your_jwt_secret"

SMTP_HOST="smtp.ethereal.email"
SMTP_PORT=587
SMTP_USER="your_ethereal_username"
SMTP_PASS="your_ethereal_password"

WORKER_CONCURRENCY=5
Frontend

Create the required frontend environment file:

client/.env

Example:

VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id

Never commit .env files or credentials to GitHub.

Database Setup

Configure PostgreSQL and set:

DATABASE_URL="your_postgresql_connection_string"

Then run:

cd server
npx prisma generate
npx prisma migrate dev
Ethereal Email Setup

The application uses Ethereal Email + Nodemailer for testing email delivery.

Add your Ethereal SMTP credentials to:

server/.env
SMTP_HOST="smtp.ethereal.email"
SMTP_PORT=587
SMTP_USER="your_ethereal_username"
SMTP_PASS="your_ethereal_password"

After sending an email, the worker generates an Ethereal Preview URL that can be opened to view the test email.

Architecture
Frontend
   │
   ▼
Express API
   │
   ├──────────────► PostgreSQL
   │                    │
   │                    ▼
   │                 Prisma
   │
   ▼
BullMQ
   │
   ▼
Redis
   │
   ▼
Email Worker
   │
   ▼
Nodemailer
   │
   ▼
Ethereal Email
How Scheduling Works
User selects recipients and schedule time.
Frontend sends the request to the backend.
Backend stores the email in PostgreSQL.
A delayed BullMQ job is added to Redis.
Worker waits for the scheduled job.
Worker sends the email using Nodemailer.
Email status is updated to SENT.
Status Flow
SCHEDULED → PROCESSING → SENT
                         │
                         └── FAILED

Scheduled emails can also be cancelled:

SCHEDULED → CANCELLED
Persistence

Email records are stored in PostgreSQL using Prisma.

Scheduled jobs are stored in Redis through BullMQ.

Therefore, scheduling does not depend only on frontend or in-memory state.

Rate Limiting

Bulk emails support:

Delay between emails
Hourly sending limit

Example:

Hourly Limit = 50

Emails 1–50   → First hour
Emails 51–100 → Second hour

Each email within an hour can also use the configured delay.

Concurrency

The BullMQ worker supports configurable concurrency.

Default:

WORKER_CONCURRENCY=5

This allows multiple email jobs to be processed concurrently.

Retry Handling

BullMQ is configured with:

Attempts: 3
Backoff: Exponential
Delay: 5000 ms

Failed jobs are retried automatically before being marked as failed.

Bulk Email Flow
CSV Upload
    ↓
Extract Emails
    ↓
Remove Duplicates
    ↓
Select Schedule
    ↓
Apply Delay + Hourly Limit
    ↓
Create BullMQ Jobs
    ↓
Worker Sends Emails
Available Scripts
Backend
npm run dev

Start development server.

npm run worker

Start BullMQ email worker.

npm run build

Build backend.

npm start

Start production backend.

Frontend
npm run dev

Start development server.

npm run build

Build frontend.

npm run preview

Preview production build.

Feature Mapping
Area	Features
Backend	Scheduler, persistence, rate limiting, concurrency, BullMQ worker, cancellation, retries
Frontend	Google Login, Dashboard, Compose, CSV upload, scheduling, tables, status tracking
Email	Nodemailer, Ethereal SMTP, preview URLs
Queue	Redis + BullMQ
Security
Environment variables are used for secrets.
.env files are excluded from Git.
Google credentials are verified on the backend.
Database and SMTP credentials are not stored in source code.
License

This project was created as a technical assessment/project implementation.


### After adding the README

Run:

```bash
git add README.md
git commit -m "Add README documentation"
git push




<img width="1031" height="862" alt="image" src="https://github.com/user-attachments/assets/064a147d-0019-4be8-a7b4-70f092e087ac" />

<img width="1033" height="867" alt="image" src="https://github.com/user-attachments/assets/983d9e83-989c-4f1f-8986-805ccea17b95" />
<img width="1008" height="571" alt="image" src="https://github.com/user-attachments/assets/bba1f0e0-4861-4a51-addc-f314ea0bbe9c" />




## BullMQ Dashboard

With the backend running, open `http://localhost:5000/admin/queues` for a live queue dashboard. The page refreshes every 2 seconds and shows waiting, active, delayed, completed, and failed jobs.


## Deployment URL convention

Set `VITE_API_URL` to the backend origin only, for example `https://your-backend.onrender.com`. Do not append `/api` to `VITE_API_URL`; the frontend adds `/api` to each backend route.
