import mongoose from 'mongoose';
import Report from '../models/reports.js';
import Meeting from '../models/meetings.js';
import User from '../models/users.js';

/**
 * @openapi
 * /reports:
 *  get:
 *   summary: Retrieves paginated reports
 *   description: Retrieves a paginated list of reports. Accessible only to admin users.
 *   tags: [Reports]
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
 *       enum: [new, in-review, resolved, rejected]
 *      description: Filter reports by status
 *      required: false
 *      example: new
 *    - name: search
 *      in: query
 *      schema:
 *       type: string
 *      description: Search term for report description
 *      required: false
 *      example: žaljiv jezik
 *    - name: reporter
 *      in: query
 *      schema:
 *       type: string
 *      description: Filter by reporter user ID
 *      required: false
 *      example: 68012345bcf86cd799439011
 *    - name: reportedUser
 *      in: query
 *      schema:
 *       type: string
 *      description: Filter by reported user ID
 *      required: false
 *      example: 68012345bcf86cd799439012
 *    - name: meeting
 *      in: query
 *      schema:
 *       type: string
 *      description: Filter by meeting ID
 *      required: false
 *      example: 68012345bcf86cd799439013
 *   responses:
 *    '200':
 *     description: Successfully retrieved paginated array of reports
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
 *           $ref: '#/components/schemas/Report'
 *         pagination:
 *          type: object
 *          properties:
 *           total:
 *            type: integer
 *            description: Total number of reports
 *            example: 85
 *           page:
 *            type: integer
 *            description: Current page number
 *            example: 1
 *           totalPages:
 *            type: integer
 *            description: Total number of pages
 *            example: 3
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
 *        message: "Prislo je do napake pri pridobivanju prijav."
 */
const getAllReports = async (req, res) => {
	try {
		let page = Number.parseInt(req.query.page, 10) || 1;
		let limit = Number.parseInt(req.query.limit, 10) || 30;

		if (page < 1) page = 1;
		if (limit < 1) limit = 30;
		if (limit > 100) limit = 100;

		const offset = (page - 1) * limit;

		const allowedStatuses = ['new', 'in-review', 'resolved', 'rejected'];
		const status = allowedStatuses.includes(req.query.status) ? req.query.status : null;
		const search = req.query.search || '';

		const reporter = mongoose.Types.ObjectId.isValid(req.query.reporter || '')
			? req.query.reporter
			: null;
		const reportedUser = mongoose.Types.ObjectId.isValid(req.query.reportedUser || '')
			? req.query.reportedUser
			: null;
		const meeting = mongoose.Types.ObjectId.isValid(req.query.meeting || '')
			? req.query.meeting
			: null;

		const { reports, totalCount } = await Report.getPaginatedReports({
			offset,
			limit,
			status,
			search,
			reporter,
			reportedUser,
			meeting,
		});

		return res.status(200).json({
			success: true,
			data: reports,
			pagination: {
				total: totalCount,
				page,
				totalPages: totalCount > 0 ? Math.ceil(totalCount / limit) : 0,
			},
		});
	} catch (error) {
		console.error('Error fetching reports:', error);
		return res.status(500).json({ error: 'An error occurred while fetching reports.' });
	}
};

/**
 * @openapi
 * /reports:
 *  post:
 *   tags: [Reports]
 *   security:
 *    - jwt: []
 *   summary: Creates a new report
 *   description: Logged in user submits a report for a specific user in a specific meeting.
 *   requestBody:
 *    required: true
 *    description: Report data
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       required:
 *       - reportedUser
 *       - meeting
 *       - description
 *       properties:
 *        reportedUser:
 *         type: string
 *         description: ID of user being reported
 *         example: 68012345bcf86cd799439012
 *        meeting:
 *         type: string
 *         description: ID of meeting where issue occurred
 *         example: 68012345bcf86cd799439013
 *        description:
 *         type: string
 *         description: Description of report reason
 *         minLength: 10
 *         maxLength: 2000
 *         example: Uporabnik je večkrat pošiljal žaljiva sporočila.
 *   responses:
 *    '201':
 *     description: Report successfully created
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: true
 *         data:
 *          $ref: '#/components/schemas/Report'
 *       example:
 *        success: true
 *        data:
 *         _id: 68012345bcf86cd799439099
 *         reporter: 68012345bcf86cd799439011
 *         reportedUser: 68012345bcf86cd799439012
 *         meeting: 68012345bcf86cd799439013
 *         description: Uporabnik je večkrat pošiljal žaljiva sporočila.
 *         status: new
 *    '400':
 *     description: Invalid request data
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        invalid reportedUser:
 *         value:
 *          success: false
 *          message: "reportedUser ID je obvezen in mora biti veljaven."
 *        invalid meeting:
 *         value:
 *          success: false
 *          message: "meeting ID je obvezen in mora biti veljaven."
 *        invalid description:
 *         value:
 *          success: false
 *          message: "Opis prijave mora imeti med 10 in 2000 znaki."
 *        self report:
 *         value:
 *          success: false
 *          message: "Uporabnik ne more prijaviti samega sebe."
 *        reported user not in meeting:
 *         value:
 *          success: false
 *          message: "Prijavljeni uporabnik ni član izbranega meetinga."
 *    '403':
 *     description: Forbidden - user not allowed to report for this meeting.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Nimate dovoljenja za prijavo v tem meetingu."
 *    '404':
 *     description: Related user or meeting not found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        reporter missing:
 *         value:
 *          success: false
 *          message: "Prijavitelj ne obstaja."
 *        reported user missing:
 *         value:
 *          success: false
 *          message: "Prijavljeni uporabnik ne obstaja."
 *        meeting missing:
 *         value:
 *          success: false
 *          message: "Meeting ne obstaja."
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Prislo je do napake pri ustvarjanju prijave."
 */
const createReport = async (req, res) => {
	const reporter = req.user.id;
	const { reportedUser, meeting, description } = req.body;

	if (!reportedUser || !mongoose.Types.ObjectId.isValid(reportedUser)) {
		return res.status(400).json({ error: 'reportedUser ID je obvezen in mora biti veljaven.' });
	}

	if (!meeting || !mongoose.Types.ObjectId.isValid(meeting)) {
		return res.status(400).json({ error: 'meeting ID je obvezen in mora biti veljaven.' });
	}

	if (!description || description.trim().length < 10 || description.trim().length > 2000) {
		return res
			.status(400)
			.json({ error: 'Opis prijave mora imeti med 10 in 2000 znaki.' });
	}

	if (reporter.toString() === reportedUser.toString()) {
		return res.status(400).json({ error: 'Uporabnik ne more prijaviti samega sebe.' });
	}

	try {
		const [reporterUser, reportedUserDoc, meetingDoc] = await Promise.all([
			User.findById(reporter).select('_id'),
			User.findById(reportedUser).select('_id'),
			Meeting.findById(meeting).select('members'),
		]);

		if (!reporterUser) {
			return res.status(404).json({ error: 'Prijavitelj ne obstaja.' });
		}

		if (!reportedUserDoc) {
			return res.status(404).json({ error: 'Prijavljeni uporabnik ne obstaja.' });
		}

		if (!meetingDoc) {
			return res.status(404).json({ error: 'Meeting ne obstaja.' });
		}

		const meetingMemberIds = (meetingDoc.members || []).map((member) => member.user.toString());
		if (!meetingMemberIds.includes(reporter.toString())) {
			return res.status(403).json({ error: 'Nimate dovoljenja za prijavo v tem meetingu.' });
		}

		if (!meetingMemberIds.includes(reportedUser.toString())) {
			return res
				.status(400)
				.json({ error: 'Prijavljeni uporabnik ni član izbranega meetinga.' });
		}

		const newReport = await Report.create({
			reporter,
			reportedUser,
			meeting,
			description: description.trim(),
		});

		return res.status(201).json({ success: true, data: newReport });
	} catch (error) {
		console.error('Error creating report:', error);
		return res.status(500).json({ error: 'An error occurred while creating report.' });
	}
};

/**
 * @openapi
 * /reports/{reportId}/status:
 *  put:
 *   summary: Updates the report status
 *   description: Updates status of a report by ID. Accessible only to admin users.
 *   tags: [Reports]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: reportId
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
 *       required:
 *       - status
 *       properties:
 *        status:
 *         type: string
 *         enum: [new, in-review, resolved, rejected]
 *         description: New status value for report
 *         example: in-review
 *   responses:
 *    '200':
 *     description: Report status updated
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: true
 *         data:
 *          $ref: '#/components/schemas/Report'
 *       example:
 *        success: true
 *        data:
 *         _id: 68012345bcf86cd799439099
 *         status: in-review
 *    '400':
 *     description: Invalid input
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        invalid reportId:
 *         value:
 *          success: false
 *          message: "ID prijave ni veljaven."
 *        invalid status:
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
 *     description: Report not found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Prijava ne obstaja."
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Prislo je do napake pri posodabljanju statusa prijave."
 */
const updateReportStatus = async (req, res) => {
	const { reportId } = req.params;
	const { status } = req.body;

	if (!reportId || !mongoose.Types.ObjectId.isValid(reportId)) {
		return res.status(400).json({ error: 'ID prijave ni veljaven.' });
	}

	const allowedStatuses = ['new', 'in-review', 'resolved', 'rejected'];
	if (!allowedStatuses.includes(status)) {
		return res.status(400).json({ error: 'Neveljavna vrednost statusa.' });
	}

	try {
		const updatedReport = await Report.findByIdAndUpdate(
			reportId,
			{ status, updatedAt: Date.now() },
			{ new: true, runValidators: true },
		);

		if (!updatedReport) {
			return res.status(404).json({ error: 'Prijava ne obstaja.' });
		}

		return res.status(200).json({ success: true, data: updatedReport });
	} catch (error) {
		console.error('Error updating report status:', error);
		return res.status(500).json({ error: 'An error occurred while updating report status.' });
	}
};

/**
 * @openapi
 * /reports/{reportId}:
 *  delete:
 *   summary: Deletes a report by ID
 *   description: Deletes report by ID. Accessible only to admin users.
 *   tags: [Reports]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: reportId
 *      in: path
 *      required: true
 *      schema:
 *       type: string
 *   responses:
 *    '200':
 *     description: Report deleted successfully
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
 *           reportId:
 *            type: string
 *            example: 68012345bcf86cd799439099
 *       example:
 *        success: true
 *        data:
 *         reportId: 68012345bcf86cd799439099
 *    '400':
 *     description: Invalid report ID
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "ID prijave ni veljaven."
 *    '401':
 *     description: Forbidden - admin access only.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Nimate dovoljenja za izvedbo te akcije."
 *    '404':
 *     description: Report not found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Prijava ne obstaja."
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: "Prislo je do napake pri brisanju prijave."
 */
const deleteReport = async (req, res) => {
	const { reportId } = req.params;

	if (!reportId || !mongoose.Types.ObjectId.isValid(reportId)) {
		return res.status(400).json({ error: 'ID prijave ni veljaven.' });
	}

	try {
		const report = await Report.findById(reportId);

		if (!report) {
			return res.status(404).json({ error: 'Prijava ne obstaja.' });
		}

		await report.deleteOne();

		return res.status(200).json({ success: true, data: { reportId } });
	} catch (error) {
		console.error('Error deleting report:', error);
		return res.status(500).json({ error: 'An error occurred while deleting report.' });
	}
};

export default {
	getAllReports,
	createReport,
	updateReportStatus,
	deleteReport,
};
