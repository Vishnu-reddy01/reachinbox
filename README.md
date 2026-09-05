# ReachInbox - Full Stack Email Scheduler

A full-stack email scheduling system built for the ReachInbox hiring assignment.

## Tech Stack

### Backend
- TypeScript
- Express.js
- BullMQ
- Redis
- PostgreSQL/MySQL
- Elasticsearch
- Nodemailer
- Ethereal Email

### Frontend
- React
- TypeScript
- Tailwind CSS

---

# Features

## Backend

- Email scheduling API
- BullMQ delayed jobs
- Redis-backed persistent queue
- Database persistence
- Configurable worker concurrency
- Configurable delay between email sends
- Configurable hourly email rate limit
- Multiple email senders
- Idempotent email processing
- Elasticsearch indexing/search
- BullMQ queue monitoring
- Ethereal Email SMTP integration
- Restart-safe scheduled jobs

## Frontend

- Google OAuth login
- User profile
- Dashboard
- Scheduled Emails table
- Sent Emails table
- Compose Email modal
- CSV/text lead upload
- Email address parsing
- Scheduled start time
- Configurable delay
- Configurable hourly limit
- Loading states
- Empty states
- Error handling
- Logout

---

# Architecture

```text
React Frontend
       |
       v
Express REST API
       |
       +--------> PostgreSQL/MySQL
       |
       +--------> Redis
       |             |
       |             v
       |          BullMQ
       |             |
       |             v
       |          Worker
       |             |
       |             v
       |        Ethereal SMTP
       |
       +--------> Elasticsearch
Scheduling

## When an email is scheduled:

Frontend sends the request to the backend.
Backend stores the email in the database.
Backend creates a delayed BullMQ job.
BullMQ keeps the job in Redis until the scheduled time.
Worker processes the job when it becomes available.
Email is sent through Ethereal SMTP.
Database status is updated to sent or failed.
Email information is indexed in Elasticsearch.
Persistence

BullMQ stores delayed jobs in Redis instead of keeping them only in application memory.

Therefore, restarting the Express server does not remove future jobs.

The email status is also stored in the database, allowing the worker to determine whether an email has already been processed.

Concurrency

Worker concurrency is configurable through environment variables.

Example:

WORKER_CONCURRENCY=5

This allows multiple jobs to be processed concurrently while keeping the value configurable.

Email Delay

A minimum delay between email sends is configured through environment variables.

Example:

EMAIL_DELAY_MS=2000

This helps simulate provider throttling.

Rate Limiting

Hourly email limits are configurable through environment variables.

Example:

MAX_EMAILS_PER_HOUR=200

Redis-backed rate-limit state is used so that limits can be shared across workers/instances.

When the hourly limit is reached, jobs are delayed/rescheduled instead of being permanently dropped.

Idempotency

Before sending an email, the worker checks the persisted email status.

Already sent emails are not sent again.

Environment Variables

Create a .env file in the backend:

PORT=5000

DATABASE_URL=your_database_url

REDIS_URL=redis://localhost:6379

ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_API_KEY=your_api_key

ETHEREAL_HOST=smtp.ethereal.email
ETHEREAL_PORT=587
ETHEREAL_USER=your_ethereal_username
ETHEREAL_PASSWORD=your_ethereal_password

WORKER_CONCURRENCY=5
EMAIL_DELAY_MS=2000
MAX_EMAILS_PER_HOUR=200

Use the actual environment variable names from the backend code if they differ.

Ethereal Email Setup
Visit https://ethereal.email/
Create a test account.
Copy the SMTP username and password.
Add the credentials to the backend .env.
Start the backend and worker.
Scheduled emails will be sent through Ethereal SMTP.
The generated preview URL can be used to inspect test emails.



############################# Backend Setup ##############################
cd backend
npm install

Start Redis and database.

Then:

npm run dev

Start the BullMQ worker using the project's worker command.

Example:

npm run worker
############################ Frontend Setup #################################
cd frontend
npm install
npm run dev

Open the frontend in the browser.

Docker

If Docker Compose is provided:

docker compose up -d

This starts the required infrastructure such as Redis and the database.

Demo

The demo video demonstrates:

Creating scheduled emails.
Uploading email leads.
Viewing scheduled emails.
Viewing sent emails.
Restarting the backend.
Confirming that future scheduled emails are preserved.
Assumptions / Trade-offs
Ethereal Email is used as a test SMTP provider and does not deliver production emails.
Rate limits and delays are configurable through environment variables.
The implementation prioritizes reliability and clear architecture for the assignment.
Google OAuth and Slack integration require their respective credentials/configuration.
Elasticsearch is used for email indexing and searchability.
