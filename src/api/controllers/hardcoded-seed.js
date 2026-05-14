import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/users.js';
import Meeting from '../models/meetings.js';
import Message from '../models/messages.js';
import Rating from '../models/ratings.js';
import Report from '../models/reports.js';
import Contact from '../models/contacts.js';
import Analytics from '../models/analytics.js';
import { randomInt } from '../utils/random.js';

let APP_URL;
if (process.env.NODE_ENV === 'production') {
  APP_URL = process.env.PROD_APP_URL || 'https://';
} else {
  APP_URL = process.env.APP_URL || 'http://localhost:3000';
}

/**
 * @openapi
 * /db/import-hardcoded:
 *  post:
 *   summary: Import hardcoded seed data
 *   description: Delete all existing data and import predefined hardcoded seed data. Admin only.
 *   tags: [Database]
 *   security:
 *    - jwt: []
 *   responses:
 *    '201':
 *     description: Hardcoded data imported successfully
 *    '500':
 *     description: Server error
 */
const importHardcodedData = async (req, res) => {
  try {
    console.log('🔥 Importing hardcoded seed data...');

    // ── 1. Počisti bazo ──────────────────────────────────────────────────────
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

    // ── 2. Uporabniki ────────────────────────────────────────────────────────
    const users = await User.insertMany([
      {
        firstName: 'Admin',
        lastName: 'Adminović',
        username: 'admin_1',
        email: 'admin@meetup.net',
        password: bcrypt.hashSync('password123', 12),
        role: 'admin',
        status: 'active',
        birthday: new Date('1985-03-15'),
        profileImage: `${APP_URL}/uploads/users/default-avatar.png`,
        interests: ['organizacija', 'tehnologija', 'kava'],
        availability: ['ponedeljek zvečer', 'sobota dopoldne'],
        activeSearch: false,
        location: { lat: 46.0569, lng: 14.5058, radius: 10 },
        accountSecurity: { emailVerified: true },
        termsAccepted: true,
        strikes: 0,
      },
      {
        firstName: 'Ana',
        lastName: 'Novak',
        username: 'ana_novak',
        email: 'ana@mail.com',
        password: bcrypt.hashSync('password123', 12),
        role: 'user',
        status: 'active',
        birthday: new Date('1995-07-22'),
        profileImage: `${APP_URL}/uploads/users/default-avatar.png`,
        interests: ['kava', 'branje', 'joga', 'pohodništvo'],
        availability: ['sobota dopoldne', 'nedelja dopoldne', 'petek zvečer'],
        activeSearch: true,
        location: { lat: 46.0580, lng: 14.5100, radius: 10 },
        accountSecurity: { emailVerified: true },
        termsAccepted: true,
        strikes: 0,
      },
      {
        firstName: 'Marko',
        lastName: 'Kovač',
        username: 'marko_kovac',
        email: 'marko@mail.com',
        password: bcrypt.hashSync('password123', 12),
        role: 'user',
        status: 'active',
        birthday: new Date('1992-11-08'),
        profileImage: `${APP_URL}/uploads/users/default-avatar.png`,
        interests: ['pohodništvo', 'fotografija', 'kolesarjenje', 'tek'],
        availability: ['sobota dopoldne', 'sobota zvečer', 'nedelja dopoldne'],
        activeSearch: true,
        location: { lat: 46.0550, lng: 14.5020, radius: 15 },
        accountSecurity: { emailVerified: true },
        termsAccepted: true,
        strikes: 0,
      },
      {
        firstName: 'Eva',
        lastName: 'Zupan',
        username: 'eva_zupan',
        email: 'eva@mail.com',
        password: bcrypt.hashSync('password123', 12),
        role: 'user',
        status: 'active',
        birthday: new Date('1998-02-14'),
        profileImage: `${APP_URL}/uploads/users/default-avatar.png`,
        interests: ['glasba', 'ples', 'filmi', 'kuhanje'],
        availability: ['petek zvečer', 'sobota zvečer', 'torek zvečer'],
        activeSearch: true,
        location: { lat: 46.0530, lng: 14.5080, radius: 5 },
        accountSecurity: { emailVerified: true },
        termsAccepted: true,
        strikes: 1,
      },
      {
        firstName: 'Tim',
        lastName: 'Horvat',
        username: 'tim_horvat',
        email: 'tim@mail.com',
        password: bcrypt.hashSync('password123', 12),
        role: 'user',
        status: 'active',
        birthday: new Date('1990-09-30'),
        profileImage: `${APP_URL}/uploads/users/default-avatar.png`,
        interests: ['board games', 'šah', 'gaming', 'tech'],
        availability: ['ponedeljek zvečer', 'sreda zvečer', 'sobota dopoldne'],
        activeSearch: true,
        location: { lat: 46.0600, lng: 14.5150, radius: 10 },
        accountSecurity: { emailVerified: true },
        termsAccepted: true,
        strikes: 0,
      },
      {
        firstName: 'Sara',
        lastName: 'Potočnik',
        username: 'sara_potocnik',
        email: 'sara@mail.com',
        password: bcrypt.hashSync('password123', 12),
        role: 'user',
        status: 'active',
        birthday: new Date('1996-05-19'),
        profileImage: `${APP_URL}/uploads/users/default-avatar.png`,
        interests: ['joga', 'meditacija', 'narava', 'branje', 'kava'],
        availability: ['sobota dopoldne', 'nedelja dopoldne', 'četrtek zvečer'],
        activeSearch: true,
        location: { lat: 46.0490, lng: 14.5000, radius: 8 },
        accountSecurity: { emailVerified: true },
        termsAccepted: true,
        strikes: 0,
      },
      {
        firstName: 'Luka',
        lastName: 'Mlakar',
        username: 'luka_mlakar',
        email: 'luka@mail.com',
        password: bcrypt.hashSync('password123', 12),
        role: 'user',
        status: 'pending',
        birthday: new Date('2000-12-01'),
        profileImage: `${APP_URL}/uploads/users/default-avatar.png`,
        interests: ['kolesarjenje', 'tek', 'fitnes'],
        availability: ['sobota dopoldne', 'nedelja popoldne'],
        activeSearch: false,
        location: { lat: 46.0620, lng: 14.5200, radius: 5 },
        accountSecurity: { emailVerified: false },
        termsAccepted: true,
        strikes: 0,
      },
      {
        firstName: 'Nika',
        lastName: 'Kralj',
        username: 'nika_kralj',
        email: 'nika@mail.com',
        password: bcrypt.hashSync('password123', 12),
        role: 'user',
        status: 'blocked',
        birthday: new Date('1993-06-25'),
        profileImage: `${APP_URL}/uploads/users/default-avatar.png`,
        interests: ['umetnost', 'fotografija', 'potovanja'],
        availability: ['petek zvečer', 'sobota zvečer'],
        activeSearch: false,
        isActive: false,
        location: { lat: 46.0460, lng: 14.4980, radius: 10 },
        accountSecurity: { emailVerified: true },
        termsAccepted: true,
        strikes: 3,
      },
      {
        firstName: 'Miha',
        lastName: 'Bizjak',
        username: 'miha_bizjak',
        email: 'miha@mail.com',
        password: bcrypt.hashSync('password123', 12),
        role: 'user',
        status: 'active',
        birthday: new Date('1994-01-12'),
        profileImage: `${APP_URL}/uploads/users/default-avatar.png`,
        interests: ['kolesarjenje', 'fotografija', 'kava'],
        availability: ['torek zvečer', 'sobota dopoldne', 'nedelja popoldne'],
        activeSearch: true,
        location: { lat: 46.0578, lng: 14.5122, radius: 12 },
        accountSecurity: { emailVerified: true },
        termsAccepted: true,
        strikes: 0,
      },
      {
        firstName: 'Klara',
        lastName: 'Kranjc',
        username: 'klara_kranjc',
        email: 'klara@mail.com',
        password: bcrypt.hashSync('password123', 12),
        role: 'user',
        status: 'active',
        birthday: new Date('1997-08-03'),
        profileImage: `${APP_URL}/uploads/users/default-avatar.png`,
        interests: ['umetnost', 'muzeji', 'branje'],
        availability: ['sreda popoldne', 'petek zvečer', 'sobota popoldne'],
        activeSearch: true,
        location: { lat: 46.0483, lng: 14.5068, radius: 8 },
        accountSecurity: { emailVerified: true },
        termsAccepted: true,
        strikes: 0,
      },
      {
        firstName: 'Urban',
        lastName: 'Zajc',
        username: 'urban_zajc',
        email: 'urban@mail.com',
        password: bcrypt.hashSync('password123', 12),
        role: 'user',
        status: 'active',
        birthday: new Date('1991-02-27'),
        profileImage: `${APP_URL}/uploads/users/default-avatar.png`,
        interests: ['tek', 'fitnes', 'wellness'],
        availability: ['ponedeljek zvečer', 'četrtek zvečer'],
        activeSearch: true,
        location: { lat: 46.0612, lng: 14.5008, radius: 10 },
        accountSecurity: { emailVerified: true },
        termsAccepted: true,
        strikes: 0,
      },
      {
        firstName: 'Nina',
        lastName: 'Vidmar',
        username: 'nina_vidmar',
        email: 'nina@mail.com',
        password: bcrypt.hashSync('password123', 12),
        role: 'user',
        status: 'active',
        birthday: new Date('1999-10-18'),
        profileImage: `${APP_URL}/uploads/users/default-avatar.png`,
        interests: ['glasba', 'koncerti', 'festival'],
        availability: ['petek zvečer', 'sobota zvečer'],
        activeSearch: true,
        location: { lat: 46.0506, lng: 14.5099, radius: 7 },
        accountSecurity: { emailVerified: true },
        termsAccepted: true,
        strikes: 0,
      },
      {
        firstName: 'Gregor',
        lastName: 'Korošec',
        username: 'gregor_korosec',
        email: 'gregor@mail.com',
        password: bcrypt.hashSync('password123', 12),
        role: 'user',
        status: 'active',
        birthday: new Date('1989-06-07'),
        profileImage: `${APP_URL}/uploads/users/default-avatar.png`,
        interests: ['startup scena', 'tehnologija', 'kava'],
        availability: ['torek popoldne', 'četrtek zvečer'],
        activeSearch: false,
        location: { lat: 46.0552, lng: 14.5027, radius: 9 },
        accountSecurity: { emailVerified: true },
        termsAccepted: true,
        strikes: 0,
      },
      {
        firstName: 'Kaja',
        lastName: 'Pirc',
        username: 'kaja_pirc',
        email: 'kaja@mail.com',
        password: bcrypt.hashSync('password123', 12),
        role: 'user',
        status: 'active',
        birthday: new Date('1993-04-23'),
        profileImage: `${APP_URL}/uploads/users/default-avatar.png`,
        interests: ['ples', 'teater', 'kino'],
        availability: ['torek zvečer', 'petek zvečer'],
        activeSearch: true,
        location: { lat: 46.0539, lng: 14.5124, radius: 6 },
        accountSecurity: { emailVerified: true },
        termsAccepted: true,
        strikes: 0,
      },
      {
        firstName: 'Nejc',
        lastName: 'Kotnik',
        username: 'nejc_kotnik',
        email: 'nejc@mail.com',
        password: bcrypt.hashSync('password123', 12),
        role: 'user',
        status: 'pending',
        birthday: new Date('2001-09-12'),
        profileImage: `${APP_URL}/uploads/users/default-avatar.png`,
        interests: ['gaming', 'retro igre', 'board games'],
        availability: ['sreda zvečer', 'sobota zvečer'],
        activeSearch: false,
        location: { lat: 46.0638, lng: 14.5181, radius: 5 },
        accountSecurity: { emailVerified: false },
        termsAccepted: true,
        strikes: 0,
      },
      {
        firstName: 'Maja',
        lastName: 'Kumer',
        username: 'maja_kumer',
        email: 'maja@mail.com',
        password: bcrypt.hashSync('password123', 12),
        role: 'user',
        status: 'active',
        birthday: new Date('1995-12-05'),
        profileImage: `${APP_URL}/uploads/users/default-avatar.png`,
        interests: ['branje', 'knjižni klub', 'poezija'],
        availability: ['sreda popoldne', 'nedelja dopoldne'],
        activeSearch: true,
        location: { lat: 46.0472, lng: 14.5046, radius: 7 },
        accountSecurity: { emailVerified: true },
        termsAccepted: true,
        strikes: 0,
      },
      {
        firstName: 'Tjaša',
        lastName: 'Štrukelj',
        username: 'tjasa_strukelj',
        email: 'tjasa@mail.com',
        password: bcrypt.hashSync('password123', 12),
        role: 'user',
        status: 'active',
        birthday: new Date('1998-03-30'),
        profileImage: `${APP_URL}/uploads/users/default-avatar.png`,
        interests: ['meditacija', 'mindfulness', 'wellness'],
        availability: ['četrtek popoldne', 'nedelja zjutraj'],
        activeSearch: true,
        location: { lat: 46.0448, lng: 14.4991, radius: 6 },
        accountSecurity: { emailVerified: true },
        termsAccepted: true,
        strikes: 0,
      },
      {
        firstName: 'Vid',
        lastName: 'Strnad',
        username: 'vid_strnad',
        email: 'vid@mail.com',
        password: bcrypt.hashSync('password123', 12),
        role: 'user',
        status: 'active',
        birthday: new Date('1990-05-11'),
        profileImage: `${APP_URL}/uploads/users/default-avatar.png`,
        interests: ['kolesarske ture', 'narava', 'pohodništvo'],
        availability: ['sobota zjutraj', 'nedelja dopoldne'],
        activeSearch: true,
        location: { lat: 46.0701, lng: 14.4902, radius: 12 },
        accountSecurity: { emailVerified: true },
        termsAccepted: true,
        strikes: 0,
      },
      {
        firstName: 'Anja',
        lastName: 'Kolar',
        username: 'anja_kolar',
        email: 'anja@mail.com',
        password: bcrypt.hashSync('password123', 12),
        role: 'user',
        status: 'active',
        birthday: new Date('1996-11-21'),
        profileImage: `${APP_URL}/uploads/users/default-avatar.png`,
        interests: ['kuhanje', 'gurmanska družba', 'vino'],
        availability: ['petek popoldne', 'sobota zvečer'],
        activeSearch: true,
        location: { lat: 46.0521, lng: 14.5012, radius: 9 },
        accountSecurity: { emailVerified: true },
        termsAccepted: true,
        strikes: 0,
      },
      {
        firstName: 'Filip',
        lastName: 'Furlan',
        username: 'filip_furlan',
        email: 'filip@mail.com',
        password: bcrypt.hashSync('password123', 12),
        role: 'user',
        status: 'active',
        birthday: new Date('1992-02-02'),
        profileImage: `${APP_URL}/uploads/users/default-avatar.png`,
        interests: ['plezanje', 'gorski tek', 'kampiranje'],
        availability: ['torek popoldne', 'sobota dopoldne'],
        activeSearch: true,
        location: { lat: 46.0589, lng: 14.4977, radius: 10 },
        accountSecurity: { emailVerified: true },
        termsAccepted: true,
        strikes: 0,
      },
    ]);
    console.log(`✅ ${users.length} users imported`);

    // Priročni aliasi
    const [
      admin, ana, marko, eva, tim, sara, luka, nika,
      miha, klara, urban, nina, gregor, kaja, nejc, maja,
      tjasa, vid, anja, filip
    ] = users;

    // ── 3. Meetings ──────────────────────────────────────────────────────────
    const meetings = await Meeting.insertMany([
      // --- UPCOMING ---
      {
        groupName: 'Sobotna jutranja kava',
        members: [
          { user: ana._id,   response: 'accepted', respondedAt: new Date('2026-04-20') },
          { user: marko._id, response: 'accepted', respondedAt: new Date('2026-04-21') },
          { user: sara._id,  response: 'accepted', respondedAt: new Date('2026-04-21') },
          { user: tim._id,   response: 'pending',  respondedAt: null },
        ],
        sharedInterests: ['kava', 'branje'],
        matchPercentage: 87,
        venue: {
          address: 'Trubarjeva ulica 5',
          city: 'Ljubljana',
          country: 'Slovenia',
          coordinates: { lat: 46.0527, lng: 14.5105 },
        },
        date: new Date('2026-05-20T10:00:00Z'),
        status: 'upcoming',
      },
      {
        groupName: 'Pohod Šmarna Gora',
        members: [
          { user: marko._id, response: 'accepted', respondedAt: new Date('2026-04-25') },
          { user: ana._id,   response: 'accepted', respondedAt: new Date('2026-04-25') },
          { user: luka._id,  response: 'pending',  respondedAt: null },
          { user: eva._id,   response: 'declined', respondedAt: new Date('2026-04-26') },
          { user: tim._id,   response: 'accepted', respondedAt: new Date('2026-04-27') },
        ],
        sharedInterests: ['pohodništvo', 'narava', 'fotografija'],
        matchPercentage: 92,
        venue: {
          address: 'Šmarna Gora, izhodišče Tacen',
          city: 'Ljubljana',
          country: 'Slovenia',
          coordinates: { lat: 46.1035, lng: 14.4700 },
        },
        date: new Date('2026-06-01T08:00:00Z'),
        status: 'upcoming',
      },
      {
        groupName: 'Board Games vikend',
        members: [
          { user: tim._id,   response: 'accepted', respondedAt: new Date('2026-04-28') },
          { user: eva._id,   response: 'accepted', respondedAt: new Date('2026-04-28') },
          { user: sara._id,  response: 'accepted', respondedAt: new Date('2026-04-29') },
        ],
        sharedInterests: ['board games', 'gaming'],
        matchPercentage: 95,
        venue: {
          address: 'Kongresni trg 1',
          city: 'Ljubljana',
          country: 'Slovenia',
          coordinates: { lat: 46.0500, lng: 14.5040 },
        },
        date: new Date('2026-05-25T15:00:00Z'),
        status: 'upcoming',
      },
      // --- COMPLETED ---
      {
        groupName: 'Joga v parku',
        members: [
          { user: sara._id,  response: 'accepted', respondedAt: new Date('2026-03-10') },
          { user: ana._id,   response: 'accepted', respondedAt: new Date('2026-03-10') },
          { user: eva._id,   response: 'accepted', respondedAt: new Date('2026-03-11') },
        ],
        sharedInterests: ['joga', 'narava', 'meditacija'],
        matchPercentage: 88,
        venue: {
          address: 'Tivoli, osrednji park',
          city: 'Ljubljana',
          country: 'Slovenia',
          coordinates: { lat: 46.0550, lng: 14.4960 },
        },
        date: new Date('2026-07-05T09:00:00Z'),
        status: 'completed',
      },
      {
        groupName: 'Filmski večer doma',
        members: [
          { user: eva._id,   response: 'accepted', respondedAt: new Date('2026-03-20') },
          { user: tim._id,   response: 'accepted', respondedAt: new Date('2026-03-20') },
          { user: marko._id, response: 'accepted', respondedAt: new Date('2026-03-21') },
          { user: luka._id,  response: 'declined', respondedAt: new Date('2026-03-22') },
        ],
        sharedInterests: ['filmi', 'glasba'],
        matchPercentage: 80,
        venue: {
          address: 'Čopova ulica 2',
          city: 'Ljubljana',
          country: 'Slovenia',
          coordinates: { lat: 46.0516, lng: 14.5063 },
        },
        date: new Date('2026-07-12T19:00:00Z'),
        status: 'completed',
      },
      // --- CANCELLED ---
      {
        groupName: 'Kolesarjenje ob Savi',
        members: [
          { user: marko._id, response: 'accepted', respondedAt: new Date('2026-03-15') },
          { user: luka._id,  response: 'accepted', respondedAt: new Date('2026-03-15') },
          { user: tim._id,   response: 'pending',  respondedAt: null },
        ],
        sharedInterests: ['kolesarjenje', 'tek'],
        matchPercentage: 78,
        venue: {
          address: 'Pot ob Savi',
          city: 'Ljubljana',
          country: 'Slovenia',
          coordinates: { lat: 46.0800, lng: 14.5200 },
        },
        date: new Date('2026-07-18T08:00:00Z'),
        status: 'cancelled',
      },
      // --- DRAFT ---
      {
        groupName: 'Umetnostni obisk',
        members: [
          { user: ana._id,   response: 'pending', respondedAt: null },
          { user: eva._id,   response: 'pending', respondedAt: null },
          { user: sara._id,  response: 'pending', respondedAt: null },
        ],
        sharedInterests: ['umetnost', 'fotografija'],
        matchPercentage: 72,
        venue: {
          address: 'Cankarjevo nabrežje 15',
          city: 'Ljubljana',
          country: 'Slovenia',
          coordinates: { lat: 46.0490, lng: 14.5059 },
        },
        date: new Date('2026-07-10T14:00:00Z'),
        status: 'draft',
      },
      {
        groupName: 'Muzejski popoldan',
        members: [
          { user: klara._id, response: 'accepted', respondedAt: new Date('2026-04-18') },
          { user: maja._id,  response: 'accepted', respondedAt: new Date('2026-04-18') },
          { user: ana._id,   response: 'pending',  respondedAt: null },
        ],
        sharedInterests: ['umetnost', 'muzeji', 'branje'],
        matchPercentage: 84,
        venue: {
          address: 'Prešernov trg 3',
          city: 'Ljubljana',
          country: 'Slovenia',
          coordinates: { lat: 46.0511, lng: 14.5069 },
        },
        date: new Date('2026-06-12T16:00:00Z'),
        status: 'upcoming',
      },
      {
        groupName: 'Kolesarski izlet Rožnik',
        members: [
          { user: miha._id, response: 'accepted', respondedAt: new Date('2026-04-22') },
          { user: vid._id,  response: 'accepted', respondedAt: new Date('2026-04-22') },
          { user: marko._id, response: 'accepted', respondedAt: new Date('2026-04-23') },
          { user: tim._id,  response: 'pending', respondedAt: null },
        ],
        sharedInterests: ['kolesarjenje', 'narava'],
        matchPercentage: 90,
        venue: {
          address: 'Tivolska cesta 50',
          city: 'Ljubljana',
          country: 'Slovenia',
          coordinates: { lat: 46.0572, lng: 14.4985 },
        },
        date: new Date('2026-06-20T09:00:00Z'),
        status: 'upcoming',
      },
      {
        groupName: 'Večer v živo',
        members: [
          { user: nina._id, response: 'accepted', respondedAt: new Date('2026-04-30') },
          { user: eva._id,  response: 'accepted', respondedAt: new Date('2026-04-30') },
          { user: kaja._id, response: 'accepted', respondedAt: new Date('2026-05-01') },
          { user: sara._id, response: 'declined', respondedAt: new Date('2026-05-01') },
        ],
        sharedInterests: ['glasba', 'koncerti', 'festival'],
        matchPercentage: 86,
        venue: {
          address: 'Kongresni trg 1',
          city: 'Ljubljana',
          country: 'Slovenia',
          coordinates: { lat: 46.0500, lng: 14.5040 },
        },
        date: new Date('2026-05-30T20:00:00Z'),
        status: 'upcoming',
      },
      {
        groupName: 'Plezanje v dvorani',
        members: [
          { user: filip._id, response: 'accepted', respondedAt: new Date('2026-03-12') },
          { user: luka._id,  response: 'accepted', respondedAt: new Date('2026-03-12') },
          { user: urban._id, response: 'accepted', respondedAt: new Date('2026-03-13') },
        ],
        sharedInterests: ['plezanje', 'fitnes'],
        matchPercentage: 79,
        venue: {
          address: 'Dunajska cesta 22',
          city: 'Ljubljana',
          country: 'Slovenia',
          coordinates: { lat: 46.0647, lng: 14.5060 },
        },
        date: new Date('2026-06-05T18:30:00Z'),
        status: 'completed',
      },
      {
        groupName: 'Jezikovni meetup',
        members: [
          { user: gregor._id, response: 'accepted', respondedAt: new Date('2026-04-12') },
          { user: ana._id,    response: 'accepted', respondedAt: new Date('2026-04-12') },
          { user: nejc._id,   response: 'pending',  respondedAt: null },
        ],
        sharedInterests: ['tuji jeziki', 'tehnologija'],
        matchPercentage: 76,
        venue: {
          address: 'Slovenska cesta 10',
          city: 'Ljubljana',
          country: 'Slovenia',
          coordinates: { lat: 46.0514, lng: 14.5072 },
        },
        date: new Date('2026-06-18T18:00:00Z'),
        status: 'draft',
      },
    ]);
    console.log(`✅ ${meetings.length} meetings imported`);

    // Prestavi completed/cancelled meetinge v preteklost (validator ob create zahteva prihodnost)
    for (const meeting of meetings) {
      if (!['completed', 'cancelled'].includes(meeting.status)) {
        continue;
      }

      const pastDate = new Date(Date.now() - randomInt(5, 45) * 24 * 60 * 60 * 1000);
      await Meeting.findByIdAndUpdate(meeting._id, { date: pastDate });
      meeting.date = pastDate;
    }

    const [
      kavaMeeting, pohodMeeting, boardGamesMeeting, jogaMeeting, filmMeeting,
      kolesarjenjeMeeting, umetnostMeeting, muzejMeeting, kolesarskiMeeting,
      koncertMeeting, plezanjeMeeting, jezikovniMeeting
    ] = meetings;

    // ── 4. Messages ──────────────────────────────────────────────────────────
    const messages = await Message.insertMany([
      // Kava meeting
      { meeting: kavaMeeting._id, user: ana._id,   message: 'Živjo vsi! Komaj čakam soboto ☕', timestamp: new Date('2026-05-15T18:00:00Z') },
      { meeting: kavaMeeting._id, user: marko._id, message: 'Jaz bom tam točno ob 10h!', timestamp: new Date('2026-05-15T18:30:00Z') },
      { meeting: kavaMeeting._id, user: sara._id,  message: 'Odlično, vidimo se kmalu 😊', timestamp: new Date('2026-05-16T09:00:00Z') },
      // Pohod meeting
      { meeting: pohodMeeting._id, user: marko._id, message: 'Kdo ima kaj pohodni opreme za posoditi?', timestamp: new Date('2026-05-28T10:00:00Z') },
      { meeting: pohodMeeting._id, user: ana._id,   message: 'Jaz imam ekstra palice 🏔️', timestamp: new Date('2026-05-28T10:15:00Z') },
      { meeting: pohodMeeting._id, user: tim._id,   message: 'Super, hvala! Se vidimo ob 8h na parkirišču.', timestamp: new Date('2026-05-28T11:00:00Z') },
      // Board games meeting
      { meeting: boardGamesMeeting._id, user: tim._id,  message: 'Prinesel bom Catan in Ticket to Ride 🎲', timestamp: new Date('2026-05-22T20:00:00Z') },
      { meeting: boardGamesMeeting._id, user: eva._id,  message: 'Odlično! Jaz prinesem Dixit.', timestamp: new Date('2026-05-22T20:30:00Z') },
      { meeting: boardGamesMeeting._id, user: sara._id, message: 'Jaz bom prinesla prigrizke 🍿', timestamp: new Date('2026-05-22T21:00:00Z') },
      // Completed joga meeting — retrospektiva
      { meeting: jogaMeeting._id, user: sara._id, message: 'To je bilo čudovito srečanje, hvala vsem! 🧘', timestamp: new Date('2026-04-05T11:30:00Z') },
      { meeting: jogaMeeting._id, user: ana._id,  message: 'Absolutno, naslednjič gremo dlje!', timestamp: new Date('2026-04-05T12:00:00Z') },
      // Muzej meeting
      { meeting: muzejMeeting._id, user: klara._id, message: 'Predlagam, da se dobimo pred vhodom ob 16h.', timestamp: new Date('2026-06-10T12:00:00Z') },
      { meeting: muzejMeeting._id, user: maja._id,  message: 'Se strinjam, pridem malo prej.', timestamp: new Date('2026-06-10T12:10:00Z') },
      // Kolesarski meeting
      { meeting: kolesarskiMeeting._id, user: miha._id, message: 'Prinesem rezervno zračnico, za vsak primer.', timestamp: new Date('2026-06-18T08:30:00Z') },
      { meeting: kolesarskiMeeting._id, user: vid._id,  message: 'Super, jaz imam orodje.', timestamp: new Date('2026-06-18T08:45:00Z') },
      // Koncert meeting
      { meeting: koncertMeeting._id, user: nina._id, message: 'Komaj čakam koncert, bo top!', timestamp: new Date('2026-05-28T19:00:00Z') },
      { meeting: koncertMeeting._id, user: kaja._id, message: 'Se vidimo pred dvorano.', timestamp: new Date('2026-05-28T19:10:00Z') },
      // Plezanje meeting
      { meeting: plezanjeMeeting._id, user: filip._id, message: 'Kdo ima plezalke za posodit?', timestamp: new Date('2026-03-09T17:00:00Z') },
      { meeting: plezanjeMeeting._id, user: urban._id, message: 'Jaz imam en par velikost 42.', timestamp: new Date('2026-03-09T17:05:00Z') },
    ]);
    console.log(`✅ ${messages.length} messages imported`);

    // ── 5. Ratings (za completed meetinge) ───────────────────────────────────
    const ratings = await Rating.insertMany([
      // Joga meeting ratings
      {
        user: sara._id, meeting: jogaMeeting._id,
        username: sara.username, groupName: jogaMeeting.groupName,
        rating: 5, comment: 'Čudovito vzdušje, super ekipa! Definitivno ponovi.',
      },
      {
        user: ana._id, meeting: jogaMeeting._id,
        username: ana.username, groupName: jogaMeeting.groupName,
        rating: 5, comment: 'Idealna lokacija in prijazni udeleženci.',
      },
      {
        user: eva._id, meeting: jogaMeeting._id,
        username: eva.username, groupName: jogaMeeting.groupName,
        rating: 4, comment: 'Zelo prijetno, malo hladno zjutraj ampak vredu 🙂',
      },
      // Film meeting ratings
      {
        user: eva._id, meeting: filmMeeting._id,
        username: eva.username, groupName: filmMeeting.groupName,
        rating: 4, comment: 'Super izbor filmov, prijetna druščina.',
      },
      {
        user: tim._id, meeting: filmMeeting._id,
        username: tim.username, groupName: filmMeeting.groupName,
        rating: 3, comment: 'Brez komentarja',
      },
      {
        user: marko._id, meeting: filmMeeting._id,
        username: marko.username, groupName: filmMeeting.groupName,
        rating: 4, comment: 'Prijetno srečanje, dobra energija v skupini.',
      },
      // Plezanje meeting ratings
      {
        user: filip._id, meeting: plezanjeMeeting._id,
        username: filip.username, groupName: plezanjeMeeting.groupName,
        rating: 5, comment: 'Super ekipa, odlična energija in varno plezanje.',
      },
      {
        user: urban._id, meeting: plezanjeMeeting._id,
        username: urban.username, groupName: plezanjeMeeting.groupName,
        rating: 4, comment: 'Fajn družba, naslednjič spet.',
      },
    ]);
    console.log(`✅ ${ratings.length} ratings imported`);

    // ── 6. Reports ───────────────────────────────────────────────────────────
    const reports = await Report.insertMany([
      {
        reporter: ana._id,
        reportedUser: nika._id,
        meeting: kavaMeeting._id,
        description: 'Uporabnica je med srečanjem večkrat brez razloga prekinila druge in bila nespoštljiva do udeležencev.',
        status: 'in-review',
      },
      {
        reporter: marko._id,
        reportedUser: eva._id,
        meeting: pohodMeeting._id,
        description: 'Udeleženka se je prijavila na pohod, a brez obvestila ni prišla, kar je motilo organizacijo.',
        status: 'new',
      },
      {
        reporter: sara._id,
        reportedUser: luka._id,
        meeting: boardGamesMeeting._id,
        description: 'Udeleženec je med srečanjem delil neprimerne komentarje in s tem vznemirjal skupino.',
        status: 'resolved',
      },
      {
        reporter: kaja._id,
        reportedUser: tim._id,
        meeting: koncertMeeting._id,
        description: 'Udeleženec je prišel precej pozno brez obvestila, kar je otežilo usklajevanje.',
        status: 'new',
      },
      {
        reporter: miha._id,
        reportedUser: marko._id,
        meeting: kolesarskiMeeting._id,
        description: 'Med srečanjem je bilo nekaj nesporazumov glede tempa, prosim za boljšo komunikacijo.',
        status: 'in-review',
      },
    ]);
    console.log(`✅ ${reports.length} reports imported`);

    // ── 7. Contacts ──────────────────────────────────────────────────────────
    const contacts = await Contact.insertMany([
      {
        user: ana._id,
        name: 'Ana',
        lastName: 'Novak',
        email: 'ana@mail.com',
        subject: 'Splošno vprašanje',
        message: 'Zanima me, kako deluje sistem ujemanja za srečanja. Ali je popolnoma avtomatiziran?',
        status: 'resolved',
        createdAt: new Date('2026-04-01T10:00:00Z'),
      },
      {
        name: 'Neznani',
        lastName: 'Uporabnik',
        email: 'neznani@mail.com',
        subject: 'Težave z registracijo',
        message: 'Imam težave z registracijo računa. Potrditveni email ne prihaja.',
        status: 'in-progress',
        createdAt: new Date('2026-04-15T14:30:00Z'),
      },
      {
        user: tim._id,
        name: 'Tim',
        lastName: 'Horvat',
        email: 'tim@mail.com',
        subject: 'Drugo',
        message: 'Predlagam, da dodate možnost filtriranja po interesih pri iskanju srečanj.',
        status: 'new',
        createdAt: new Date('2026-04-28T09:00:00Z'),
      },
      {
        name: 'Petra',
        lastName: 'Vidmar',
        email: 'petra@mail.com',
        subject: 'Težave s prijavo',
        message: 'Ne morem se prijaviti. Geslo sem pozabila in ponastavitev ne deluje.',
        status: 'new',
        createdAt: new Date('2026-05-01T11:00:00Z'),
      },
      {
        user: gregor._id,
        name: 'Gregor',
        lastName: 'Korošec',
        email: 'gregor@mail.com',
        subject: 'Predlog izboljšave',
        message: 'Super aplikacija, predlagam še filtre po razpoložljivosti.',
        status: 'new',
        createdAt: new Date('2026-05-03T09:15:00Z'),
      },
      {
        user: klara._id,
        name: 'Klara',
        lastName: 'Kranjc',
        email: 'klara@mail.com',
        subject: 'Splošno vprašanje',
        message: 'Ali lahko urejam interese tudi po registraciji?',
        status: 'resolved',
        createdAt: new Date('2026-04-22T13:40:00Z'),
      },
      {
        name: 'Neznana',
        lastName: 'Uporabnica',
        email: 'help@mail.com',
        subject: 'Težave z registracijo',
        message: 'Pri registraciji dobim napako, ali je sistem trenutno nedosegljiv?',
        status: 'in-progress',
        createdAt: new Date('2026-05-06T16:05:00Z'),
      },
    ]);
    console.log(`✅ ${contacts.length} contacts imported`);

    // ── 8. Analytics ─────────────────────────────────────────────────────────
    const analytics = await Analytics.insertMany([
      // Cumulative
      {
        date: new Date(),
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'active').length,
        totalMeetings: meetings.length,
        activeMeetings: meetings.filter(m => m.status === 'upcoming').length,
        timeframe: 'cumulative',
      },
      // Mesečni — zadnji 3 meseci (poenostavitev za hardcoded)
      {
        date: new Date(2026, 1, 1), // Februar
        totalUsers: 3,
        activeUsers: 2,
        totalMeetings: 1,
        activeMeetings: 1,
        timeframe: 'monthly',
      },
      {
        date: new Date(2026, 2, 1), // Marec
        totalUsers: 6,
        activeUsers: 5,
        totalMeetings: 3,
        activeMeetings: 2,
        timeframe: 'monthly',
      },
      {
        date: new Date(2026, 3, 1), // April
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'active').length,
        totalMeetings: meetings.length,
        activeMeetings: meetings.filter(m => m.status === 'upcoming').length,
        timeframe: 'monthly',
      },
    ]);
    console.log(`✅ ${analytics.length} analytics records imported`);

    console.log('🎉 Hardcoded seed data imported successfully!');

    res.status(201).json({
      success: true,
      message: 'Hardcoded seed podatki uspešno uvoženi!',
      counts: {
        users: users.length,
        meetings: meetings.length,
        messages: messages.length,
        ratings: ratings.length,
        reports: reports.length,
        contacts: contacts.length,
        analytics: analytics.length,
      },
    });
  } catch (err) {
    console.error('❌ Hardcoded seed import error:', err);
    res.status(500).json({
      success: false,
      message: 'Hardcoded seed import failed',
      error: err.message,
    });
  }
};

export default {
  importHardcodedData,
};