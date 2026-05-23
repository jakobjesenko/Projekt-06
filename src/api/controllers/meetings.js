import Meeting from "../models/meetings.js";
import ConfirmedMeeting from "../models/meetings.js";

/**
 * @openapi
 * /meetings:
 *  get:
 *   summary: Get all meetings
 *   description: Returns a paginated list of meetings.
 *   tags: [Meetings]
 *   parameters:
 *    - name: page
 *      in: query
 *      schema:
 *       type: integer
 *       minimum: 1
 *       default: 1
 *      description: Page number for pagination
 *    - name: limit
 *      in: query
 *      schema:
 *       type: integer
 *       minimum: 1
 *       maximum: 100
 *       default: 30
 *      description: Number of items per page
 *    - name: status
 *      in: query
 *      schema:
 *       type: string
 *       enum: [pending, confirmed, canceled]
 *      description: Filter meetings by status
 *    - name: search
 *      in: query
 *      schema:
 *       type: string
 *      description: Search by title, description, or location
 *    - name: dateFrom
 *      in: query
 *      schema:
 *       type: string
 *       format: date-time
 *      description: Include meetings on or after this date
 *    - name: dateTo
 *      in: query
 *      schema:
 *       type: string
 *       format: date-time
 *      description: Include meetings on or before this date
 *   responses:
 *    '200':
 *     description: Successfully retrieved meetings
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *         data:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/Meeting'
 *         pagination:
 *          type: object
 *          properties:
 *           total:
 *            type: integer
 *           page:
 *            type: integer
 *           totalPages:
 *            type: integer
 *       example:
 *        success: true
 *        data: []
 *        pagination:
 *         total: 0
 *         page: 1
 *         totalPages: 0
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */
// Vsa srečanja
const getAllMeetings = async (req, res) => {
  try {
    let page = Number.parseInt(req.query.page, 10) || 1;
    let limit = Number.parseInt(req.query.limit, 10) || 30;

    if (page < 1) page = 1;
    if (limit < 1) limit = 30;
    if (limit > 100) limit = 100;

    const allowedStatuses = ['pending', 'confirmed', 'canceled'];
    const status = allowedStatuses.includes(req.query.status) ? req.query.status : null;

    const options = {
      page,
      limit,
      status,
      search: req.query.search || '',
      dateFrom: req.query.dateFrom || null,
      dateTo: req.query.dateTo || null,
    };

    const { meetings, totalCount } = await Meeting.getPaginatedMeetings(options);

    res.status(200).json({
      success: true,
      data: meetings,
      pagination: {
        total: totalCount,
        page,
        totalPages: totalCount > 0 ? Math.ceil(totalCount / limit) : 0,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /meetings:
 *  post:
 *   summary: Create a meeting
 *   description: Creates a new meeting.
 *   tags: [Meetings]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Meeting'
 *   responses:
 *    '201':
 *     description: Meeting created
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Meeting'
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */
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

/**
 * @openapi
 * /meetings/{meetingId}:
 *  delete:
 *   summary: Delete a meeting
 *   description: Deletes a meeting by ID.
 *   tags: [Meetings]
 *   parameters:
 *    - name: meetingId
 *      in: path
 *      required: true
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: Meeting ID
 *      example: 507f1f77bcf86cd799439015
 *   responses:
 *    '204':
 *     description: Meeting deleted
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */
// Izbriši srečanje
const deleteMeeting = async (req, res) => {
  try {
    await Meeting.findByIdAndDelete(req.params.meetingId);
    res.status(204).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /meetings/confirmed/{userId}:
 *  get:
 *   summary: Get meetings for user
 *   description: Retrieves meetings where the user is a member.
 *   tags: [Meetings]
 *   parameters:
 *    - name: userId
 *      in: path
 *      required: true
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: User ID
 *      example: 507f1f77bcf86cd799439011
 *   responses:
 *    '200':
 *     description: Successfully retrieved meetings
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/Meeting'
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */
// Potrjena srečanja uporabnika
const getUserConfirmedMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      'members.user': req.params.userId
    })
      .populate('members.user', 'username firstName lastName profileImage')
      .lean();

    res.status(200).json(meetings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /meetings/confirm:
 *  post:
 *   summary: Confirm meeting
 *   description: Creates a confirmed meeting record.
 *   tags: [Meetings]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Meeting'
 *   responses:
 *    '201':
 *     description: Meeting confirmed
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Meeting'
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */
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

/**
 * @openapi
 * /meetings/confirm/{meetingId}:
 *  delete:
 *   summary: Cancel confirmed meeting
 *   description: Cancels a confirmed meeting by ID.
 *   tags: [Meetings]
 *   parameters:
 *    - name: meetingId
 *      in: path
 *      required: true
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: Meeting ID
 *      example: 507f1f77bcf86cd799439015
 *   responses:
 *    '204':
 *     description: Meeting confirmation cancelled
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */
// Prekliči potrjeno srečanje
const cancelConfirmedMeeting = async (req, res) => {
  try {
    await ConfirmedMeeting.findByIdAndDelete(req.params.meetingId);
    res.status(204).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*
 * @openapi
 * /meetings/{meetingId}:
 *  get:
 *   summary: Get meeting by ID
 *   description: Retrieves a meeting by its ID.
 *   tags: [Meetings]
 *   parameters:
 *    - name: meetingId
 *      in: path
 *      required: true
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: Meeting ID
 *      example: 507f1f77bcf86cd799439015
 *   responses:
 *    '200':
 *     description: Meeting retrieved
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Meeting'
 *    '404':
 *     description: Meeting not found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */

const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.meetingId).lean();

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting ne obstaja.' });
    }

    res.status(200).json(meeting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /meetings/{meetingId}/chat-context:
 *  get:
 *   summary: Get chat context for meeting
 *   description: Returns meeting details and member list for chat sidebar. Accessible only to meeting members or admins.
 *   tags: [Meetings]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: meetingId
 *      in: path
 *      required: true
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: Meeting ID
 *      example: 507f1f77bcf86cd799439015
 *   responses:
 *    '200':
 *     description: Chat context retrieved
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *         meeting:
 *          type: object
 *          properties:
 *           id:
 *            type: string
 *           groupName:
 *            type: string
 *           status:
 *            type: string
 *           date:
 *            type: string
 *            format: date-time
 *           venue:
 *            type: object
 *           matchPercentage:
 *            type: number
 *           sharedInterests:
 *            type: array
 *            items:
 *             type: string
 *         members:
 *          type: array
 *          items:
 *           type: object
 *           properties:
 *            id:
 *             type: string
 *            username:
 *             type: string
 *            firstName:
 *             type: string
 *            lastName:
 *             type: string
 *            profileImage:
 *             type: string
 *            response:
 *             type: string
 *             enum: [pending, accepted, declined]
 *            respondedAt:
 *             type: string
 *             format: date-time
 *             nullable: true
 *            status:
 *             type: string
 *            isActive:
 *             type: boolean
 *       example:
 *        success: true
 *        meeting:
 *         id: 507f1f77bcf86cd799439015
 *         groupName: Skupina za klepet
 *         status: upcoming
 *         date: 2026-05-15T18:00:00Z
 *         venue:
 *          address: Slovenska cesta 10
 *          city: Ljubljana
 *          country: Slovenia
 *         matchPercentage: 90
 *         sharedInterests: [kava, druzabne igre]
 *        members: []
 *    '403':
 *     description: Forbidden - not a meeting member
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: Nimate dovoljenja za ta sestanek.
 *    '404':
 *     description: Meeting not found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: Srečanje ni najdeno.
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */
const getMeetingChatContext = async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findById(meetingId)
      .populate('members.user', 'username firstName lastName profileImage status isActive')
      .lean();

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Srečanje ni najdeno.'
      });
    }

    const requesterId = String(req.user?._id || '');
    const isAdmin = req.user?.role === 'admin';
    const isMember = (meeting.members || []).some((member) => {
      const memberId = member.user?._id || member.user;
      return String(memberId) === requesterId;
    });

    if (!isAdmin && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'Nimate dovoljenja za ta sestanek.'
      });
    }

    const members = (meeting.members || []).map((member) => {
      const user = member.user || {};
      const memberId = user._id || member.user;

      return {
        id: memberId ? String(memberId) : '',
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        profileImage: user.profileImage || '',
        response: member.response || 'pending',
        respondedAt: member.respondedAt || null,
        status: user.status || '',
        isActive: typeof user.isActive === 'boolean' ? user.isActive : null
      };
    });

    return res.status(200).json({
      success: true,
      meeting: {
        id: meeting._id,
        groupName: meeting.groupName,
        status: meeting.status,
        date: meeting.date,
        venue: meeting.venue,
        matchPercentage: meeting.matchPercentage,
        sharedInterests: meeting.sharedInterests
      },
      members
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export default {
  getAllMeetings,
  getMeetingChatContext,
  createMeeting,
  deleteMeeting,
  getMeetingById,
  getUserConfirmedMeetings,
  confirmMeeting,
  cancelConfirmedMeeting
};