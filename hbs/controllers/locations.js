// controllers/locations.js
import User from "../../api/models/users.js";
import Meeting from "../../api/models/meetings.js";
import ConfirmedMeeting from "../../api/models/meetings.js";
import Rating from "../../api/models/ratings.js";

const interestsMaster = [
  { id: 1, name: "Kava", icon: "fa-mug-hot" },
  { id: 2, name: "Pohodništvo", icon: "fa-hiking" },
  { id: 3, name: "Družabne igre", icon: "fa-chess-board" },
  { id: 4, name: "Kino", icon: "fa-film" },
  { id: 5, name: "Šport", icon: "fa-futbol" },
  { id: 6, name: "Glasba", icon: "fa-music" },
  { id: 7, name: "Umetnost", icon: "fa-palette" },
  { id: 8, name: "Tehnologija", icon: "fa-laptop-code" },
  { id: 9, name: "Potovanja", icon: "fa-plane" },
  { id: 10, name: "Kulinarika", icon: "fa-utensils" },
  { id: 11, name: "Fotografija", icon: "fa-camera" },
  { id: 12, name: "Joga", icon: "fa-spa" }
];

const timeOptions = [
  "Delavniki zvečer (18-22h)",
  "Vikendi dopoldne",
  "Vikendi popoldne",
  "Kadarkoli"
];

const list = (req, res) => {
  const user = req.session?.user || null;
  const admin = req.session?.admin || null;
  
  res.render("index", { 
    title: "Srečajmo se",
    user: user,
    admin: admin,
    interestsMaster: interestsMaster,
    timeOptions: timeOptions,
    view: "hero"
  });
};

const login = (req, res) => {
  res.render("index", { 
    title: "Prijava - Srečajmo se",
    user: req.session?.user || null,
    admin: req.session?.admin || null,
    view: "login"
  });
};

const register = (req, res) => {
  res.render("index", { 
    title: "Registracija - Srečajmo se",
    user: req.session?.user || null,
    admin: req.session?.admin || null,
    interestsMaster: interestsMaster,
    timeOptions: timeOptions,
    weekdays: ["Pon", "Tor", "Sre", "Čet", "Pet", "Sob", "Ned"],
    dayPartsWithTimes: [
      { key: "jutro", label: "Zjutraj", range: "6:00 - 9:00" },
      { key: "dopoldan", label: "Dopoldan", range: "9:00 - 12:00" },
      { key: "popoldan", label: "Popoldan", range: "12:00 - 19:00" },
      { key: "zvecer", label: "Zvečer", range: "19:00 - 00:00" }
    ],
    view: "register"
  });
};

const dashboard = async (req, res) => {
  const user = req.session?.user;
  
  if (!user) {
    return res.redirect("/login");
  }
  
  const dbUser = await User.findById(user._id);
  
  if (!dbUser) {
    req.session.destroy();
    return res.redirect("/login");
  }
  
  const meetings = await Meeting.find({ members: dbUser.username });
  const confirmedMeetings = await ConfirmedMeeting.find({ userId: dbUser._id });
  const suggestions = generateSuggestions(dbUser);
  
  // Dodaj starost za prikaz
  const userWithAge = {
    ...dbUser.toObject(),
    age: dbUser.getAge()
  };
  
  res.render("index", { 
    title: "Nadzorna plošča - Srečajmo se",
    user: userWithAge,
    admin: req.session?.admin || null,
    meetings: meetings,
    confirmedMeetings: confirmedMeetings,
    suggestions: suggestions,
    weekdays: ["Pon", "Tor", "Sre", "Čet", "Pet", "Sob", "Ned"],
    view: "dashboard"
  });
};

const editProfile = async (req, res) => {
  const user = req.session?.user;
  if (!user) return res.redirect("/login");
  
  res.render("index", { 
    title: "Uredi profil - Srečajmo se",
    user: user,
    admin: req.session?.admin || null,
    interestsMaster: interestsMaster,
    timeOptions: timeOptions,
    weekdays: ["Pon", "Tor", "Sre", "Čet", "Pet", "Sob", "Ned"],
    dayParts: ["dopoldan", "popoldan", "zvečer"],
    view: "editProfile"
  });
};
const adminPanel = async (req, res) => {
  const admin = req.session?.admin;
  
  if (!admin) {
    return res.redirect("/login");
  }
  
  const users = await User.find({ isAdmin: false });
  const meetings = await Meeting.find();
  const ratings = await Rating.find();
  
  const stats = {
    totalUsers: users.length,
    totalMeetings: meetings.length,
    avgRating: ratings.length > 0 
      ? (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1)
      : 0,
    activeSearches: users.filter(u => u.activeSearch).length
  };
  
  res.render("index", { 
    title: "Admin panel - Srečajmo se",
    user: null,
    admin: admin,
    users: users,
    meetings: meetings,
    ratings: ratings,
    stats: stats,
    view: "admin"
  });
};

const forgotPassword = (req, res) => {
  res.render("index", { 
    title: "Pozabljeno geslo - Srečajmo se",
    user: req.session?.user || null,
    admin: req.session?.admin || null,
    view: "forgotPassword"
  });
};

function generateSuggestions(user) {
  if (!user.activeSearch || !user.interests || user.interests.length < 2) {
    return [];
  }
  
  const userInterests = user.interests.map(i => i.name);
  
  const groupTemplates = [
    { name: "Kavoljubci", interests: ["Kava", "Družabne igre", "Kulinarika"], time: "četrtek, 18:00", location: "Center Ljubljana" },
    { name: "Pohodniki", interests: ["Pohodništvo", "Šport", "Potovanja"], time: "sobota, 10:00", location: "Rožnik" },
    { name: "Filmofili", interests: ["Kino", "Glasba", "Umetnost"], time: "petek, 19:30", location: "Kinodvor" },
    { name: "Tehno ekipa", interests: ["Tehnologija", "Družabne igre", "Kava"], time: "sreda, 17:00", location: "Šiška" }
  ];
  
  const namePool = ["Nina", "Tilen", "Luka", "Maja", "Žan", "Eva", "Nejc", "Sara", "Jan", "Petra"];
  const shuffled = [...namePool].sort(() => 0.5 - Math.random());
  const randomMembers = shuffled.slice(0, 3);
  if (!randomMembers.includes(user.username) && user.username) {
    randomMembers[0] = user.username;
  }
  
  return groupTemplates.filter(template =>
    template.interests.some(i => userInterests.includes(i))
  ).map((template, idx) => {
    const commonInterests = template.interests.filter(i => userInterests.includes(i));
    const matchScore = Math.min(95, 60 + (commonInterests.length * 15));
    return {
      id: Date.now() + idx,
      name: template.name,
      members: randomMembers,
      interests: commonInterests,
      time: template.time,
      location: template.location,
      matchScore: matchScore
    };
  }).slice(0, 3);
}

export default {
  list,
  login,
  register,
  dashboard,
  editProfile,
  adminPanel,
  forgotPassword
};