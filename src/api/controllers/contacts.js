import mongoose from 'mongoose';
import Contact from '../models/contacts.js';
import { sendContactNotificationEmail } from '../utils/email.js';

/**
 * @openapi
 * /contacts:
 *  get:
 *   summary: Retrieves paginated contact form submissions
 *   description: Retrieves a paginated list of contact form submissions. Accessible only to admin users.
 *   tags: [Contacts]
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
 *    - name: status
 *      in: query
 *      schema:
 *       type: string
 *       enum: [new, in-progress, resolved]
 *      description: Filter contact forms by status
 *      required: true
 *      example: new
 *   responses:
 *    '200':
 *     description: Successfully retrieved paginated array of contact forms
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
 *           $ref: '#/components/schemas/Contact'
 *         pagination:
 *          type: object
 *          properties:
 *           total:
 *            type: integer
 *            description: Total number of contact forms
 *            example: 150
 *           page:
 *            type: integer
 *            description: Current page number
 *            example: 1
 *           totalPages:
 *            type: integer
 *            description: Total number of pages
 *            example: 5
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
 *        message: "Prislo je do napake pri pridobivanju kontaktnega obrazca."
 */

// GET /api/contacts : pridobi vse kontaktne obrazce iz baze, dostopno samo adminu na admin dashboardu
const getAllContactForms = async (req, res) => {
  try {
    let page = Number.parseInt(req.query.page, 10) || 1;
    let limit = Number.parseInt(req.query.limit, 10) || 30;

    if (page < 1) page = 1;
    if (limit < 1) limit = 30;
    if (limit > 100) limit = 100;

    const offset = (page - 1) * limit;

    const allowedStatuses = ['new', 'in-progress', 'resolved'];
    const status = allowedStatuses.includes(req.query.status) ? req.query.status : null;
    const search = req.query.search || '';

    const { contacts, totalCount } = await Contact.getPaginatedContacts({
      limit,
      offset,
      status,
      search,
    });

    console.log(
      `Retrieved ${contacts.length} contact forms for page ${page} with status ${status}`,
    );
    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        total: totalCount,
        page: page,
        totalPages: totalCount > 0 ? Math.ceil(totalCount / limit) : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching contact forms:', error);
    res.status(500).json({ error: 'An error occurred while fetching contact forms.' });
  }
};

/**
 * @openapi
 * /contacts:
 *  post:
 *   tags: [Contacts]
 *   security:
 *    - jwt: []
 *   summary: Sends a contact form
 *   description: Accepts a contact form, saves it to the database, and sends a notification to the administrator.
 *   requestBody:
 *    required: true
 *    description: Contact form data
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *         example: Janez
 *        lastName:
 *         type: string
 *         example: Novak
 *        email:
 *         type: string
 *         example: janez@gmail.com
 *        subject:
 *         type: string
 *         example: Težava z nakupom vstopnice
 *        message:
 *         type: string
 *         example: Ne uspe mi dokončati nakupa.
 *       required:
 *       - name
 *       - lastName
 *       - email
 *       - subject
 *       - message
 *   responses:
 *    '201':
 *     description: Successfully submitted contact form
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Contact'
 *    '400':
 *     description: Invalid input data
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        missing fields:
 *         value:
 *          success: false
 *          message: "Vsa polja so obvezna."
 *        invalid email:
 *         value:
 *          success: false
 *          message: "Prosim, vnesite veljaven email."
 *        message too long:
 *         value:
 *          success: false
 *          message: "Sporočilo lahko vsebuje najvec 1000 znakov."
 *        name too long:
 *         value:
 *          success: false
 *          message: "Ime je predolgo, vnesite pravilno ime"
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Prislo je do napake pri shranjevanju obrazca. Poskusite znova."
 */

// POST /api/contacts shrani kontaktni obrazec v bazo
const submitContactForm = async (req, res) => {
  let { name, lastName, email, subject, message } = req.body;

  if (!name || !lastName || !email || !message || !subject) {
    return res.status(400).json({ error: 'Vsa polja so obvezna.' });
  } else {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Prosim, vnesite veljaven email.' });
    }
    if (message.length > 5000) {
      return res.status(400).json({ error: 'Sporočilo lahko vsebuje najvec 5000 znakov.' });
    }
    if (name.length > 50) {
      return res.status(400).json({ error: 'Ime je predolgo, vnesite pravilno ime' });
    }
    if (lastName.length > 50) {
      return res.status(400).json({ error: 'Priimek je predolgo, vnesite pravilno ime' });
    }

    try {
      // shrani v bazo, ce kasneje implementiras prek admin_dashboarda obravnavo kontaktnih obrazcev, ne pozabi dat "status:default = new"
      const newContact = await Contact.create({
        //user: req.user.id || null, // pridobi id iz JWT tokena !!!!!!!!!!! odkomentiraj kasneje
        name,
        lastName,
        email,
        subject,
        message,
      });
      console.log(`Contact form saved to database.${newContact.email}`);

      await sendContactNotificationEmail(name, lastName, email, subject, message);
      console.log(`Contact notification email sent for ${newContact.email}`);
      res.status(201).json({
        success: true,
        data: newContact,
      });
    } catch (error) {
      console.error('Error saving contact form:', error);
      res.status(500).json({
        error: 'Napaka pri shranjevanju obrazca. Poskusite znova.',
      });
    }
  }
};

/**
 * @openapi
 * /contacts/{contactId}/status:
 *  put:
 *   summary: Updates the status of a contact form submission
 *   description: Updates the status of a contact form submission by its ID.
 *   tags: [Contacts]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: contactId
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      required: true
 *      description: ID of the contact form submission to update
 *      example: 692232bc6b5321f2edbf71e4
 *   requestBody:
 *    description: New status for the contact form submission
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        status:
 *         type: string
 *         enum: [new, in-progress, resolved]
 *         description: New status for the contact form submission
 *         example: in-progress
 *   responses:
 *    '200':
 *     description: Successfully updated contact form status.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SuccessMessage'
 *       example:
 *        success: true
 *        message: "Status kontaktnega obrazca z ID-jem je bil uspešno posodobljen."
 *    '400':
 *     description: Bad Request, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        invalid contactId:
 *         value:
 *          success: false
 *          message: "ID kontaktnega obrazca ni validen."
 *        invalid status value:
 *         value:
 *          success: false
 *          message: "Neveljavna vrednost statusa."
 *    '401':
 *     description: Forbidden - admin access only.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Nimate dovoljenja za ta dejanje."
 *    '404':
 *     description: Contact form not Found, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Kontaktni obrazec z ID-jem '69222118946b3cd4d6436016' ni bil najden."
 *    '500':
 *     description: Server error, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Prislo je do napake pri posodabljanju statusa kontaktnega obrazca."
 */

// PUT /api/contacts/:contactId : posodobi status kontaktnega obrazca, dostopno samo adminu na admin dashboardu
const updateContactFormStatus = async (req, res) => {
  let contactId = req.params.contactId;
  let { status } = req.body;

  const allowedStatuses = ['new', 'in-progress', 'resolved'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value.' });
  }
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(400).json({ error: 'ID of contact form is not valid.' });
  }
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { status },
      { new: true, runValidators: true },
    );
    if (!updatedContact) {
      return res.status(404).json({ error: 'Contact form not found.' });
    }
    updatedContact.status = status;
    await updatedContact.save();
    console.log(`Contact form ${contactId} status updated to ${status}`);
    res.status(200).json({
      success: true,
      message: `Status of contact form ${contactId} has been successfully updated.`,
    });
  } catch (error) {
    console.error('Error updating contact form status:', error);
    res.status(500).json({ error: 'An error occurred while updating the contact form status.' });
  }
};

/**
 * @openapi
 * /contacts/{contactId}:
 *  delete:
 *   summary: Deletes a contact form submission by ID
 *   description: Deletes a contact form submission by its ID. Accessible only to admin users.
 *   tags: [Contacts]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: contactId
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      required: true
 *      description: ID of the contact form submission to delete
 *      example: 69222118946b3cd4d6436016
 *   responses:
 *    '200':
 *     description: Successfully deleted contact form submission.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SuccessMessage'
 *       example:
 *        success: true
 *        message: "Kontaktni obrazec je bil uspešno izbrisan."
 *    '400':
 *     description: Bad Request, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        missing contactId:
 *         value:
 *          success: false
 *          message: "ID kontaktnega obrazca je obvezen."
 *    '401':
 *     description: Unauthorized - user not logged in.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Nimate dovoljenja za ta dejanje."
 *    '403':
 *     description: Forbidden - admin access only.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Nimate dovoljenja za izvedbo te akcije."
 *    '404':
 *     description: Contact form not Found, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Kontaktni obrazec z ID-jem '735a62f5dc5d7968e6846914' ni bil najden."
 *    '500':
 *     description: Server error, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: "Prislo je do napake pri brisanju kontaktnega obrazca."
 */

// DELETE /api/contacts/:contactId : Brisanje kontaktnega obrazca iz baze, dostopno samo adminu na admin dashboardu
const deleteContactForm = async (req, res) => {
  let contactId = req.params.contactId;
  if (!contactId) {
    return res.status(400).json({ error: 'ID kontaktnega obrazca je obvezen.' });
  } else {
    try {
      let contactForm = await Contact.findById(contactId);
      if (!contactForm) {
        return res.status(404).json({ error: 'Kontaktni obrazec ni bil najden.' });
      }
      await Contact.findByIdAndDelete(contactId);
      console.log(`Contact form deleted from database.${contactId}`);
      res.status(200).json({ success: true, data: contactForm });
    } catch (error) {
      console.error('Error deleting contact form:', error);
      res.status(500).json({ error: 'An error occurred while deleting the contact form.' });
    }
  }
};

export default {
  submitContactForm,
  getAllContactForms,
  updateContactFormStatus,
  deleteContactForm,
};