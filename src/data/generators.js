import { randomInt, pick, pickMany, randomDate } from '../api/utils/random.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

let APP_URL;
if (process.env.NODE_ENV === 'production') {
  APP_URL = process.env.PROD_APP_URL || 'https://';
} else {
  APP_URL = process.env.APP_URL || 'http://localhost:3000';
}

// ─── Sample data pools ────────────────────────────────────────────────────────

const sampleFirst = ['Ana', 'Marko', 'Eva', 'Tim', 'Sara', 'Nika', 'Jan', 'Luka', 'Tina', 'Maja', 'Rok', 'Petra', 'Žan', 'Lea', 'Bor'];
const sampleLast  = ['Novak', 'Kovač', 'Zupan', 'Potočnik', 'Horvat', 'Zajc', 'Kralj', 'Vidmar', 'Mlakar', 'Černe'];

const sampleInterests = [
  'kava', 'pohodništvo', 'branje', 'glasba', 'fotografija',
  'kuhanje', 'joga', 'kolesarjenje', 'filmi', 'potovanja',
  'šah', 'board games', 'tek', 'fitnes', 'umetnost',
  'gaming', 'narava', 'ples', 'tuji jeziki', 'meditacija',
];

const sampleAvailability = ['ponedeljek zjutraj', 'ponedeljek zvečer', 'torek zjutraj', 'torek zvečer', 'sreda zjutraj', 'sreda zvečer', 'četrtek zjutraj', 'četrtek zvečer', 'petek zvečer', 'sobota dopoldne', 'sobota popoldne', 'sobota zvečer', 'nedelja dopoldne', 'nedelja popoldne'];

const sampleGroupNames = [
  'Sobotni pohodniki Ljubljana',
  'Jutranja kava ekipa',
  'Board games vikend',
  'Knjižni klub sreda',
  'Fotografi Tivoli',
  'Urbani kolesarji',
  'Jezikovni kotiček',
  'Narava & meditacija',
  'Filmski večer',
  'Tech & kava',
  'Tek ob Savi',
  'Kreativni četrtek',
  'Kulinarični klub',
  'Večerni šahisti',
  'Mestni sprehajalci',
];

const sampleVenues = [
  { address: 'Slovenska cesta 10', city: 'Ljubljana', lat: 46.0514, lng: 14.5072 },
  { address: 'Trubarjeva ulica 5', city: 'Ljubljana', lat: 46.0527, lng: 14.5105 },
  { address: 'Kongresni trg 1', city: 'Ljubljana', lat: 46.0500, lng: 14.5040 },
  { address: 'Prešernov trg 3', city: 'Ljubljana', lat: 46.0511, lng: 14.5069 },
  { address: 'Cankarjevo nabrežje 15', city: 'Ljubljana', lat: 46.0490, lng: 14.5059 },
  { address: 'Čopova ulica 2', city: 'Ljubljana', lat: 46.0516, lng: 14.5063 },
  { address: 'Mestni trg 26', city: 'Ljubljana', lat: 46.0490, lng: 14.5073 },
  { address: 'Gosposvetska cesta 8', city: 'Maribor', lat: 46.5547, lng: 15.6459 },
  { address: 'Glavni trg 7', city: 'Maribor', lat: 46.5570, lng: 15.6461 },
  { address: 'Krekov trg 1', city: 'Celje', lat: 46.2314, lng: 15.2615 },
];

const sampleComments = [
  'Super srecanje, dobra energija v skupini!',
  'Zelo prijetno, definitivno bi šel/šla znova.',
  'Udobno vzdušje, takoj sem se počutil/a dobrodošlega/o.',
  'Zanimivi sogovorniki, čas je letel.',
  'Malo neroden začetek, ampak na koncu super.',
  'Skupne teme so bile odlične za pogovor.',
  'Zelo organizirano in prijetno.',
  'Malo premalo časa za prave pogovore.',
  'Brez komentarja',
  'Odlična lokacija, priporočam vsem!',
];

const sampleReportDescriptions = [
  'Uporabnik je med srečanjem večkrat uporabil žaljiv jezik in s tem vznemirjal ostale udeležence.',
  'Udeleženec se ni prijavil na srečanje, a se je vseeno pojavil in motil skupino.',
  'Oseba je delila neprimerne vsebine v skupinskem klepetu.',
  'Udeleženec je med srečanjem fotografiral druge brez dovoljenja.',
  'Prijavljena oseba se je obnašala agresivno in ustrahovala druge člane skupine.',
  'Udeleženec je lažno prikazal svoje interese in cilje na profilu.',
  'Med srečanjem je prišlo do neprimernih komentarjev na osebni račun.',
  'Oseba se kljub opominom ni udeležila že tretjega zaporednega srečanja, na katero se je prijavila.',
];

const sampleContactSubjects = [
  'Težave z registracijo',
  'Težave s prijavo',
  'Splošno vprašanje',
  'Drugo',
];

const sampleContactMessages = [
  'Imam težave z registracijo. Prosim za pomoč.',
  'Ne morem se prijaviti v svoj račun, geslo ne deluje.',
  'Kako deluje sistem ujemanja za srečanja?',
  'Kdaj bo naslednje srečanje v moji regiji?',
  'Zanima me, kako uredim profil in interese.',
  'Ali je aplikacija dostopna tudi za tujce?',
  'Kako se odjavim od obvestil?',
  'Prosim za pomoč pri spremembi e-pošte.',
];

// ─── Generators ───────────────────────────────────────────────────────────────

/**
 * Generate random users
 */
export const generateUsers = (count = 20) => {
  return Array.from({ length: count }).map((_, i) => {
    const firstName = pick(sampleFirst);
    const lastName  = pick(sampleLast);
    const interests = pickMany(sampleInterests, randomInt(3, 8));
    const availability = pickMany(sampleAvailability, randomInt(2, 5));

    return {
      email: `user${i}@mail.com`,
      username: `user_${i}`,
      password: bcrypt.hashSync('password123', 12),
      firstName,
      lastName,
      role: 'user',
      status: pick(['active', 'active', 'active', 'pending']), // 75% active
      profileImage: `${APP_URL}/uploads/users/default-avatar.png`,
      birthday: new Date(
        randomInt(1975, 2003),
        randomInt(0, 11),
        randomInt(1, 28)
      ),
      location: {
        lat: 46.0569 + (Math.random() - 0.5) * 1.0,
        lng: 14.5058 + (Math.random() - 0.5) * 1.5,
        radius: pick([5, 10, 15, 20]),
      },
      interests,
      availability,
      activeSearch: Math.random() > 0.4, // 60% aktivno išče
      isActive: true,
      strikes: pick([0, 0, 0, 0, 1, 2]), // večina brez strikes
      accountSecurity: {
        emailVerified: true,
      },
      termsAccepted: true,
    };
  });
};

/**
 * Generate meetings from a pool of users.
 * Vrne array meetingov — vsak z 3–5 člani (iz users).
 */
export const generateMeetings = (users, count = 20) => {
  const meetings = [];

  for (let i = 0; i < count; i++) {
    const memberCount = randomInt(3, 5);
    // Naključno izberi userje (brez ponavljanja)
    const shuffled = [...users].sort(() => 0.5 - Math.random());
    const selectedUsers = shuffled.slice(0, memberCount);

    const members = selectedUsers.map((u, idx) => {
      const response = idx === 0
        ? 'accepted' // prvi je vedno organizator → accepted
        : pick(['pending', 'accepted', 'accepted', 'declined']);
      return {
        user: u._id,
        response,
        respondedAt: response !== 'pending' ? new Date(Date.now() - randomInt(1, 10) * 24 * 60 * 60 * 1000) : null,
      };
    });

    // Skupni interesi — presek interesov članov (poenostavitev: naključni vzorec)
    const allInterests = selectedUsers.flatMap(u => u.interests || []);
    const uniqueInterests = [...new Set(allInterests)];
    const sharedInterests = pickMany(uniqueInterests, Math.min(randomInt(1, 4), uniqueInterests.length));

    const venue = pick(sampleVenues);

    // Status: večina upcoming, nekaj completed/cancelled
    const statusPool = ['upcoming', 'upcoming', 'upcoming', 'completed', 'completed', 'cancelled', 'draft'];
    const status = pick(statusPool);

    // Datum mora biti ob kreiranju v prihodnosti (validator v shemi)
    const meetingDate = new Date(Date.now() + randomInt(1, 90) * 24 * 60 * 60 * 1000);

    meetings.push({
      groupName: pick(sampleGroupNames) + ` ${i + 1}`,
      members,
      sharedInterests,
      matchPercentage: randomInt(55, 98),
      venue: {
        address: venue.address,
        city: venue.city,
        country: 'Slovenia',
        coordinates: {
          lat: venue.lat + (Math.random() - 0.5) * 0.01,
          lng: venue.lng + (Math.random() - 0.5) * 0.01,
        },
      },
      date: meetingDate,
      status,
    });
  }

  return meetings;
};

/**
 * Generate ratings for completed meetings.
 */
export const generateRatings = (users, meetings) => {
  const ratings = [];
  const seen = new Set(); // user+meeting kombinacije (unique index v shemi)

  const completedMeetings = meetings.filter(m => m.status === 'completed');

  for (const meeting of completedMeetings) {
    // Vsak accepted member odda oceno
    for (const member of meeting.members) {
      if (member.response !== 'accepted') continue;

      const key = `${member.user}-${meeting._id}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const user = users.find(u => u._id.toString() === member.user.toString());
      if (!user) continue;

      ratings.push({
        user: member.user,
        meeting: meeting._id,
        username: user.username,
        groupName: meeting.groupName,
        rating: randomInt(1, 5),
        comment: pick(sampleComments),
      });
    }
  }

  return ratings;
};

/**
 * Generate messages for upcoming/completed meetings.
 */
export const generateMessages = (users, meetings, count = 80) => {
  const validMeetings = meetings.filter(m => ['upcoming', 'completed'].includes(m.status));
  if (validMeetings.length === 0) return [];

  return Array.from({ length: count }).map(() => {
    const meeting = pick(validMeetings);
    // Pošiljatelj mora biti član meetinga
    const member = pick(meeting.members);
    const user = users.find(u => u._id.toString() === member.user.toString()) || pick(users);

    const msgPool = [
      'Kdaj se natančno dobimo?',
      'Kakšna je točna lokacija?',
      'Komaj čakam! 😊',
      'Ali je prosto parkiranje v bližini?',
      'Bom malo zamudil/a, opravičujem se.',
      'Katero kavo priporočate tam?',
      'Super skupina, lepo spoznati vas vse!',
      'Se strinjam z dogovorjenim terminom.',
      'Ali je lokacija dostopna z javnim prevozom?',
      'Živjo, jaz sem nova/novi, veselim se srečanja!',
      'Predlagam, da naslednjič gremo na pohod skupaj.',
      'Hvala za organizacijo! 🙏',
    ];

    return {
      meeting: meeting._id,
      user: user._id,
      message: pick(msgPool),
      timestamp: new Date(Date.now() - randomInt(0, 20) * 24 * 60 * 60 * 1000),
    };
  });
};

/**
 * Generate reports between users in meetings.
 */
export const generateReports = (users, meetings, count = 8) => {
  const reports = [];
  const validMeetings = meetings.filter(m => m.members.length >= 2);

  for (let i = 0; i < count; i++) {
    const meeting = pick(validMeetings);
    const [reporterMember, reportedMember] = [...meeting.members]
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const reporter = users.find(u => u._id.toString() === reporterMember.user.toString());
    const reportedUser = users.find(u => u._id.toString() === reportedMember.user.toString());

    if (!reporter || !reportedUser) continue;

    reports.push({
      reporter: reporter._id,
      reportedUser: reportedUser._id,
      meeting: meeting._id,
      description: pick(sampleReportDescriptions),
      status: pick(['new', 'new', 'in-review', 'resolved', 'rejected']),
    });
  }

  return reports;
};

/**
 * Generate contact form submissions.
 */
export const generateContacts = (count = 10) => {
  return Array.from({ length: count }).map((_, i) => ({
    name: pick(sampleFirst),
    lastName: pick(sampleLast),
    email: `contact${i}@mail.com`,
    subject: pick(sampleContactSubjects),
    message: pick(sampleContactMessages),
    status: pick(['new', 'new', 'in-progress', 'resolved']),
    createdAt: new Date(Date.now() - randomInt(0, 60) * 24 * 60 * 60 * 1000),
  }));
};

/**
 * Generate analytics records (cumulative + monthly).
 */
export const generateAnalytics = (totalUserCount, totalMeetingCount) => {
  const records = [];

  // 1. Cumulative
  records.push({
    date: new Date(),
    totalUsers: totalUserCount,
    activeUsers: Math.floor(totalUserCount * 0.65),
    totalMeetings: totalMeetingCount,
    activeMeetings: Math.floor(totalMeetingCount * 0.4),
    timeframe: 'cumulative',
  });

  // 2. Monthly — zadnjih 12 mesecev
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);

    records.push({
      date: monthDate,
      totalUsers: randomInt(Math.floor(totalUserCount * 0.3), totalUserCount),
      activeUsers: randomInt(5, Math.floor(totalUserCount * 0.5)),
      totalMeetings: randomInt(Math.floor(totalMeetingCount * 0.2), totalMeetingCount),
      activeMeetings: randomInt(1, Math.floor(totalMeetingCount * 0.3)),
      timeframe: 'monthly',
    });
  }

  return records;
};