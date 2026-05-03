import mongoose from 'mongoose';

/**
 * @openapi
 * components:
 *  schemas:
 *   Contact:
 *    type: object
 *    description: Scheme for contact forms submitted by users
 *    properties:
 *     _id:
 *      type: string
 *      description: Unique identifier for the contact form
 *      example: 64a7b2f5c9e77b001f5d4e8a
 *     user:
 *      type: string
 *      description: Reference to the user who submitted the contact form
 *      $ref: '#/components/schemas/User'
 *     name:
 *      type: string
 *      description: Name of the user submitting the contact form
 *      minLength: 2
 *      maxLength: 50
 *      example: John
 *     lastName:
 *      type: string
 *      description: Last name of the user submitting the contact form
 *      minLength: 2
 *      maxLength: 50
 *      example: Doe
 *     email:
 *      type: string
 *      description: Email address of the user
 *      example: john.doe@gmail.com
 *     subject:
 *      type: string
 *      description: Subject of the message
 *      enum: [Težave z registracijo, Težave s prijavo, Splošno vprašanje, Drugo]
 *      example: Inquiry about services
 *     message:
 *      type: string
 *      description: Content of the message
 *      minLength: 1
 *      maxLength: 5000
 *      example: I would like to know more about your services.
 *     status:
 *      type: string
 *      description: Status of the contact form processing
 *      enum: [new, in-progress, resolved]
 *      example: new
 *     createdAt:
 *      type: string
 *      format: date-time
 *      description: Date when the contact form was created
 *      example: 2023-07-06T12:34:56.789Z
 *    required:
 *    - _id
 *    - user
 *    - name
 *    - lastName
 *    - email
 *    - subject
 *    - message
 *    - status
 *    - createdAt
 */

// shema za kontaktne obrazce ki jih uporabniki izpolnijo
const contactSchema = new mongoose.Schema({
  user: {
    // referenca na uporabnika ki je izpolnil obrazec
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    //required: [true, 'Referenca na uporabnika je obvezna'], !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!ODKOMENTIRI KASNEJE K KONCAS TESTIRANJE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  },
  name: {
    // ime uporabnika, v conctact.html pise "Ime" popravi kasneje če rabi
    type: String,
    required: [true, 'Ime je obvezno'],
    trim: true,
    minlength: [2, 'Ime mora imeti vsaj 2 znaka'],
    maxlength: [50, 'Ime je predolgo'],
  },
  lastName: {
    // priimek
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name is too long'],
  },
  email: {
    // email uporabnika
    type: String,
    required: [true, 'Email je obvezen'],
    match: [/^\S+@\S+\.\S+$/, 'Prosim, vnesite veljaven email'],
  },
  subject: {
    // zadeva sporočila
    type: String,
    required: [true, 'Zadeva je obvezna'],
    trim: true,
  },
  message: {
    // vsebina sporočila
    type: String,
    required: [true, 'Sporočilo je obvezno'],
    maxlength: [5000, 'Sporočilo lahko vsebuje največ 5000 znakov'],
    trim: true,
  },
  status: {
    // status obravnave sporočila, ce bo rablo kasneje dopolni
    type: String,
    enum: ['new', 'in-progress', 'resolved'],
    default: 'new',
  },
  createdAt: {
    // datum nastanka sporočila
    type: Date,
    default: Date.now,
  },
});

// STATIC METHOD: get paginated contacts
contactSchema.statics.getPaginatedContacts = async function ({ offset, limit, status, search }) {
  const query = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
    ];
  }

  const [contacts, totalCount] = await Promise.all([
    this.find(query)
      .sort({ createdAt: -1 }) // najnovejši najprej
      .skip(offset)
      .limit(limit)
      .lean(),
    this.countDocuments(query),
  ]);

  return { contacts, totalCount };
};

/*******************
 * INDEXI
 ******************/

// Sort + pagination
contactSchema.index({ createdAt: -1 });

// Filtriranje po statusu
contactSchema.index({ status: 1 });

// Najhitrejši za admin dashboard
contactSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Contact', contactSchema, 'contacts'); // ime modela je Contact ime zbirke (collection v mongo bazi) pa contacts