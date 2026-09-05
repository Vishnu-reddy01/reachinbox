import { Router } from "express";
import {
  scheduleEmailController,
  getScheduledEmails,
  getSentEmails,
  cancelEmailController,
  scheduleBulkEmailsController,
  searchEmailsController,
} from "../controllers/email.controller.js";

const router = Router();

router.post("/schedule", scheduleEmailController);

router.get("/scheduled", getScheduledEmails);

router.get("/sent", getSentEmails);

router.get("/search", searchEmailsController);

router.delete("/:id", cancelEmailController);

router.post("/schedule-bulk", scheduleBulkEmailsController);

export default router;