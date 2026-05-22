import { Router } from "express";
import meetingsCtrl from "../controllers/meetings.js";
import { protect } from "../middleware/auth.js";

const meetingsRouter = Router();

// GET /api/meetings
meetingsRouter.get("/", meetingsCtrl.getAllMeetings);

// GET /api/meetings/:meetingId/chat-context
meetingsRouter.get("/:meetingId/chat-context", protect, meetingsCtrl.getMeetingChatContext);

// POST /api/meetings
meetingsRouter.post("/", meetingsCtrl.createMeeting);

// DELETE /api/meetings/:meetingId
meetingsRouter.delete("/:meetingId", meetingsCtrl.deleteMeeting);

// GET /api/meetings/confirmed/:userId
meetingsRouter.get("/confirmed/:userId", meetingsCtrl.getUserConfirmedMeetings);

// POST /api/meetings/confirm
meetingsRouter.post("/confirm", meetingsCtrl.confirmMeeting);

// DELETE /api/meetings/confirm/:meetingId
meetingsRouter.delete("/confirm/:meetingId", meetingsCtrl.cancelConfirmedMeeting);

meetingsRouter.get('/:meetingId', meetingsCtrl.getMeetingById);

export default meetingsRouter;
