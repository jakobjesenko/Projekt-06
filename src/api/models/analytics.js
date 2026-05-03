import mongoose from 'mongoose';

/**
 * @openapi
 * components:
 *  schemas:
 *   Analytics:
 *    type: object
 *    description: Schema for a analytics.
 *    properties:
 *     _id:
 *      type: string
 *      description: <b>Unique identifier</b> of analytics
 *      example: 507f1f77bcf86cd799439011
 *     date:
 *      type: string
 *      format: date-time
 *      description: <b>Date</b> for which the analytics data is recorded
 *      example: 2023-10-20T00:00:00Z
 *     totalUsers:
 *      type: integer
 *      description: <b>Total number of users</b> in the system
 *      minimum: 0
 *      example: 1500
 *     activeUsers:
 *      type: integer
 *      description: <b>Number of active users</b> in the system
 *      minimum: 0
 *      example: 300
 *     totalMeetings:
 *      type: integer
 *      description: <b>Total number of meetings</b> in the system
 *      minimum: 0
 *      example: 200
 *     activeMeetings:
 *      type: integer
 *      description: <b>Number of active meetings</b> in the last month
 *      minimum: 0
 *      example: 50
 *     totalArtists:
 *      type: integer
 *      description: <b>Total number of artists</b> in the system
 *      minimum: 0
 *      example: 100
 *     timeframe:
 *      type: string
 *      description: <b>Timeframe</b> for which the analytics data is recorded
 *      enum: [daily, weekly, monthly, cumulative]
 *      example: daily
 *    required:
 *    - _id
 *    - date
 *    - totalUsers
 *    - activeUsers
 *    - totalMeetings
 *    - activeMeetings
 *    - timeframe
 */

// shema za analiticne podatke o uporabi aplikacije glej admi_dashboard.html
const analyticSchema = new mongoose.Schema({
  date: {
    // datum za katerega so podatki
    type: Date,
    required: true,
    unique: true,
    default: Date.now,
  },
  totalUsers: {
    // stevilo aktivnih uporabnikov glej admin_user_list.html
    type: Number,
    default: 0,
    min: 0,
  },
  activeUsers: {
    // stevilo aktivnih uporabnikov glej admin_user_list.html
    type: Number,
    default: 0,
    min: 0,
  },
  totalMeetings: {
    // skupno stevilo srecanj glej admin_meeting_list.html
    type: Number,
    default: 0,
    min: 0,
  },
  activeMeetings: {
    // stevilo srecanj ki so se zgodili v zadnjem mesecu glej admin_meeting_list.html
    type: Number,
    default: 0,
    min: 0,
  },
  timeframe: {
    // casovno obdobje za katerega so podatki
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'cumulative'],
    default: 'daily',
  },
});

export default mongoose.model('Analytic', analyticSchema, 'analytics'); // ime modela je Analytic ime zbirke (collection v mongo bazi) pa analytics