import { Router } from "express";
import meetingsCtrl from "../controllers/meetings.js";

const meetingsRouter = Router();

// GET /api/meetings
meetingsRouter.get("/", meetingsCtrl.getAllMeetings);

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

export default meetingsRouter;
