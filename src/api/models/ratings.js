// api/models/Rating.js
import mongoose from "mongoose";

/**
 * @openapi
 * components:
 *  schemas:
 *   Rating:
 *    type: object
 *    description: Scheme for user ratings related to meetings
 *    properties:
 *     _id:
 *      type: string
 *      description: Unique identifier for the rating
 *      example: 64b8c3d5e4f77b002f6d5e9b
 *     user:
 *      type: string
 *      description: Reference to the user who submitted the rating
 *      $ref: '#/components/schemas/User'
 *     meeting:
 *      type: string
 *      description: Reference to the meeting associated with the rating
 *      $ref: '#/components/schemas/Meeting'
 *     username:
 *      type: string
 *      description: Username of the user who submitted the rating
 *      minLength: 1
 *      example: ana_novak
 *     groupName:
 *      type: string
 *      description: Group name for which the rating was submitted
 *      minLength: 1
 *      example: Hiking Group Ljubljana
 *     rating:
 *      type: number
 *      description: Numeric rating value
 *      minimum: 1
 *      maximum: 5
 *      example: 4
 *     comment:
 *      type: string
 *      description: Optional rating comment
 *      maxLength: 500
 *      default: Brez komentarja
 *      example: Super srecanje, dobra energija v skupini.
 *     createdAt:
 *      type: string
 *      format: date-time
 *      description: Timestamp when the rating was created
 *      example: 2026-04-11T10:30:00.000Z
 *     updatedAt:
 *      type: string
 *      format: date-time
 *      description: Timestamp when the rating was last updated
 *      example: 2026-04-11T10:30:00.000Z
 *    required:
 *    - _id
 *    - user
 *    - meeting
 *    - username
 *    - groupName
 *    - rating
 *    - createdAt
 *    - updatedAt
 */

const ratingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
  },
  meeting: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting', 
    required: true,
  },
  username: { 
    type: String, 
    required: true 
  },
  // denormalizacija imena
  groupName: { 
    type: String, 
    required: true 
  },
  rating: { 
    type: Number, 
    min: 1, max: 5, required: true 
  },
  comment: { 
    type: String, 
    maxlength: [500, 'Comment is too long'], 
    default: "Brez komentarja" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }, 
});

// posodobi datum zadnje posodobitve
ratingSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// en uporabnik lahko odda samo eno oceno za posamezen meeting
ratingSchema.index({ user: 1, meeting: 1 }, { unique: true });

// STATIC METHOD: get paginated ratings
ratingSchema.statics.getPaginatedRatings = async function ({
  offset,
  limit,
  rating,
  search,
  user,
  meeting,
}) {
  const query = {};

  if (rating) {
    query.rating = rating;
  }

  if (user) {
    query.user = user;
  }

  if (meeting) {
    query.meeting = meeting;
  }

  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { groupName: { $regex: search, $options: 'i' } },
      { comment: { $regex: search, $options: 'i' } },
    ];
  }

  const [ratings, totalCount] = await Promise.all([
    this.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean(),
    this.countDocuments(query),
  ]);

  return { ratings, totalCount };
};

export default mongoose.model("Rating", ratingSchema, "ratings");