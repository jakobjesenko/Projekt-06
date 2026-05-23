// api/models/Report.js
import mongoose from "mongoose";

/**
 * @openapi
 * components:
 *  schemas:
 *   Report:
 *    type: object
 *    description: Scheme for reports submitted by users against other users in meetings.
 *    properties:
 *     _id:
 *      type: string
 *      description: Unique identifier for the report
 *      example: 68012345bcf86cd799439099
 *     reporter:
 *      type: string
 *      description: Reference to the user who created the report
 *      $ref: '#/components/schemas/User'
 *     reportedUser:
 *      type: string
 *      description: Reference to the user being reported
 *      $ref: '#/components/schemas/User'
 *     meeting:
 *      type: string
 *      description: Reference to the meeting where the issue happened
 *      $ref: '#/components/schemas/Meeting'
 *     description:
 *      type: string
 *      description: Detailed explanation of the report
 *      minLength: 10
 *      maxLength: 2000
 *      example: User repeatedly used offensive language during the meeting.
 *     status:
 *      type: string
 *      description: Current processing status of the report
 *      enum: [new, in-review, resolved, rejected]
 *      default: new
 *      example: in-review
 *     createdAt:
 *      type: string
 *      format: date-time
 *      description: Timestamp when the report was created
 *      example: 2026-04-11T10:30:00.000Z
 *     updatedAt:
 *      type: string
 *      format: date-time
 *      description: Timestamp when the report was last updated
 *      example: 2026-04-11T12:00:00.000Z
 *    required:
 *    - _id
 *    - reporter
 *    - reportedUser
 *    - meeting
 *    - description
 *    - status
 *    - createdAt
 *    - updatedAt
 */

const reportSchema = new mongoose.Schema({
	reporter: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: [true, "Reporter is required"],
	},
	reportedUser: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: [true, "Reported user is required"],
	},
	meeting: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Meeting",
		required: [true, "Meeting reference is required"],
	},
	description: {
		type: String,
		required: [true, "Report description is required"],
		trim: true,
		minlength: [10, "Description must have at least 10 characters"],
		maxlength: [2000, "Description is too long"],
	},
	status: {
		type: String,
		enum: ["new", "in-review", "resolved", "rejected"],
		default: "new",
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

reportSchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

// STATIC METHOD: get paginated reports
reportSchema.statics.getPaginatedReports = async function ({
	offset,
	limit,
	status,
	search,
	reporter,
	reportedUser,
	meeting,
}) {
	const query = {};

	if (status) {
		query.status = status;
	}

	if (reporter) {
		query.reporter = reporter;
	}

	if (reportedUser) {
		query.reportedUser = reportedUser;
	}

	if (meeting) {
		query.meeting = meeting;
	}

	if (search) {
		query.description = { $regex: search, $options: "i" };
	}

	const [reports, totalCount] = await Promise.all([
		this.find(query)
			.sort({ createdAt: -1 })
			.skip(offset)
			.limit(limit)
			.populate("reporter", "username firstName lastName email")
			.populate("reportedUser", "username firstName lastName email strikes status isActive activeSearch")
			.populate("meeting", "groupName date")
			.lean(),
		this.countDocuments(query),
	]);

	return { reports, totalCount };
};

reportSchema.index({ createdAt: -1 });
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ reporter: 1, createdAt: -1 });
reportSchema.index({ reportedUser: 1, createdAt: -1 });
reportSchema.index({ meeting: 1, createdAt: -1 });

export default mongoose.model("Report", reportSchema, "reports");
