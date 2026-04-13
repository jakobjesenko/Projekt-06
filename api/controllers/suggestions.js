import User from "../models/users.js";

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

const generateSuggestions = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.activeSearch) {
      return res.status(200).json([]);
    }
    
    const userInterests = user.interests.map(i => i.name);
    if (userInterests.length < 2) {
      return res.status(200).json([]);
    }
    
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
    
    const suggestions = groupTemplates.filter(template =>
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
    });
    
    res.status(200).json(suggestions.slice(0, 3));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default { generateSuggestions };