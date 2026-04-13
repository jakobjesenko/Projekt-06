import mongoose from 'mongoose';
import Message from '../models/messages.js';
import Meeting from '../models/meetings.js';

const ensureMeetingAccess = (meeting, userId, role) => {
  if (role === 'admin') return true;

  return meeting.members.some(
    (member) => member?.user && member.user.toString() === userId.toString(),
  );
};

/**
 * @openapi
 * /messages/{meetingId}:
 *  get:
 *   tags: [Messages]
 *   security:
 *    - jwt: []
 *   summary: Get meeting messages
 *   description: Get messages for a specific meeting. Access is allowed for assigned meeting members and admins.
 *   parameters:
 *    - name: meetingId
 *      in: path
 *      schema:
 *       type: string
 *      required: true
 *      description: ID of the meeting for which messages are retrieved
 *      example: 64b8c3d5e4f77b002f6d5e9b
 *    - name: before
 *      in: query
 *      schema:
 *       type: string
 *       format: date-time
 *      required: false
 *    - name: limit
 *      in: query
 *      schema:
 *       type: integer
 *      required: false
 *      description: Maximum number of messages to retrieve
 *      example: 20
 *   responses:
 *    '200':
 *     description: Successfully retrieved messages
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Message'
 *       example:
 *        - _id: 64d1f0c2e4f77b002f6d5f3a
 *          meeting: 64b8c3d5e4f77b002f6d5e9b
 *          user: 64a1b2c3d4e5f6001a2b3c4d
 *          message: "Komaj cakam meeting"
 *          timestamp: 2024-07-15T12:34:56.789Z
 *    '400':
 *     description: Invalid meeting ID value.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: Neveljavna ID vrednost za meeting.
 *    '401':
 *     description: Unauthorized - user not logged in.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Nimate dovoljenja za ta dejanje."
 *    '404':
 *     description: Meeting with the given ID does not exist.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: Neveljavna ID vrednost za meeting.
 *    '500':
 *     description: Error retrieving messages from database.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: Napaka pri pridobivanju sporočil iz baze podatkov.
 *
 */

// GET /api/messages/:meetingId : pridobi sporocila za meeting
const getMeetingMessages = async (req, res) => {
  const { meetingId } = req.params;
  const { before, limit = 20 } = req.query;

  if (!meetingId || !mongoose.Types.ObjectId.isValid(meetingId)) {
    return res.status(400).json({
      success: false,
      message: 'Neveljavna ID vrednost za meeting.',
    });
  }

  try {
    const meeting = await Meeting.findById(meetingId).select('groupName members');

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: `Meeting z ID-jem ${meetingId} ne obstaja.`,
      });
    }

    const userId = req.user.id;
    if (!ensureMeetingAccess(meeting, userId, req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Nimate dostopa do tega klepeta, ker niste dodeljeni v to skupino.',
      });
    }

    const query = { meeting: meetingId };
    if (before) {
      query.timestamp = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .populate('user', 'username profileImage')
      .populate('meeting', 'groupName')
      .lean();

    const formattedMessages = messages.reverse().map((msg) => ({
      _id: msg._id.toString(),
      meeting: msg.meeting?._id?.toString() || meetingId,
      meetingName: msg.meeting?.groupName || meeting.groupName,
      user: msg.user?._id?.toString(),
      username: msg.user?.username,
      userImage: msg.user?.profileImage || '/img/default-avatar.png',
      message: msg.message,
      timestamp: msg.timestamp,
    }));

    return res.status(200).json(formattedMessages);
  } catch (error) {
    console.error('Error retrieving messages from database:', error);
    return res.status(500).json({
      success: false,
      message: 'Napaka pri pridobivanju sporočil iz baze podatkov.',
    });
  }
};

/**
 * @openapi
 *  /messages/{meetingId}:
 *   post:
 *    tags: [Messages]
 *    security:
 *     - jwt: []
 *    summary: Send message to meeting chat
 *    description: Send a message to the chat for a specific meeting. Access is allowed for assigned meeting members and admins.
 *    parameters:
 *     - name: meetingId
 *       in: path
 *       schema:
 *        type: string
 *       required: true
 *       description: ID of the meeting to which the message is sent
 *       example: 64b8c3d5e4f77b002f6d5e9b
 *    requestBody:
 *     description: Message content
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Komaj cakam srecanje
 *        required:
 *         - message
 *    responses:
 *     '201':
 *      description: Message successfully sent
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Message'
 *        example:
 *         success: true
 *         data:
 *          _id: 64d1f0c2e4f77b002f6d5f3a
 *          meeting: 64b8c3d5e4f77b002f6d5e9b
 *          user: 64a1b2c3d4e5f6001a2b3c4d
 *          message: "Komaj cakam koncert"
 *          timestamp: 2024-07-15T12:34:56.789Z
 *     '400':
 *      description: Bad Request, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        examples:
 *         invalid messageId:
 *          value:
 *           success: false
 *           message: "ID sporocila ni validen."
 *         prazno sporocilo:
 *          value:
 *           success: false
 *           message: "Sporočilo je prazno."
 *         predolgo sporocilo:
 *          value:
 *           success: false
 *           message: "Sporočilo je predolgo. (max 500 znakov)"
 *     '404':
 *      description: Concert with the given ID does not exist.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         success: false
 *         message: Koncert z ID-jem 64b8c3d5e4f77b002f6d5e9b ne obstaja.
 *     '500':
 *      description: Error saving message to database.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         success: false
 *         message: "Napaka pri shranjevanju sporočila."
 */

// POST : pošlji sporočilo v klepetu o koncertu
const sendMessage = async (req, res) => {
  const { meetingId } = req.params;
  const { message } = req.body;

  if (!meetingId || !mongoose.Types.ObjectId.isValid(meetingId)) {
    return res.status(400).json({ success: false, message: 'Neveljavna ID vrednost za meeting.' });
  }

  if (!message || !/\S/.test(message)) {
    return res.status(400).json({ success: false, message: 'Sporočilo je prazno.' });
  }

  if (message.length > 500) {
    return res
      .status(400)
      .json({ success: false, message: 'Sporočilo je predolgo. (max 500 znakov)' });
  }

  try {
    const meeting = await Meeting.findById(meetingId).select('groupName members');

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: `Meeting z ID-jem ${meetingId} ne obstaja.`,
      });
    }

    const userId = req.user.id;
    if (!ensureMeetingAccess(meeting, userId, req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Nimate dostopa do tega klepeta, ker niste dodeljeni v to skupino.',
      });
    }

    const newMessage = await Message.create({
      meeting: meetingId,
      user: userId,
      message: message.trim(),
    });

    await newMessage.populate('user', 'username profileImage');

    const payload = {
      _id: newMessage._id.toString(),
      meeting: meetingId,
      meetingName: meeting.groupName,
      user: newMessage.user._id.toString(),
      username: newMessage.user.username,
      userImage: newMessage.user.profileImage || '/img/default-avatar.png',
      message: newMessage.message,
      timestamp: newMessage.timestamp,
    };

    const io = req.app.get('io');
    if (io) {
      io.to(meetingId).emit('newMeetingMessage', payload);
    }

    return res.status(201).json({ success: true, data: payload });
  } catch (error) {
    console.error('Error saving message to database:', error);
    return res.status(500).json({ success: false, message: 'Napaka pri shranjevanju sporočila.' });
  }
};

/**
 * @openapi
 * /messages/{messageId}:
 *  put:
 *   tags: [Messages]
 *   security:
 *    - jwt: []
 *   summary: Update a message
 *   description: Update content of a specific message. Only message owner or admin can update.
 *   parameters:
 *    - name: messageId
 *      in: path
 *      required: true
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\\d]{24}$'
 *      example: 64b8c3d5e4f77b002f6d5e9b
 *      description: ID of the message to be updated
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - message
 *       properties:
 *        message:
 *         type: string
 *         minLength: 1
 *         maxLength: 500
 *         example: "Popravljeno sporočilo"
 *         description: New content of the message
 *   responses:
 *    '200':
 *     description: Message successfully updated
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: true
 *         data:
 *          $ref: '#/components/schemas/Message'
 *       example:
 *        success: true
 *        data:
 *         _id: "64d1f0c2e4f77b002f6d5f3a"
 *         concert: "64b8c3d5e4f77b002f6d5e9b"
 *         user: "64a1b2c3d4e5f6001a2b3c4d"
 *         message: "Popravljeno sporočilo"
 *         timestamp: "2024-07-15T12:34:56.789Z"
 *    '400':
 *     description: Invalid message ID or empty message content
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Sporočilo ne sme biti prazno."
 *    '401':
 *     description: Unauthorized - JWT token missing or invalid
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Niste prijavljeni"
 *    '403':
 *     description: Forbidden - user is not the owner or admin
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Nimate dovoljenja za urejanje tega sporočila."
 *    '404':
 *     description: Message not found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Sporočilo ne obstaja."
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Napaka pri posodabljanju sporočila."
 */
const updateMessage = async (req, res) => {
  const { messageId } = req.params;
  const { message: newMessageContent } = req.body;

  if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) {
    return res.status(400).json({ success: false, message: 'ID sporočila ni veljaven.' });
  }

  if (!newMessageContent || newMessageContent.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Sporočilo ne sme biti prazno.' });
  }

  if (newMessageContent.trim().length > 500) {
    return res.status(400).json({ success: false, message: 'Sporočilo ne sme presegati 500 znakov.' });
  }

  try {
    const message = await Message.findById(messageId).populate('meeting', 'groupName');

    if (!message) {
      return res.status(404).json({ success: false, message: 'Sporočilo ne obstaja.' });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    if (message.user.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Nimate dovoljenja za urejanje tega sporočila.',
      });
    }

    message.message = newMessageContent.trim();
    await message.save();
    await message.populate('user', 'username profileImage');

    const payload = {
      _id: message._id.toString(),
      meeting: message.meeting._id.toString(),
      meetingName: message.meeting.groupName,
      user: message.user._id.toString(),
      username: message.user.username,
      userImage: message.user.profileImage || '/img/default-avatar.png',
      message: message.message,
      timestamp: message.timestamp,
    };

    const io = req.app.get('io');
    if (io) {
      io.to(message.meeting._id.toString()).emit('updateMeetingMessage', payload);
    }

    return res.status(200).json({ success: true, data: payload });
  } catch (error) {
    console.error('Error updating message:', error);
    return res.status(500).json({ success: false, message: 'Napaka pri posodabljanju sporočila.' });
  }
};

/**
 * @openapi
 * /messages/{messageId}:
 *  delete:
 *   tags: [Messages]
 *   security:
 *    - jwt: []
 *   summary: Delete a message
 *   description: Delete a specific message by its ID. Only message owner or admin can delete.
 *   parameters:
 *    - name: messageId
 *      in: path
 *      required: true
 *      schema:
 *       type: string
 *      example: 64b8c3d5e4f77b002f6d5e9b
 *      description: ID of the message to be deleted
 *   responses:
 *    '200':
 *     description: Message successfully deleted
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Message'
 *       example:
 *        success: true
 *        data:
 *         _id: "64d1f0c2e4f77b002f6d5f3a"
 *         concert: 64b8c3d5e4f77b002f6d5e9b"
 *         user: "64a1b2c3d4e5f6001a2b3c4d"
 *         message: "Komaj cakam koncert"
 *         timestamp: "2024-07-15T12:34:56.789Z"
 *    '400':
 *     description: Invalid message ID
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "ID sporocila ni validen."
 *    '401':
 *     description: Unauthorized - user not logged in.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Nimate dovoljenja za ta dejanje."
 *    '404':
 *     description: Message not found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Sporočilo ne obstaja."
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Napaka pri brisanju sporočila."
 */

// DELETE /api/messages/:messageId : izbriši sporočilo
const deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) {
    return res.status(400).json({ success: false, message: 'ID sporočila ni veljaven.' });
  }

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Sporočilo ne obstaja.' });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    if (message.user.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Nimate dovoljenja za brisanje tega sporočila.',
      });
    }

    const meetingId = message.meeting.toString();

    await message.deleteOne();

    const io = req.app.get('io');
    if (io) {
      io.to(meetingId).emit('deleteMeetingMessage', { messageId });
    }

    return res.status(200).json({ success: true, data: { messageId } });
  } catch (error) {
    console.error('Error deleting message:', error);
    return res.status(500).json({ success: false, message: 'Napaka pri brisanju sporočila.' });
  }
};

export default {
  getMeetingMessages,
  sendMessage,
  updateMessage,
  deleteMessage,
};
