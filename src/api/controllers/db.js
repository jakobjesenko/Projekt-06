import mongoose from 'mongoose';
import User from '../models/users.js';
import Meeting from '../models/meetings.js';
import Message from '../models/messages.js';
import Rating from '../models/ratings.js';
import Report from '../models/reports.js';
import Contact from '../models/contacts.js';
import Analytics from '../models/analytics.js';
import { randomInt } from '../utils/random.js';

import {
  generateUsers,
  generateMeetings,
  generateRatings,
  generateMessages,
  generateReports,
  generateContacts,
  generateAnalytics,
} from '../../data/generators.js';

/**
 * @openapi
 * /db/import:
 *  post:
 *   summary: Import seed data
 *   description: Delete all existing data and import fresh seed data for testing. Admin only.
 *   tags: [Database]
 *   security:
 *    - jwt: []
 *   responses:
 *    '200':
 *     description: Data imported successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: true
 *         message:
 *          type: string
 *          example: "Seed podatki uspešno uvoženi!"
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
 *    '500':
 *     description: Server error, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: "Prislo je do napake pri vračanju podatkov iz baze."
 */
const importData = async (req, res) => {
  try {
    console.log('🔥 Importing seed data...');

    // ── 1. Počisti obstoječe podatke in indexe ──────────────────────────────
    const collections = mongoose.connection.collections;
    for (const name in collections) {
      try {
        await collections[name].deleteMany();
        await collections[name].dropIndexes();
      } catch (e) {
        if (!e.message.includes('ns not found')) {
          console.log(`Index drop error in ${name}:`, e.message);
        }
      }
    }

    // ── 2. Admin uporabnik ──────────────────────────────────────────────────
    console.log('👤 Creating admin user...');
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      username: 'admin_1',
      email: 'admin@meetup.net',
      password: 'password123',
      role: 'admin',
      status: 'active',
      birthday: new Date('1990-01-01'),
      profileImage: `${process.env.APP_URL || 'http://localhost:3000'}/uploads/users/default-avatar.png`,
      interests: ['organizacija', 'tehnologija'],
      availability: ['ponedeljek zvečer', 'sobota dopoldne'],
      activeSearch: false,
      location: { lat: 46.0569, lng: 14.5058, radius: 10 },
      accountSecurity: { emailVerified: true },
      termsAccepted: true,
    });
    console.log('✅ Admin user created:', adminUser._id);

    // ── 3. Navadni uporabniki ───────────────────────────────────────────────
    const rawUsers = generateUsers(30);
    const users = await User.insertMany(rawUsers);
    console.log(`✅ ${users.length} users imported`);

    // ── 4. Meetings ─────────────────────────────────────────────────────────
    // Preden insertamo meetinge, moramo imeti _id-je userjev
    const rawMeetings = generateMeetings(users, 25);
    const meetings = await Meeting.insertMany(rawMeetings);
    console.log(`✅ ${meetings.length} meetings imported`);

    // Premakni completed/cancelled meetinge v preteklost (brez create-time validatorja)
    for (const meeting of meetings) {
      if (!['completed', 'cancelled'].includes(meeting.status)) {
        continue;
      }

      const pastDate = new Date(Date.now() - randomInt(1, 60) * 24 * 60 * 60 * 1000);
      await Meeting.findByIdAndUpdate(meeting._id, { date: pastDate });
      meeting.date = pastDate;
    }

    // ── 5. Ratings (samo za completed meetinge) ─────────────────────────────
    const rawRatings = generateRatings(users, meetings);
    const ratings = rawRatings.length > 0 ? await Rating.insertMany(rawRatings) : [];
    console.log(`✅ ${ratings.length} ratings imported`);

    // ── 6. Messages ─────────────────────────────────────────────────────────
    const rawMessages = generateMessages(users, meetings, 80);
    const messages = rawMessages.length > 0 ? await Message.insertMany(rawMessages) : [];
    console.log(`✅ ${messages.length} messages imported`);

    // ── 7. Reports ──────────────────────────────────────────────────────────
    const rawReports = generateReports(users, meetings, 10);
    const reports = rawReports.length > 0 ? await Report.insertMany(rawReports) : [];
    console.log(`✅ ${reports.length} reports imported`);

    // ── 8. Contacts ─────────────────────────────────────────────────────────
    const rawContacts = generateContacts(12);
    const contacts = await Contact.insertMany(rawContacts);
    console.log(`✅ ${contacts.length} contacts imported`);

    // ── 9. Analytics ────────────────────────────────────────────────────────
    const rawAnalytics = generateAnalytics(users.length + 1, meetings.length);
    const analytics = await Analytics.insertMany(rawAnalytics);
    console.log(`✅ ${analytics.length} analytics records imported`);

    console.log('🎉 Seed data imported successfully!');

    res.status(201).json({
      success: true,
      message: 'Seed podatki uspešno uvoženi!',
      counts: {
        admin: 1,
        users: users.length,
        meetings: meetings.length,
        ratings: ratings.length,
        messages: messages.length,
        reports: reports.length,
        contacts: contacts.length,
        analytics: analytics.length,
      },
    });
  } catch (err) {
    console.error('❌ Seed import error:', err);
    res.status(500).json({
      success: false,
      message: 'Seed import failed',
      error: err.message,
    });
  }
};

/**
 * @openapi
 * /db/reset:
 *  post:
 *   summary: Reset database
 *   description: Delete all data from the database. Admin only.
 *   tags: [Database]
 *   security:
 *    - jwt: []
 *   responses:
 *    '200':
 *     description: Database reset successfully
 *    '500':
 *     description: Server error
 */
const resetDatabase = async (req, res) => {
  try {
    console.log('⚠️  Destroying all DB data...');

    const collections = mongoose.connection.collections;
    for (const name in collections) {
      try {
        await collections[name].deleteMany();
        await collections[name].dropIndexes();
      } catch (e) {
        if (!e.message.includes('ns not found')) {
          console.log(`Index drop error in ${name}:`, e.message);
        }
      }
    }

    console.log('✅ All data deleted');
    res.status(200).json({ success: true, message: 'Vsi podatki so bili izbrisani.' });
  } catch (err) {
    console.error('❌ Destroy error:', err);
    res.status(500).json({ success: false, message: 'Destroy failed', error: err.message });
  }
};

export default {
  importData,
  resetDatabase,
};