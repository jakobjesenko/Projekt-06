import mongoose from 'mongoose';
import Message from '../models/messages.js';
import Meeting from '../models/meetings.js';
import User from '../models/users.js';

/**
 * @openapi
 * /messages/{meetingId}:
 *  get:
 *   tags: [Messages]
 *   security:
 *    - jwt: []
 *   summary: Get meeting messages
 *   description: Get messages for a specific meeting. You can use the `before` and `limit` for lazy loading/pagination.
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
  let { meetingId } = req.params;
  let { before, limit = 20 } = req.query;

  if (!meetingId || !mongoose.Types.ObjectId.isValid(meetingId)) {
    return res.status(400).json({
      success: false,
      message: 'Neveljavna ID vrednost za meeting.',
    });
  }

  const meetingExists = await Meeting.exists({ _id: meetingId });

  if (!meetingExists) {
    return res.status(404).json({
      success: false,
      message: 'Meeting z ID-jem ' + meetingId + ' ne obstaja.',
    });
  }

  // Preveri ali je uporabnik član tega meetinga
  const userId = req.user.id;
  const isMember = await Meeting.exists({ _id: meetingId, 'members.user': userId });

  if (!isMember && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Nimate dostopa do tega klepeta. Niste član tega meetinga.',
    });
  }

  try {
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
      meeting: msg.meeting._id.toString(),
      meetingName: msg.meeting.groupName,
      user: msg.user._id.toString(),
      username: msg.user.username,
      userImage: msg.user.profileImage || '/img/default-avatar.png',
      message: msg.message,
      timestamp: msg.timestamp,
    }));

    console.log(`Retrieved ${messages.length} messages for meeting ${meetingId}`);

    if (formattedMessages.length > 0) {
      console.log('First message user field:', formattedMessages[0].user);
    }

    return res.status(200).json(formattedMessages);
  } catch (error) {
    console.error('Error retrieving messages from database:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving messages from database.',
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
 *    description: Send a message to the chat for a specific meeting.
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
 *          example: Komaj cakam meeting
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
 *          message: "Komaj cakam meeting"
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
 *      description: Meeting with the given ID does not exist.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         success: false
 *         message: Meeting z ID-jem 64b8c3d5e4f77b002f6d5e9b ne obstaja.
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

// POST : pošlji sporočilo v klepetu o meetingu
const sendMessage = async (req, res) => {
  const meetingId = req.params.meetingId;
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
  const meetingExists = await Meeting.exists({ _id: meetingId });

  if (!meetingExists) {
    return res
      .status(404)
      .json({ success: false, message: 'Meeting z ID-jem ' + meetingId + ' ne obstaja.' });
  }

  // Uporabi req.user.id iz JWT tokena (protect middleware ga doda)
  const userId = req.user.id;

  // Preveri ali je uporabnik član tega meetinga
  const isMember = await Meeting.exists({ _id: meetingId, 'members.user': userId });

  if (!isMember && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Nimate dostopa do tega klepeta. Niste član tega meetinga.',
    });
  }

  try {
    console.log('Saving message with userId:', userId);

    const newMessage = await Message.create({
      meeting: meetingId,
      user: userId,
      message: message.trim(),
    });

    console.log(`Message saved to database: ${newMessage._id}`);

    // Naložimo ime meetinga in user podatke
    const meeting = await Meeting.findById(meetingId).select('groupName');
    const user = await User.findById(userId).select('username profileImage');

    const payload = {
      _id: newMessage._id,
      meeting: newMessage.meeting.toString(),
      user: newMessage.user.toString(),
      meetingName: meeting.groupName,
      username: user.username,
      userImage: user.profileImage,
      message: newMessage.message,
      timestamp: newMessage.timestamp,
    };

    // Emit vsem v sobi (vključno z pošiljateljem!)
    const io = req.app.get('io');
    io.to(meetingId).emit('newMeetingMessage', payload);
    console.log(`Message sent to clients: ${newMessage._id}`);

    // Vrni payload kot odgovor
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
 *   description: Update the content of a specific message. Only the message owner or admin can update.
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
 *         meeting: "64b8c3d5e4f77b002f6d5e9b"
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
  const messageId = req.params.messageId;
  const { message: newMessageContent } = req.body;

  if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) {
    return res.status(400).json({ success: false, message: 'ID sporočila ni veljaven.' });
  }

  if (!newMessageContent || newMessageContent.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Sporočilo ne sme biti prazno.' });
  }

  if (newMessageContent.trim().length > 500) {
    return res.status(400).json({
      success: false,
      message: 'Sporočilo ne sme presegati 500 znakov.',
    });
  }

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Sporočilo ne obstaja.' });
    }

    // Preveri dovoljenje (samo lastnik ali admin)
    const userId = req.user.id;
    const userRole = req.user.role;

    if (message.user.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Nimate dovoljenja za urejanje tega sporočila.',
      });
    }

    // Posodobi sporočilo
    message.message = newMessageContent.trim();
    await message.save();

    console.log(`Message updated: ${messageId}`);

    // Populiraj podatke za response
    await message.populate('user', 'username profileImage');
    await message.populate('meeting', 'groupName');

    const payload = {
      _id: message._id.toString(),
      meeting: message.meeting._id.toString(),
      meetingName: message.meeting.groupName,
      user: message.user._id.toString(),
      username: message.user.username,
      userImage: message.user.profileImage,
      message: message.message,
      timestamp: message.timestamp,
    };

    // Obvesti vse v sobi o posodobitvi
    const io = req.app.get('io');
    io.to(message.meeting._id.toString()).emit('updateMeetingMessage', payload);
    console.log(`Message update sent to clients: ${messageId}`);

    return res.status(200).json({ success: true, data: payload });
  } catch (error) {
    console.error('Error updating message:', error);
    return res.status(500).json({
      success: false,
      message: 'Napaka pri posodabljanju sporočila.',
    });
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
 *   description: Delete a specific message by its ID.
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
 *         meeting: "64b8c3d5e4f77b002f6d5e9b"
 *         user: "64a1b2c3d4e5f6001a2b3c4d"
 *         message: "Komaj cakam meeting"
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
  const messageId = req.params.messageId;

  if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) {
    return res.status(400).json({ success: false, message: 'ID sporocila ni validen.' });
  }

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Sporočilo ne obstaja.' });
    }

    // Preveri, ali je uporabnik lastnik sporočila ali admin
    const userId = req.user.id;
    const userRole = req.user.role;

    if (message.user.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Nimate dovoljenja za brisanje tega sporočila.',
      });
    }

    await message.deleteOne();
    console.log(`Message deleted from database: ${messageId}`);

    // Obvesti vse v sobi (chat meetinga) da je bilo sporočilo izbrisano
    const io = req.app.get('io');
    io.to(message.meeting.toString()).emit('deleteMeetingMessage', { messageId: messageId });
    console.log(`Message deletion sent to clients: ${messageId}`);

    return res.status(200).json({ success: true, data: message });
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
