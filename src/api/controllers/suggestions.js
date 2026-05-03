import User from "../models/users.js";
import Meeting from "../models/meetings.js";

// ─── Konfiguracija algoritma ─────────────────────────────────────────────
// score = w1*similarity_interesov + w2*blizina_geografska + w3*prekrivanje_casa
const W_INTERESTS = 0.5;
const W_GEO = 0.2;
const W_TIME = 0.3;

const GROUP_SIZE = 3;            // ciljna velikost skupine (vključno s trenutnim uporabnikom)
const MIN_GROUP_SIZE = 2;        // minimalna velikost (user + vsaj 1 partner) — fallback če ni dovolj kandidatov
const MAX_GROUPS = 3;            // koliko predlogov skupin vrnemo
const CANDIDATE_POOL_SIZE = 12;  // top-N kandidatov, iz katerih sestavljamo skupine
const MIN_SCORE = 0.05;          // pod tem score ne predlagamo

// ─── Pomožne funkcije ────────────────────────────────────────────────────

// Jaccard koeficient nad množicama (vrača vrednost na intervalu [0,1])
const jaccard = (a = [], b = []) => {
  const setA = new Set(a);
  const setB = new Set(b);
  if (setA.size === 0 && setB.size === 0) return 0;

  let intersection = 0;
  for (const x of setA) {
    if (setB.has(x)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
};

// Presek dveh seznamov (ohrani vrstni red iz a, brez duplikatov)
const intersect = (a = [], b = []) => {
  const setB = new Set(b);
  const seen = new Set();
  const out = [];
  for (const x of a) {
    if (setB.has(x) && !seen.has(x)) {
      seen.add(x);
      out.push(x);
    }
  }
  return out;
};

// Haversine: razdalja med dvema (lat, lng) v km
const haversine = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
};

// Geografska podobnost: 1 = enaka lokacija, 0 = izven dosega
// "domet" = vsota radijev obeh uporabnikov (če sta oba pripravljena potovati 5 km, je skupaj 10 km OK)
const geoSimilarity = (locA, locB) => {
  if (
    !locA || !locB ||
    locA.lat == null || locA.lng == null ||
    locB.lat == null || locB.lng == null
  ) {
    return 0;
  }

  const distance = haversine(locA.lat, locA.lng, locB.lat, locB.lng);
  const maxDistance = (locA.radius || 5) + (locB.radius || 5);

  if (maxDistance === 0) return distance === 0 ? 1 : 0;
  return Math.max(0, 1 - distance / maxDistance);
};

// Normalizacija interesov: lahko so stringi ali objekti {name}
const extractInterests = (interests = []) =>
  interests
    .map((i) => (typeof i === "string" ? i : i?.name))
    .filter(Boolean);

// Glavna metrika ujemanja med dvema uporabnikoma
const computePairScore = (userA, userB) => {
  const interestsA = extractInterests(userA.interests);
  const interestsB = extractInterests(userB.interests);

  const sInterests = jaccard(interestsA, interestsB);
  const sGeo = geoSimilarity(userA.location, userB.location);
  const sTime = jaccard(userA.availability || [], userB.availability || []);

  const score =
    W_INTERESTS * sInterests + W_GEO * sGeo + W_TIME * sTime;

  return {
    score,
    components: { sInterests, sGeo, sTime },
    commonInterests: intersect(interestsA, interestsB),
    commonAvailability: intersect(userA.availability || [], userB.availability || []),
  };
};

// Povprečje pairwise score-ov v skupini (uporabnik + n drugih)
const groupAverageScore = (members) => {
  if (members.length < 2) return 0;
  let sum = 0;
  let pairs = 0;
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      sum += computePairScore(members[i], members[j]).score;
      pairs++;
    }
  }
  return pairs === 0 ? 0 : sum / pairs;
};

// Presek interesov in razpoložljivosti čez vse člane skupine
const intersectAll = (members, key) => {
  if (members.length === 0) return [];
  let acc = key === "interests"
    ? extractInterests(members[0].interests)
    : (members[0].availability || []);

  for (let i = 1; i < members.length; i++) {
    const next = key === "interests"
      ? extractInterests(members[i].interests)
      : (members[i].availability || []);
    acc = intersect(acc, next);
  }
  return acc;
};

// Slot v obliki "Pon__morning" → uporabniku prijazen niz
const formatSlot = (slot) => {
  const dayMap = {
    Pon: "ponedeljek", Tor: "torek", Sre: "sreda",
    "Čet": "četrtek", Pet: "petek", Sob: "sobota", Ned: "nedelja",
  };
  const partMap = {
    morning: "dopoldne (6:00–12:00)",
    afternoon: "popoldne (12:00–18:00)",
    evening: "zvečer (18:00–24:00)",
  };
  const [day, part] = (slot || "").split("__");
  if (!day || !part) return slot || "";
  return `${dayMap[day] || day}, ${partMap[part] || part}`;
};

// Naredi ime skupine iz skupnih interesov
const makeGroupName = (commonInterests) => {
  if (commonInterests.length === 0) return "Nova skupina";
  if (commonInterests.length === 1) return `Ljubitelji – ${commonInterests[0]}`;
  return commonInterests.slice(0, 2).join(" & ");
};

// Centroid (povprečna lokacija) članov, ki imajo nastavljeno lokacijo
const centroid = (members) => {
  const valid = members.filter(
    (m) => m.location && m.location.lat != null && m.location.lng != null,
  );
  if (valid.length === 0) return null;

  const lat =
    valid.reduce((s, m) => s + m.location.lat, 0) / valid.length;
  const lng =
    valid.reduce((s, m) => s + m.location.lng, 0) / valid.length;

  return { lat, lng };
};

// Format opisa lokacije (centroid + povprečna razdalja od trenutnega uporabnika)
const formatLocation = (currentUser, members) => {
  const c = centroid(members);
  if (!c) return "Lokacija ni določena";

  if (
    currentUser.location?.lat != null &&
    currentUser.location?.lng != null
  ) {
    const distance = haversine(
      currentUser.location.lat,
      currentUser.location.lng,
      c.lat,
      c.lng,
    );
    return `~${distance.toFixed(1)} km od tebe`;
  }

  return `${c.lat.toFixed(4)}, ${c.lng.toFixed(4)}`;
};

// ─── Glavni endpoint ────────────────────────────────────────────────────

const generateSuggestions = async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId).lean();

    if (!currentUser) {
      console.log("[suggestions] Uporabnik ni najden:", req.params.userId);
      return res.status(404).json({ message: "Uporabnik ni najden" });
    }

    if (!currentUser.activeSearch) {
      console.log("[suggestions] activeSearch je false — vrnem prazno");
      return res.status(200).json([]);
    }

    // 1) Najdi uporabnike, s katerimi se current user že srečuje (sprejet meeting)
    const existingMeetings = await Meeting.find({
      members: { $elemMatch: { user: currentUser._id, response: 'accepted' } },
      status: { $ne: 'cancelled' },
    }).select('members').lean();

    const alreadyMetIds = new Set();
    for (const meeting of existingMeetings) {
      for (const member of meeting.members) {
        const id = member.user.toString();
        if (id !== currentUser._id.toString()) {
          alreadyMetIds.add(id);
        }
      }
    }

    // 2) Pridobi vse potencialne kandidate iz baze (brez tistih iz obstoječih srečanj)
    const candidates = await User.find({
      _id: { $ne: currentUser._id, $nin: [...alreadyMetIds] },
      activeSearch: true,
      status: "active",
      isActive: true,
    }).lean();

    console.log(
      `[suggestions] kandidatov v DB: ${candidates.length}, ` +
      `currentUser interesi: ${extractInterests(currentUser.interests).length}, ` +
      `availability: ${(currentUser.availability || []).length}`
    );

    if (candidates.length === 0) {
      return res.status(200).json([]);
    }

    // 3) Izračunaj score za vsakega kandidata glede na trenutnega uporabnika
    const scoredAll = candidates.map((cand) => ({
      user: cand,
      ...computePairScore(currentUser, cand),
    }));

    console.log(
      "[suggestions] top 5 score-ov:",
      scoredAll
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((c) => ({
          username: c.user.username,
          score: c.score.toFixed(3),
          components: {
            int: c.components.sInterests.toFixed(2),
            geo: c.components.sGeo.toFixed(2),
            time: c.components.sTime.toFixed(2),
          },
        })),
    );

    const scored = scoredAll
      .filter((c) => c.score >= MIN_SCORE)
      .sort((a, b) => b.score - a.score);

    if (scored.length === 0) {
      console.log(`[suggestions] nobeden ne preseže MIN_SCORE=${MIN_SCORE}`);
      return res.status(200).json([]);
    }

    // 4) Vzemi pool najboljših kandidatov
    const pool = scored.slice(0, CANDIDATE_POOL_SIZE);

    // 4) Sestavi skupine: pohlepno izbiraj sidro + najboljše partnerje znotraj poola
    const groups = [];
    const usedIds = new Set();

    for (const anchor of pool) {
      if (groups.length >= MAX_GROUPS) break;
      if (usedIds.has(anchor.user._id.toString())) continue;

      const groupMembers = [currentUser, anchor.user];
      const tempUsed = new Set([anchor.user._id.toString()]);

      // poišči še (GROUP_SIZE - 2) članov, ki imajo dober score s sidrom IN s trenutnim uporabnikom
      const otherCandidates = pool
        .filter((p) => {
          const id = p.user._id.toString();
          return !usedIds.has(id) && !tempUsed.has(id);
        })
        .map((p) => {
          const scoreWithAnchor = computePairScore(anchor.user, p.user).score;
          return {
            ...p,
            combined: (p.score + scoreWithAnchor) / 2, // povprečje obeh ujemanj
          };
        })
        .sort((a, b) => b.combined - a.combined);

      for (const partner of otherCandidates) {
        if (groupMembers.length >= GROUP_SIZE) break;
        groupMembers.push(partner.user);
        tempUsed.add(partner.user._id.toString());
      }

      // če nismo zbrali niti minimalne velikosti, preskočimo
      if (groupMembers.length < MIN_GROUP_SIZE) continue;

      // označi vse kot uporabljene (razen current userja)
      for (const id of tempUsed) usedIds.add(id);

      // pripravi metapodatke skupine
      const otherMembers = groupMembers.slice(1);
      const avgScore = groupAverageScore(groupMembers);

      const commonInterestsAll = intersectAll(groupMembers, "interests");
      const commonAvailabilityAll = intersectAll(groupMembers, "availability");

      // če ni nobenega skupnega interesa med vsemi, vzemi vsaj tiste, ki jih ima
      // trenutni uporabnik s sidrom — tako uporabnik še vedno vidi smiselno povezavo
      const interestsForDisplay =
        commonInterestsAll.length > 0
          ? commonInterestsAll
          : intersect(
              extractInterests(currentUser.interests),
              extractInterests(anchor.user.interests),
            );

      const time =
        commonAvailabilityAll.length > 0
          ? formatSlot(commonAvailabilityAll[0])
          : "Termin se določi v dogovoru";

      groups.push({
        id: `${anchor.user._id}-${Date.now()}`,
        name: makeGroupName(interestsForDisplay),
        members: otherMembers.map((m) => m.username),
        memberIds: otherMembers.map((m) => m._id.toString()),
        interests: interestsForDisplay,
        time,
        location: formatLocation(currentUser, otherMembers),
        matchScore: Math.round(avgScore * 100),
      });
    }

    console.log(`[suggestions] vrnjenih skupin: ${groups.length}`);
    return res.status(200).json(groups);
  } catch (err) {
    console.error("Suggestions error:", err);
    return res.status(500).json({ message: err.message });
  }
};

export default { generateSuggestions };
