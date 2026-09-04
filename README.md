# ReachInbox Email Scheduler

A full-stack email scheduling application that allows users to authenticate with Google, compose emails, upload recipient lists through CSV files, schedule emails, send bulk emails with configurable delays and hourly limits, and monitor scheduled and sent emails from a dashboard.

---

## Features

### Backend

- Google authentication
- Email scheduling
- Bulk email scheduling
- Persistent email records using PostgreSQL and Prisma
- Background email processing using BullMQ
- Redis-based job queue
- Configurable worker concurrency
- Configurable delay between emails
- Hourly email limit
- Email cancellation
- Email status tracking
- Sent email tracking
- Failed email handling
- Ethereal Email integration for email testing

### Frontend

- Google Login
- Dashboard
- Compose Email
- CSV recipient upload
- Email scheduling
- Bulk email scheduling
- Date and time selection
- Delay configuration
- Hourly sending limit
- Scheduled Emails table
- Sent Emails table
- Email status display
- Cancel scheduled email
- Responsive dark UI

  🚀 How to Run the Project
1. Start PostgreSQL and Redis

Make sure PostgreSQL and Redis are running on your system.

2. Start the Backend API

Open a terminal:

cd backend
npm install
npm run dev

Backend will start in development mode.

3. Start the BullMQ Email Worker

⚠️ Open a SECOND terminal and run:

cd backend
npm run worker

You should see:

Email worker started

The worker is responsible for processing scheduled emails in the background.

4. Start the Frontend

⚠️ Open a THIRD terminal:

cd frontend
npm install
npm run dev

Vite will display the frontend URL in the terminal, usually:

http://localhost:5173

Open that URL in your browser.

⚡ Quick Start

You need 3 terminals running:

Terminal 1 — Backend

cd backend
npm run dev

Terminal 2 — Email Worker

cd backend
npm run worker

Terminal 3 — Frontend

cd frontend
npm run dev
Running Architecture
Terminal 1
Backend API
     │
     ▼
PostgreSQL + Redis
     ▲
     │
Terminal 2
BullMQ Email Worker
     ▲
     │
Terminal 3
Frontend

---

# Architecture

```text
                    ┌─────────────────────┐
                    │      Frontend       │
                    │   React + Vite      │
                    └──────────┬──────────┘
                               │
                               │ HTTP API
                               ▼
                    ┌─────────────────────┐
                    │       Backend       │
                    │ Express + TypeScript│
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐         ┌─────────────────┐
        │   PostgreSQL    │         │      Redis      │
        │ Prisma ORM      │         │    BullMQ Queue │
        └─────────────────┘         └────────┬────────┘
                                             │
                                             ▼
                                   ┌─────────────────┐
                                   │  Email Worker   │
                                   │     BullMQ      │
                                   └────────┬────────┘
                                            │
                                            ▼
                                   ┌─────────────────┐
                                   │ Ethereal Email  │
                                   │      SMTP       │
                                   └─────────────────┘
Tech Stack
Frontend
React
TypeScript
Vite
Tailwind CSS
Axios
React OAuth
Lucide React
Backend
Node.js
Express
TypeScript
Prisma
PostgreSQL
Redis
BullMQ
Nodemailer
Google Auth Library
JSON Web Token
Email
Ethereal Email
Nodemailer
Project Structure
ReachInbox/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── queues/
│   │   ├── services/
│   │   ├── workers/
│   │   └── server.ts
│   │
│   ├── prisma/
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── README.md
└── .gitignore
Prerequisites

Make sure the following are installed:

Node.js
npm
PostgreSQL
Redis
Git

Check Node.js:

node -v

Check npm:

npm -v
Backend Setup

Navigate to the backend directory:

cd backend

Install dependencies:

npm install
Environment Variables

Create a .env file inside the backend directory.

Example:

PORT=5000

DATABASE_URL="your_postgresql_connection_string"

REDIS_HOST=localhost
REDIS_PORT=6379

GOOGLE_CLIENT_ID="your_google_client_id"

JWT_SECRET="your_jwt_secret"

ETHEREAL_HOST="smtp.ethereal.email"
ETHEREAL_PORT=587
ETHEREAL_USER="your_ethereal_username"
ETHEREAL_PASSWORD="your_ethereal_password"

WORKER_CONCURRENCY=5

Do not commit your .env file to GitHub.

PostgreSQL Setup

Create a PostgreSQL database for the application.

Set the database connection string in:

DATABASE_URL="your_postgresql_connection_string"

Example format:

DATABASE_URL="postgresql://username:password@localhost:5432/reachinbox"

After configuring the database, run the Prisma migrations/schema setup used by the project.

For Prisma commands, use:

npx prisma generate

and:

npx prisma migrate dev
Redis Setup

Redis is used by BullMQ for background email scheduling and processing.

Make sure Redis is running before starting the backend worker.

Default local configuration:

REDIS_HOST=localhost
REDIS_PORT=6379
Running the Backend

The backend provides separate commands for the API server and email worker.

Start the development server

From the backend directory:

npm run dev

The Express API server will start in development mode.

Start the email worker

Open another terminal and navigate to the backend:

cd backend

Then run:

npm run worker

The worker processes scheduled email jobs from the BullMQ queue.

You should see:

Email worker started
Production Build

Build the backend:

npm run build

Start the compiled backend:

npm start

The worker can be started separately using:

npm run worker
Frontend Setup

Navigate to the frontend directory:

cd frontend

Install dependencies:

npm install
Frontend Environment Variables

Create the required frontend environment file according to the API and Google OAuth configuration used by the project.

Example:

VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id

Use the correct Google Client ID configured for the application.

Do not commit environment files containing secrets.

Running the Frontend

Start the Vite development server:

npm run dev

The frontend will be available at the local Vite development URL shown in the terminal.

Frontend Production Build

Build the frontend:

npm run build

Preview the production build:

npm run preview
Ethereal Email Setup

The application uses Ethereal Email with Nodemailer for testing email delivery.

Ethereal provides a fake SMTP service that allows emails to be generated and viewed through an Ethereal preview URL without sending them to real recipients.

Create an Ethereal Email account and obtain the SMTP credentials.

Configure the credentials in the backend .env file:

ETHEREAL_HOST="smtp.ethereal.email"
ETHEREAL_PORT=587
ETHEREAL_USER="your_ethereal_username"
ETHEREAL_PASSWORD="your_ethereal_password"

The backend uses Nodemailer to send the email through the configured Ethereal SMTP transporter.

After an email is successfully sent, the worker generates an Ethereal preview URL.

Example:

Ethereal Preview URL:
https://ethereal.email/message/...

The preview URL can be opened to inspect the test email.

How Email Scheduling Works

When a user schedules an email:

User
 │
 │ Select recipient, subject,
 │ message and schedule time
 ▼
Frontend
 │
 │ HTTP Request
 ▼
Express Backend
 │
 │ Create email record
 ▼
PostgreSQL
 │
 │ Add scheduled job
 ▼
BullMQ
 │
 ▼
Redis
 │
 │ Wait until scheduled time
 ▼
Email Worker
 │
 │ Process job
 ▼
Nodemailer
 │
 ▼
Ethereal SMTP
 │
 ▼
Email Sent

The scheduled email is first stored in the database.

A BullMQ delayed job is then created for the scheduled time.

When the scheduled time is reached, the worker picks up the job and sends the email through Nodemailer.

Email Status Flow

Emails move through different statuses during their lifecycle.

SCHEDULED
    │
    ▼
PROCESSING
    │
    ▼
   SENT

If sending fails:

PROCESSING
    │
    ▼
  FAILED

A scheduled email can also be cancelled:

SCHEDULED
    │
    ▼
CANCELLED
Persistence on Restart

Email information is persisted in PostgreSQL using Prisma.

The application does not depend only on in-memory state.

Scheduled email records are stored in the database and BullMQ jobs are stored using Redis.

This allows the application to maintain the scheduling state when the backend process is restarted.

When the application and worker are started again, the persisted queue/database state can be used to continue processing scheduled jobs.

Rate Limiting

Bulk email scheduling supports a configurable hourly limit.

For example:

Hourly Limit = 50

The scheduler divides recipients into hourly buckets.

Emails 0 - 49
    → First hour

Emails 50 - 99
    → Second hour

Emails 100 - 149
    → Third hour

The scheduler also supports a configurable delay between individual emails.

For example:

Delay = 10 seconds

Emails within the same hourly bucket are scheduled with the configured delay between them.

Worker Concurrency

The BullMQ worker supports configurable concurrency.

The default configuration is:

WORKER_CONCURRENCY=5

The worker is configured to process multiple jobs concurrently.

The concurrency value can be changed through the environment variable:

WORKER_CONCURRENCY=5

This allows the number of simultaneously processed email jobs to be controlled without changing the worker implementation.

Bulk Email Scheduling

The application supports scheduling multiple recipients at once.

The user can:

Upload a CSV file.
Extract email addresses.
Select the subject.
Write the email message.
Select the start date and time.
Configure the delay.
Configure the hourly limit.
Schedule the emails.

Each recipient is scheduled as an individual email job.

CSV Recipient Upload

The frontend supports uploading a CSV file containing email addresses.

The uploaded file is read and email addresses are extracted.

Duplicate email addresses are removed before scheduling.

If no valid email addresses are found, the application displays an appropriate message.

Google Authentication

Users can log in using Google authentication.

The frontend receives the Google credential and sends it to the backend.

The backend verifies the credential using Google's authentication library.

The user's Google account information is then stored or updated in the database.

The application uses the authenticated user's email to associate email activity with the corresponding sender.

Dashboard

The dashboard provides an overview of email activity.

It includes:

Scheduled emails
Sent emails
Email status
Recipient information
Sender information
Scheduled time
Sent time
Email cancellation

The dashboard retrieves email information from the backend API.

Compose Email

The compose interface allows users to create scheduled emails.

Users can enter:

Recipient information
Subject
Message
Schedule date
Schedule time
Delay between emails
Hourly limit

The application validates the required information before submitting the scheduling request.

Email Cancellation

A scheduled email can be cancelled before it is processed.

The cancellation process:

User
 │
 ▼
Cancel Email
 │
 ▼
Backend
 │
 ├── Find email
 │
 ├── Find BullMQ job
 │
 ├── Remove delayed job
 │
 └── Update database
        │
        ▼
    CANCELLED

An email that has already been sent cannot be cancelled.

Error Handling

The backend handles errors during:

Authentication
Email scheduling
Bulk scheduling
Email processing
Database operations
Email sending
Email cancellation

Failed email jobs are marked as:

FAILED

BullMQ is configured with retry attempts and exponential backoff.

Default configuration:

Attempts: 3
Backoff: Exponential
Initial delay: 5000 ms
API Overview

The backend exposes APIs for:

Google authentication
Scheduling individual emails
Scheduling bulk emails
Fetching scheduled emails
Fetching sent emails
Cancelling scheduled emails

The frontend communicates with these APIs using Axios.

Development Workflow

Start PostgreSQL and Redis first.

Then start the backend API:

cd backend
npm run dev

In another terminal, start the BullMQ worker:

cd backend
npm run worker

In another terminal, start the frontend:

cd frontend
npm run dev

The application can then be accessed through the frontend development URL.

Feature Mapping
Backend
Requirement	Implementation
Scheduler	BullMQ delayed jobs
Persistence	PostgreSQL + Prisma
Rate Limiting	Configurable hourly email limit
Concurrency	BullMQ worker concurrency
Bulk Scheduling	Multiple recipient scheduling
Email Processing	Background BullMQ worker
Email Delivery	Nodemailer + Ethereal
Cancellation	BullMQ job removal + database status
Retry Handling	BullMQ retry and exponential backoff
Status Tracking	SCHEDULED, PROCESSING, SENT, FAILED, CANCELLED
Frontend
Requirement	Implementation
Login	Google Authentication
Dashboard	Email activity dashboard
Compose	Email composition interface
CSV Upload	Recipient extraction from CSV
Scheduling	Date and time selection
Scheduled Emails	Scheduled emails table
Sent Emails	Sent emails table
Cancellation	Cancel scheduled email
Bulk Email	Multiple recipient scheduling
Delay	Configurable delay between emails
Hourly Limit	Configurable hourly sending limit
Scripts
Backend
npm run dev

Starts the backend development server.

npm run build

Builds the TypeScript backend.

npm start

Starts the compiled backend.

npm run worker

Starts the BullMQ email worker.

Frontend
npm run dev

Starts the Vite development server.

npm run build

Builds the frontend for production.

npm run preview

Previews the production frontend build.

Environment Variable Security

Never commit credentials to GitHub.

The following types of information should remain inside .env files:

Database credentials
Redis credentials
Google OAuth credentials
JWT secrets
Ethereal SMTP credentials

The repository should contain only environment variable names/examples and not actual secret values.

Conclusion

ReachInbox Email Scheduler combines a React frontend with an Express backend, PostgreSQL persistence, Redis, BullMQ background processing, and Ethereal Email to provide a reliable email scheduling workflow.

The system supports both individual and bulk email scheduling while providing configurable delays, hourly limits, concurrency, cancellation, persistence, and dashboard-based email tracking.


### After creating the file

From the **root project folder**, run:

```bash
git add README.md
git commit -m "Add project documentation"
git push
