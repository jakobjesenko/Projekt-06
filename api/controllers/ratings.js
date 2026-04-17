import mongoose from 'mongoose';
import Rating from '../models/ratings.js';
import Meeting from '../models/meetings.js';
import User from '../models/users.js';

/**
 * @openapi
 * /ratings:
 *  get:
 *   summary: Retrieves paginated ratings
 *   description: Retrieves a paginated list of ratings. Accessible only to admin users.
 *   tags: [Ratings]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: page
 *      in: query
 *      schema:
 *       type: integer
 *       minimum: 1
 *       default: 1
 *      description: Page number for pagination
 *      required: true
 *      example: 1
 *    - name: limit
 *      in: query
 *      schema:
 *       type: integer
 *       minimum: 1
 *       default: 30
 *      description: Number of items per page for pagination
 *      required: true
 *      example: 30
 *    - name: rating
 *      in: query
 *      schema:
 *       type: integer
 *       minimum: 1
 *       maximum: 5
 *      description: Filter by numeric rating value
 *      required: false
 *      example: 5
 *    - name: search
 *      in: query
 *      schema:
 *       type: string
 *      description: Search term for username, groupName or comment
 *      required: false
 *      example: super
 *    - name: user
 *      in: query
 *      schema:
 *       type: string
 *      description: Filter by user ID
 *      required: false
 *      example: 68012345bcf86cd799439011
 *    - name: meeting
 *      in: query
 *      schema:
 *       type: string
 *      description: Filter by meeting ID
 *      required: false
 *      example: 68012345bcf86cd799439013
 *   responses:
 *    '200':
 *     description: Successfully retrieved paginated ratings
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
 *           $ref: '#/components/schemas/Rating'
 *         pagination:
 *          type: object
 *          properties:
 *           total:
 *            type: integer
 *            description: Total number of ratings
 *            example: 120
 *           page:
 *            type: integer
 *            description: Current page number
 *            example: 1
 *           totalPages:
 *            type: integer
 *            description: Total number of pages
 *            example: 4
 *    '401':
 *     description: Forbidden - admin access only.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Nimate dovoljenja za izvedbo te akcije."
 *    '500':
 *     description: Server error, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Prislo je do napake pri pridobivanju ocen."
 */
const getAllRatings = async (req, res) => {
  try {
    let page = Number.parseInt(req.query.page, 10) || 1;
    let limit = Number.parseInt(req.query.limit, 10) || 30;

    if (page < 1) page = 1;
    if (limit < 1) limit = 30;
    if (limit > 100) limit = 100;

    const offset = (page - 1) * limit;

    const rawRating = req.query.rating;
    const rating = rawRating ? Number.parseInt(rawRating, 10) : null;
    const search = req.query.search || '';

    const user = mongoose.Types.ObjectId.isValid(req.query.user || '') ? req.query.user : null;
    const meeting = mongoose.Types.ObjectId.isValid(req.query.meeting || '')
      ? req.query.meeting
      : null;

    const { ratings, totalCount } = await Rating.getPaginatedRatings({
      offset,
      limit,
      rating: Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : null,
      search,
      user,
      meeting,
    });

    return res.status(200).json({
      success: true,
      data: ratings,
      pagination: {
        total: totalCount,
        page,
        totalPages: totalCount > 0 ? Math.ceil(totalCount / limit) : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return res.status(500).json({ error: 'An error occurred while fetching ratings.' });
  }
};

/**
 * @openapi
 * /ratings:
 *  post:
 *   tags: [Ratings]
 *   security:
 *    - jwt: []
 *   summary: Creates a new rating for a meeting
 *   description: Logged in user submits a rating and optional comment for a meeting.
 *   requestBody:
 *    required: true
 *    description: Rating data
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       required:
 *       - meeting
 *       - rating
 *       properties:
 *        meeting:
 *         type: string
 *         description: ID of meeting being rated
 *         example: 68012345bcf86cd799439013
 *        rating:
 *         type: number
 *         description: Numeric rating from 1 to 5
 *         minimum: 1
 *         maximum: 5
 *         example: 5
 *        comment:
 *         type: string
 *         description: Optional comment for rating
 *         maxLength: 500
 *         example: Zelo prijetno srecanje in dobra energija skupine.
 *   responses:
 *    '201':
 *     description: Rating successfully created
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: true
 *         data:
 *          $ref: '#/components/schemas/Rating'
 *       example:
 *        success: true
 *        data:
 *         _id: 68012345bcf86cd799439088
 *         user: 68012345bcf86cd799439011
 *         meeting: 68012345bcf86cd799439013
 *         username: testuser
 *         groupName: Sobotni pohodniki Ljubljana
 *         rating: 5
 *         comment: Zelo prijetno srecanje in dobra energija skupine.
 *    '400':
 *     description: Invalid request data
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        invalid meeting:
 *         value:
 *          success: false
 *          message: "Meeting ID je obvezen in mora biti veljaven."
 *        invalid rating:
 *         value:
 *          success: false
 *          message: "Ocena mora biti med 1 in 5."
 *    '404':
 *     description: User or meeting not found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        meeting missing:
 *         value:
 *          success: false
 *          message: "Meeting ne obstaja."
 *        user missing:
 *         value:
 *          success: false
 *          message: "Uporabnik ne obstaja."
 *    '409':
 *     description: Rating already exists for this user and meeting
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Za ta meeting ste že oddali oceno."
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Prislo je do napake pri ustvarjanju ocene."
 */
const createRating = async (req, res) => {
  const { meeting, rating, comment } = req.body;
  const userId = req.user.id;

  if (!meeting || !mongoose.Types.ObjectId.isValid(meeting)) {
    return res.status(400).json({ error: 'Meeting ID je obvezen in mora biti veljaven.' });
  }

  const numericRating = Number(rating);
  if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ error: 'Ocena mora biti med 1 in 5.' });
  }

  try {
    const [meetingDoc, userDoc] = await Promise.all([
      Meeting.findById(meeting).select('groupName'),
      User.findById(userId).select('username'),
    ]);

    if (!meetingDoc) {
      return res.status(404).json({ error: 'Meeting ne obstaja.' });
    }

    if (!userDoc) {
      return res.status(404).json({ error: 'Uporabnik ne obstaja.' });
    }

    const newRating = await Rating.create({
      user: userId,
      meeting,
      username: userDoc.username,
      groupName: meetingDoc.groupName,
      rating: numericRating,
      comment,
    });

    return res.status(201).json({
      success: true,
      data: newRating,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        error: 'Za ta meeting ste že oddali oceno.',
      });
    }

    console.error('Error creating rating:', error);
    return res.status(500).json({ error: 'An error occurred while creating rating.' });
  }
};

/**
 * @openapi
 * /ratings/{ratingId}:
 *  put:
 *   summary: Updates a rating by ID
 *   description: Updates rating value and comment. Allowed for rating owner or admin.
 *   tags: [Ratings]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: ratingId
 *      in: path
 *      required: true
 *      schema:
 *       type: string
 *   requestBody:
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        rating:
 *         type: number
 *         description: Updated numeric rating from 1 to 5
 *         minimum: 1
 *         maximum: 5
 *         example: 4
 *        comment:
 *         type: string
 *         description: Updated comment for rating
 *         maxLength: 500
 *         example: Posodobljen komentar po srečanju.
 *   responses:
 *    '200':
 *     description: Rating successfully updated
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: true
 *         data:
 *          $ref: '#/components/schemas/Rating'
 *       example:
 *        success: true
 *        data:
 *         _id: 68012345bcf86cd799439088
 *         rating: 4
 *         comment: Posodobljen komentar po srečanju.
 *    '400':
 *     description: Invalid input
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        invalid ratingId:
 *         value:
 *          success: false
 *          message: "ID ocene ni veljaven."
 *        invalid rating value:
 *         value:
 *          success: false
 *          message: "Ocena mora biti med 1 in 5."
 *        comment too long:
 *         value:
 *          success: false
 *          message: "Komentar je predolg. (max 500 znakov)"
 *    '401':
 *     description: Unauthorized - user not logged in.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Niste prijavljeni."
 *    '403':
 *     description: Forbidden
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Nimate dovoljenja za urejanje te ocene."
 *    '404':
 *     description: Rating not found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Ocena ne obstaja."
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Prislo je do napake pri posodabljanju ocene."
 */
const updateRating = async (req, res) => {
  const { ratingId } = req.params;
  const { rating, comment } = req.body;

  if (!ratingId || !mongoose.Types.ObjectId.isValid(ratingId)) {
    return res.status(400).json({ error: 'ID ocene ni veljaven.' });
  }

  if (rating !== undefined) {
    const numericRating = Number(rating);
    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ error: 'Ocena mora biti med 1 in 5.' });
    }
  }

  if (comment !== undefined && comment.length > 500) {
    return res.status(400).json({ error: 'Komentar je predolg. (max 500 znakov)' });
  }

  try {
    const ratingDoc = await Rating.findById(ratingId);

    if (!ratingDoc) {
      return res.status(404).json({ error: 'Ocena ne obstaja.' });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    if (ratingDoc.user.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: 'Nimate dovoljenja za urejanje te ocene.' });
    }

    if (rating !== undefined) ratingDoc.rating = Number(rating);
    if (comment !== undefined) ratingDoc.comment = comment;

    await ratingDoc.save();

    return res.status(200).json({ success: true, data: ratingDoc });
  } catch (error) {
    console.error('Error updating rating:', error);
    return res.status(500).json({ error: 'An error occurred while updating rating.' });
  }
};

/**
 * @openapi
 * /ratings/{ratingId}:
 *  delete:
 *   summary: Deletes a rating by ID
 *   description: Deletes rating by ID. Allowed for rating owner or admin.
 *   tags: [Ratings]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: ratingId
 *      in: path
 *      required: true
 *      schema:
 *       type: string
 *   responses:
 *    '200':
 *     description: Rating successfully deleted
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
 *           ratingId:
 *            type: string
 *            example: 68012345bcf86cd799439088
 *       example:
 *        success: true
 *        data:
 *         ratingId: 68012345bcf86cd799439088
 *    '400':
 *     description: Invalid rating ID
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "ID ocene ni veljaven."
 *    '401':
 *     description: Unauthorized - user not logged in.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Niste prijavljeni."
 *    '403':
 *     description: Forbidden
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Nimate dovoljenja za brisanje te ocene."
 *    '404':
 *     description: Rating not found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Ocena ne obstaja."
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Prislo je do napake pri brisanju ocene."
 */
const deleteRating = async (req, res) => {
  const { ratingId } = req.params;

  if (!ratingId || !mongoose.Types.ObjectId.isValid(ratingId)) {
    return res.status(400).json({ error: 'ID ocene ni veljaven.' });
  }

  try {
    const ratingDoc = await Rating.findById(ratingId);

    if (!ratingDoc) {
      return res.status(404).json({ error: 'Ocena ne obstaja.' });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    if (ratingDoc.user.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: 'Nimate dovoljenja za brisanje te ocene.' });
    }

    await ratingDoc.deleteOne();

    return res.status(200).json({ success: true, data: { ratingId } });
  } catch (error) {
    console.error('Error deleting rating:', error);
    return res.status(500).json({ error: 'An error occurred while deleting rating.' });
  }
};

export default {
  getAllRatings,
  createRating,
  updateRating,
  deleteRating,
};