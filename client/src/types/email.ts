export type EmailStatus =
  | "SCHEDULED"
  | "PROCESSING"
  | "SENT"
  | "FAILED";

export interface Email {
  id: string;
  recipient: string;
  subject: string;
  body: string;
  scheduledAt: string;
  sentAt?: string | null;
  status: EmailStatus;
  messageId?: string | null;
  bullJobId?: string | null;
  sender?: {
    id: string;
    email: string;
    name?: string | null;
  };
}

export interface ScheduleEmailRequest {
  senderEmail: string;
  senderName?: string;
  recipient: string;
  subject: string;
  body: string;
  scheduledAt: string;
}

export interface ScheduleEmailResponse {
  success: boolean;
  message: string;
  emailId: string;
  jobId: string;
  scheduledAt: string;
  status: EmailStatus;
}