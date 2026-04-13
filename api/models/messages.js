import mongoose from 'mongoose';

/**
 * @openapi
 * components:
 *  schemas:
 *   Message:
 *    type: object
 *    description: Scheme for chat messages related to meetings
 *    properties:
 *     _id:
 *      type: string
 *      description: Unique identifier for the message
 *      example: 64b8c3d5e4f77b002f6d5e9b
 *     meeting:
 *      type: string
 *      description: Reference to the meeting associated with the message
 *      $ref: '#/components/schemas/Meeting'
 *     user:
 *      type: string
 *      description: Reference to the user who sent the message
 *      $ref: '#/components/schemas/User'
 *     message:
 *      type: string
 *      description: Content of the message
 *      minLength: 1
 *      maxLength: 500
 *      example: Looking forward to the meeting!
 *     timestamp:
 *      type: string
 *      format: date-time
 *      description: Timestamp when the message was sent
 *      example: 2023-07-06T12:34:56.789Z
 *    required:
 *    - _id
 *    - meeting
 *    - user
 *    - message
 *    - timestamp
 */

// shema za sporočila v klepetu o srecanju za tiste ki so kupili ticket za to srecanje
const messageSchema = new mongoose.Schema({
  meeting: {
    // referenca na srecanje
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting',
    required: [true, 'Referenca na srecanje je obvezna'],
  },
  user: {
    // referenca na uporabnika ki je poslal sporočilo, iz tle lahko potem dobiš username
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Referenca na uporabnika je obvezna'],
  },
  message: {
    // vsebina sporočila
    type: String,
    required: [true, 'Sporočilo je obvezno'],
    trim: true,
    maxlength: [500, 'Sporočilo ne sme presegati 500 znakov'], // eno sporocilo omejeno na 500 znakov
  },
  timestamp: {
    // čas pošiljanja sporočila
    type: Date,
    default: Date.now,
  },
});

// index za hitro iskanje sporočil po srecanju in času, ce bomo rabli
messageSchema.index({ meeting: 1, timestamp: -1 });

export default mongoose.model('Message', messageSchema, 'messages'); // ime modela je Message ime zbirke (collection v mongo bazi) pa messages