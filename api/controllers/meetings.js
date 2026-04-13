import Meeting from "../models/meetings.js";
import ConfirmedMeeting from "../models/meetings.js";

// Vsa srečanja
const getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.status(200).json(meetings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ustvari srečanje
const createMeeting = async (req, res) => {
  try {
    const meeting = new Meeting(req.body);
    await meeting.save();
    res.status(201).json(meeting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Izbriši srečanje
const deleteMeeting = async (req, res) => {
  try {
    await Meeting.findByIdAndDelete(req.params.meetingId);
    res.status(204).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Potrjena srečanja uporabnika
const getUserConfirmedMeetings = async (req, res) => {
  try {
    const meetings = await ConfirmedMeeting.find({ userId: parseInt(req.params.userId) });
    res.status(200).json(meetings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Potrdi srečanje
const confirmMeeting = async (req, res) => {
  try {
    const confirmed = new ConfirmedMeeting(req.body);
    await confirmed.save();
    res.status(201).json(confirmed);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Prekliči potrjeno srečanje
const cancelConfirmedMeeting = async (req, res) => {
  try {
    await ConfirmedMeeting.findByIdAndDelete(req.params.meetingId);
    res.status(204).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  getAllMeetings,
  createMeeting,
  deleteMeeting,
  getUserConfirmedMeetings,
  confirmMeeting,
  cancelConfirmedMeeting
};