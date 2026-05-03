// api/models/meetings.js
import mongoose from "mongoose";

/**
 * @openapi
 * components:
 *  schemas:
 *   MeetingMember:
 *    type: object
 *    description: Schema for a single member in a meeting group.
 *    properties:
 *     user:
 *      type: string
 *      description: <b>Reference</b> to the user included in the meeting
 *      $ref: '#/components/schemas/User'
 *     response:
 *      type: string
 *      description: <b>Member response</b> to meeting invitation
 *      enum: [pending, accepted, declined]
 *      default: pending
 *      example: accepted
 *     respondedAt:
 *      type: string
 *      format: date-time
 *      nullable: true
 *      description: <b>Date and time</b> when member responded
 *      example: 2026-04-11T14:30:00Z
 *    required:
 *    - user
 *    - response
 *
 *   Meeting:
 *    type: object
 *    description: Schema for a meeting group in the system.
 *    properties:
 *     _id:
 *      type: string
 *      description: <b>Unique identifier</b> of meeting
 *      example: 507f1f77bcf86cd799439015
 *     groupName:
 *      type: string
 *      description: <b>Name</b> of the meeting group
 *      minLength: 2
 *      maxLength: 80
 *      example: Sobotni pohodniki Ljubljana
 *     members:
 *      type: array
 *      description: <b>List of meeting members</b> with their RSVP status
 *      minItems: 3
 *      maxItems: 5
 *      items:
 *       $ref: '#/components/schemas/MeetingMember'
 *      example:
 *       - user: 507f1f77bcf86cd799439011
 *         response: accepted
 *         respondedAt: 2026-04-11T14:30:00Z
 *       - user: 507f191e810c19729de860ea
 *         response: pending
 *         respondedAt: null
 *     sharedInterests:
 *      type: array
 *      description: <b>Common interests</b> shared by members
 *      items:
 *       type: string
 *      minItems: 0
 *      example: [kava, druzabne igre, pohodi]
 *     matchPercentage:
 *      type: number
 *      description: <b>Percentage of compatibility</b> between members
 *      minimum: 0
 *      maximum: 100
 *      example: 90
 *     venue:
 *      type: object
 *      description: <b>Venue details</b> of the meeting
 *      properties:
 *       address:
 *        type: string
 *        description: <b>Address</b> of the meeting venue
 *        example: Slovenska cesta 10
 *       city:
 *        type: string
 *        description: <b>City</b> of the meeting venue
 *        example: Ljubljana
 *       country:
 *        type: string
 *        description: <b>Country</b> of the meeting venue
 *        default: Slovenia
 *        example: Slovenia
 *       coordinates:
 *        type: object
 *        description: <b>Geographical coordinates</b> of the venue
 *        properties:
 *         lat:
 *          type: number
 *          description: <b>Latitude</b> of the venue
 *          minimum: -90
 *          maximum: 90
 *          example: 46.0569
 *         lng:
 *          type: number
 *          description: <b>Longitude</b> of the venue
 *          minimum: -180
 *          maximum: 180
 *          example: 14.5058
 *      example:
 *       address: Slovenska cesta 10
 *       city: Ljubljana
 *       country: Slovenia
 *       coordinates:
 *        lat: 46.0569
 *        lng: 14.5058
 *     date:
 *      type: string
 *      format: date-time
 *      description: <b>Date and time</b> of the meeting (must be in future on create)
 *      example: 2026-05-15T18:00:00Z
 *     status:
 *      type: string
 *      description: <b>Status</b> of the meeting
 *      enum: [draft, upcoming, completed, cancelled]
 *      default: draft
 *      example: upcoming
 *     createdAt:
 *      type: string
 *      format: date-time
 *      description: <b>Date and time</b> when meeting was created
 *      example: 2026-04-11T12:00:00Z
 *     updatedAt:
 *      type: string
 *      format: date-time
 *      description: <b>Date and time</b> when meeting was last updated
 *      example: 2026-04-11T12:10:00Z
 *    required:
 *    - _id
 *    - groupName
 *    - members
 *    - venue
 *    - date
 *    - status
 *    - createdAt
 *    - updatedAt
 */

const meetingMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    response: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    respondedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const meetingSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 80,
  },
  members: {
    type: [meetingMemberSchema],
    default: [],
    validate: [
      {
        validator: (members) => members.length >= 3,
        message: "Meeting must have at least 3 members",
      },
      {
        validator: (members) => members.length <= 5,
        message: "Meeting can have at most 5 members",
      },
    ],
  },
  sharedInterests: {
    type: [String],
    default: [],
  },
  matchPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
   venue: {
    // tocna lokacija meetinga
    address: {
      // naslov meetinga
      type: String,
      required: [true, 'Naslov meetinga je obvezen'],
    },
    city: {
      // mesto meetinga
      type: String,
      required: [true, 'Mesto meetinga je obvezno'],
    },
    country: {
      // drzava meetinga
      type: String,
      required: [true, 'Država meetinga je obvezna'],
      default: 'Slovenia',
    },
    coordinates: {
      // geografske koordinate meetinga
      lat: {
        // sirina
        type: Number,
        required: [true, 'Geografska širina je obvezna'],
        min: -90,
        max: 90,
      },
      lng: {
        // dolzina
        type: Number,
        required: [true, 'Geografska dolžina je obvezna'],
        min: -180,
        max: 180,
      },
    },
  },
  date: {
    // datum meetinga
    type: Date,
    required: [true, 'Datum meetinga je obvezen'],
    validate: {
      // datum mora biti v prihodnosti
      validator: function (v) {
        if (this.isNew) {
          return v > new Date();
        }
        return true;
      },
      message: 'Datum meetinga mora biti v prihodnosti',
    },
  },
  status: {
    type: String,
    enum: ["draft", "upcoming", "completed", "cancelled"],
    default: "draft",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

meetingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

meetingSchema.methods.setMemberResponse = function (userId, response) {
  const member = this.members.find((m) => m.user.toString() === userId.toString());

  if (!member) {
    throw new Error("Member not found in this meeting");
  }

  member.response = response;
  member.respondedAt = new Date();
};

// STATIC METHOD: get paginated meetings
meetingSchema.statics.getPaginatedMeetings = async function ({
  offset,
  limit,
  status,
  search,
  dateFrom,
  dateTo,
}) {
  const query = {};

  if (status) {
    query.status = status;
  }

  if (dateFrom || dateTo) {
    query.date = {};
    if (dateFrom) query.date.$gte = new Date(dateFrom);
    if (dateTo) query.date.$lte = new Date(dateTo);
  }

  if (search) {
    query.$or = [
      { groupName: { $regex: search, $options: 'i' } },
      { 'venue.address': { $regex: search, $options: 'i' } },
      { 'venue.city': { $regex: search, $options: 'i' } },
      { sharedInterests: { $regex: search, $options: 'i' } },
    ];
  }

  const [meetings, totalCount] = await Promise.all([
    this.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean(),
    this.countDocuments(query),
  ]);

  return { meetings, totalCount };
};

export default mongoose.model("Meeting", meetingSchema, "meetings");