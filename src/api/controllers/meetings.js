import Meeting from "../models/meetings.js";

// ─── Helpers ─────────────────────────────────────────────────────────────

const MEETING_POPULATE =
  "username firstName lastName email profileImage status isActive";

const updatePastMeetingsToCompleted = async () => {
  await Meeting.updateMany(
    {
      status: "upcoming",
      date: { $lt: new Date() },
    },
    {
      $set: {
        status: "completed",
        updatedAt: new Date(),
      },
    }
  );
};

const populateMeetingMembers = (query) => {
  return query.populate("members.user", MEETING_POPULATE);
};

const getMemberIdsFromBody = (members = []) => {
  return members
    .map((member) => member?.user)
    .filter(Boolean)
    .map(String)
    .sort();
};

const sameMembers = (a = [], b = []) => {
  if (a.length !== b.length) return false;
  return a.every((id, index) => id === b[index]);
};

// ─── Vsa srečanja ────────────────────────────────────────────────────────

/**
 * @openapi
 * /meetings:
 *  get:
 *   summary: Get all meetings
 *   description: >
 *    Returns a paginated list of meetings. Past meetings with status `upcoming`
 *    may be automatically changed to `completed` before the response is returned.
 *    Members may be returned as populated user objects.
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
 *       enum: [draft, upcoming, completed, cancelled]
 *      description: Filter meetings by status
 *    - name: search
 *      in: query
 *      schema:
 *       type: string
 *      description: Search by group name, venue, city, or shared interests
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
 *          example: true
 *         data:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/Meeting'
 *         pagination:
 *          type: object
 *          properties:
 *           total:
 *            type: integer
 *            example: 12
 *           page:
 *            type: integer
 *            example: 1
 *           totalPages:
 *            type: integer
 *            example: 2
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */
const getAllMeetings = async (req, res) => {
  try {
    await updatePastMeetingsToCompleted();

    let page = Number.parseInt(req.query.page, 10) || 1;
    let limit = Number.parseInt(req.query.limit, 10) || 30;

    if (page < 1) page = 1;
    if (limit < 1) limit = 30;
    if (limit > 100) limit = 100;

    const offset = (page - 1) * limit;

    const allowedStatuses = ["draft", "upcoming", "completed", "cancelled"];
    const status = allowedStatuses.includes(req.query.status)
      ? req.query.status
      : null;

    const search = req.query.search || "";
    const dateFrom = req.query.dateFrom || null;
    const dateTo = req.query.dateTo || null;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (dateFrom || dateTo) {
      query.date = {};

      if (dateFrom) {
        query.date.$gte = new Date(dateFrom);
      }

      if (dateTo) {
        query.date.$lte = new Date(dateTo);
      }
    }

    if (search) {
      query.$or = [
        { groupName: { $regex: search, $options: "i" } },
        { "venue.address": { $regex: search, $options: "i" } },
        { "venue.city": { $regex: search, $options: "i" } },
        { sharedInterests: { $regex: search, $options: "i" } },
      ];
    }

    const [meetings, totalCount] = await Promise.all([
      populateMeetingMembers(
        Meeting.find(query)
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit)
      ).lean(),

      Meeting.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: meetings,
      pagination: {
        total: totalCount,
        page,
        totalPages: totalCount > 0 ? Math.ceil(totalCount / limit) : 0,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ─── Ustvari srečanje ────────────────────────────────────────────────────

/**
 * @openapi
 * /meetings:
 *  post:
 *   summary: Create a meeting
 *   description: >
 *    Creates a new meeting. If a meeting with the same group name and the same
 *    members already exists, the existing meeting is returned instead of creating
 *    a duplicate. If an incoming member previously had response `declined` in the
 *    existing meeting, their response may be changed back to `accepted` or to the
 *    response provided in the request body. If the meeting was `cancelled` and has
 *    enough active members again, it may be reactivated to `upcoming`.
 *   tags: [Meetings]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Meeting'
 *      example:
 *       groupName: "Kava & Glasba"
 *       members:
 *        - user: "507f1f77bcf86cd799439011"
 *          response: "accepted"
 *          respondedAt: "2026-04-11T14:30:00Z"
 *        - user: "507f191e810c19729de860ea"
 *          response: "pending"
 *          respondedAt: null
 *        - user: "507f191e810c19729de860eb"
 *          response: "pending"
 *          respondedAt: null
 *       sharedInterests: ["Kava", "Glasba"]
 *       matchPercentage: 73
 *       venue:
 *        address: "~0.2 km od tebe"
 *        city: "Ljubljana"
 *        country: "Slovenia"
 *        coordinates:
 *         lat: 46.0569
 *         lng: 14.5058
 *       date: "2026-05-10T18:00:00Z"
 *       status: "upcoming"
 *   responses:
 *    '201':
 *     description: New meeting created
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Meeting'
 *    '200':
 *     description: Existing duplicate meeting returned and possibly reactivated
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Meeting'
 *    '404':
 *     description: Duplicate meeting reference no longer exists
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */
const createMeeting = async (req, res) => {
  try {
    const incomingMemberIds = getMemberIdsFromBody(req.body.members);

    if (incomingMemberIds.length > 0) {
      const possibleDuplicates = await Meeting.find({
        groupName: req.body.groupName,
        "members.user": { $all: incomingMemberIds },
      }).lean();

      const duplicate = possibleDuplicates.find((meeting) => {
        const existingMemberIds = (meeting.members || [])
          .map((member) => String(member.user))
          .sort();

        return sameMembers(existingMemberIds, incomingMemberIds);
      });

      if (duplicate) {
        const existingMeeting = await Meeting.findById(duplicate._id);

        if (!existingMeeting) {
          return res.status(404).json({
            success: false,
            message: "Srečanje ne obstaja.",
          });
        }

        const incomingMembers = req.body.members || [];

        for (const incomingMember of incomingMembers) {
          const incomingUserId = String(incomingMember.user);

          const existingMember = existingMeeting.members.find(
            (member) => String(member.user) === incomingUserId
          );

          if (existingMember && existingMember.response === "declined") {
            existingMember.response = incomingMember.response || "accepted";
            existingMember.respondedAt = new Date();
          }
        }

        if (existingMeeting.status === "cancelled") {
          const activeMembersCount = existingMeeting.members.filter(
            (member) => member.response !== "declined"
          ).length;

          if (activeMembersCount >= 2) {
            existingMeeting.status = "upcoming";
          }
        }

        await existingMeeting.save();

        const populatedDuplicate = await populateMeetingMembers(
          Meeting.findById(existingMeeting._id)
        ).lean();

        return res.status(200).json(populatedDuplicate);
      }
    }

    const meeting = new Meeting(req.body);
    await meeting.save();

    const populatedMeeting = await populateMeetingMembers(
      Meeting.findById(meeting._id)
    ).lean();

    return res.status(201).json(populatedMeeting);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ─── Izbriši srečanje ────────────────────────────────────────────────────

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
 *       pattern: '^[a-fA-F\\d]{24}$'
 *      description: MongoDB ObjectId of the meeting
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
const deleteMeeting = async (req, res) => {
  try {
    await Meeting.findByIdAndDelete(req.params.meetingId);

    return res.status(204).json({
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ─── Potrjena srečanja uporabnika ────────────────────────────────────────

/**
 * @openapi
 * /meetings/confirmed/{userId}:
 *  get:
 *   summary: Get confirmed meetings for user
 *   description: >
 *    Retrieves meetings where the given user is a member and their member response
 *    is not `declined`. This means meetings that the user has left are not returned.
 *    Past upcoming meetings may be automatically marked as `completed` before
 *    returning the response. Members may be returned as populated user objects.
 *   tags: [Meetings]
 *   parameters:
 *    - name: userId
 *      in: path
 *      required: true
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\\d]{24}$'
 *      description: MongoDB ObjectId of the user
 *      example: 507f1f77bcf86cd799439011
 *   responses:
 *    '200':
 *     description: Successfully retrieved user meetings
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
const getUserConfirmedMeetings = async (req, res) => {
  try {
    await updatePastMeetingsToCompleted();

    const meetings = await populateMeetingMembers(
      Meeting.find({
        members: {
          $elemMatch: {
            user: req.params.userId,
            response: { $ne: "declined" }
          }
        }
      }).sort({ date: 1 })
    ).lean();

    return res.status(200).json(meetings);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ─── Potrdi srečanje ─────────────────────────────────────────────────────

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
const confirmMeeting = async (req, res) => {
  try {
    const confirmed = new Meeting(req.body);
    await confirmed.save();

    const populatedMeeting = await populateMeetingMembers(
      Meeting.findById(confirmed._id)
    ).lean();

    return res.status(201).json(populatedMeeting);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ─── Prekliči potrjeno srečanje ──────────────────────────────────────────

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
 *       pattern: '^[a-fA-F\\d]{24}$'
 *      description: MongoDB ObjectId of the meeting
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
const cancelConfirmedMeeting = async (req, res) => {
  try {
    await Meeting.findByIdAndDelete(req.params.meetingId);

    return res.status(204).json({
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ─── Pridobi srečanje po ID ──────────────────────────────────────────────

/**
 * @openapi
 * /meetings/{meetingId}:
 *  get:
 *   summary: Get meeting by ID
 *   description: Retrieves a meeting by its ID. Members may be returned as populated user objects.
 *   tags: [Meetings]
 *   parameters:
 *    - name: meetingId
 *      in: path
 *      required: true
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\\d]{24}$'
 *      description: MongoDB ObjectId of the meeting
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
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */
const getMeetingById = async (req, res) => {
  try {
    await updatePastMeetingsToCompleted();

    const meeting = await populateMeetingMembers(
      Meeting.findById(req.params.meetingId)
    ).lean();

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting ne obstaja.",
      });
    }

    return res.status(200).json(meeting);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ─── Chat context ────────────────────────────────────────────────────────

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
 *       pattern: '^[a-fA-F\\d]{24}$'
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
 *            enum: [draft, upcoming, completed, cancelled]
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
    await updatePastMeetingsToCompleted();

    const { meetingId } = req.params;

    const meeting = await populateMeetingMembers(
      Meeting.findById(meetingId)
    ).lean();

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Srečanje ni najdeno.",
      });
    }

    const requesterId = String(req.user?._id || "");
    const isAdmin = req.user?.role === "admin";

    const isMember = (meeting.members || []).some((member) => {
      const memberId = member.user?._id || member.user;
      return String(memberId) === requesterId;
    });

    if (!isAdmin && !isMember) {
      return res.status(403).json({
        success: false,
        message: "Nimate dovoljenja za ta sestanek.",
      });
    }

    const members = (meeting.members || []).map((member) => {
      const user = member.user || {};
      const memberId = user._id || member.user;

      return {
        id: memberId ? String(memberId) : "",
        username: user.username || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        profileImage: user.profileImage || "",
        response: member.response || "pending",
        respondedAt: member.respondedAt || null,
        status: user.status || "",
        isActive: typeof user.isActive === "boolean" ? user.isActive : null,
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
        sharedInterests: meeting.sharedInterests,
      },
      members,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ─── Število zaključenih srečanj ─────────────────────────────────────────

/**
 * @openapi
 * /meetings/stats/completed:
 *  get:
 *   summary: Count completed meetings
 *   description: >
 *    Updates past upcoming meetings to completed and returns the number of completed meetings.
 *   tags: [Meetings]
 *   responses:
 *    '200':
 *     description: Successfully counted completed meetings
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: true
 *         data:
 *          type: object
 *          properties:
 *           count:
 *            type: integer
 *            example: 5
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */
const getCompletedMeetingsCount = async (req, res) => {
  try {
    await updatePastMeetingsToCompleted();

    const count = await Meeting.countDocuments({
      status: "completed",
    });

    return res.status(200).json({
      success: true,
      data: { count },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * @openapi
 * /meetings/{meetingId}/leave:
 *  delete:
 *   summary: Leave a meeting
 *   description: >
 *    Marks the currently authenticated user's meeting response as `declined`.
 *    The user is not physically removed from the members array, so meeting history
 *    is preserved and the Meeting schema minimum member validation remains valid.
 *    The meeting will no longer be returned by `/meetings/confirmed/{userId}` for
 *    that user. If fewer than 2 active members remain, the meeting is marked as
 *    `cancelled`. If the same user accepts the same meeting suggestion again later,
 *    `/meetings` can reactivate their response from `declined` to `accepted`.
 *   tags: [Meetings]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: meetingId
 *      in: path
 *      required: true
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\\d]{24}$'
 *      description: MongoDB ObjectId of the meeting
 *      example: 507f1f77bcf86cd799439015
 *   responses:
 *    '200':
 *     description: User successfully left the meeting
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: true
 *         message:
 *          type: string
 *          example: Uspešno ste zapustili srečanje.
 *         meeting:
 *          $ref: '#/components/schemas/Meeting'
 *    '401':
 *     description: Unauthorized - user is not logged in
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *    '403':
 *     description: User is not a member of this meeting
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *    '404':
 *     description: Meeting not found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */
const leaveMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Niste prijavljeni.",
      });
    }

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Srečanje ne obstaja.",
      });
    }

    const userIdString = String(userId);

    const member = meeting.members.find((member) => {
      return String(member.user) === userIdString;
    });

    if (!member) {
      return res.status(403).json({
        success: false,
        message: "Niste član tega srečanja.",
      });
    }

    member.response = "declined";
    member.respondedAt = new Date();

    const activeMembersCount = meeting.members.filter(
      (member) => member.response !== "declined"
    ).length;

    if (activeMembersCount < 2) {
      meeting.status = "cancelled";
    }

    await meeting.save();

    const populatedMeeting = await populateMeetingMembers(
      Meeting.findById(meeting._id)
    ).lean();

    return res.status(200).json({
      success: true,
      message: "Uspešno ste zapustili srečanje.",
      meeting: populatedMeeting,
    });
  } catch (err) {
    console.error("Leave meeting error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
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
  cancelConfirmedMeeting,
  getCompletedMeetingsCount,
  leaveMeeting,
};