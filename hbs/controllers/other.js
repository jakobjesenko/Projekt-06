// controllers/other.js
const about = (req, res) => {
  res.render("index", { 
    title: "O nas - Srečajmo se",
    user: req.session?.user || null,
    admin: req.session?.admin || null,
    view: "about"
  });
};

const contact = (req, res) => {
  res.render("index", { 
    title: "Kontakt - Srečajmo se",
    user: req.session?.user || null,
    admin: req.session?.admin || null,
    view: "contact"
  });
};

const howItWorks = (req, res) => {
  res.render("index", { 
    title: "Kako deluje - Srečajmo se",
    user: req.session?.user || null,
    admin: req.session?.admin || null,
    view: "howItWorks"
  });
};

const faq = (req, res) => {
  res.render("index", { 
    title: "Pogosta vprašanja - Srečajmo se",
    user: req.session?.user || null,
    admin: req.session?.admin || null,
    view: "fqa"
  });
};

const gdpr = (req, res) => {
  res.render("index", { 
    title: "Varstvo osebnih podatkov - Srečajmo se",
    user: req.session?.user || null,
    admin: req.session?.admin || null,
    view: "gdpr"
  });
};

const terms = (req, res) => {
  res.render("index", { 
    title: "Pogoji uporabe - Srečajmo se",
    user: req.session?.user || null,
    admin: req.session?.admin || null,
    view: "terms"
  });
};

const chat = (req, res) => {
  const { group, location, time } = req.query;
  res.render("index", { 
    title: "Klepet - Srečajmo se",
    user: req.session?.user || null,
    admin: req.session?.admin || null,
    groupName: group || "Kavoljubci",
    groupLocation: location || "Center Ljubljana",
    groupDateTime: time || "četrtek, 18:00",
    view: "chat"
  });
};

const rating = (req, res) => {
  const { group, date, meetingId } = req.query;
  res.render("index", { 
    title: "Oceni srečanje - Srečajmo se",
    user: req.session?.user || null,
    admin: req.session?.admin || null,
    groupName: group || "Kavoljubci",
    groupDate: date || "četrtek, 18:00",
    meetingId: meetingId || Date.now().toString(),
    view: "rating"
  });
};

const resetPassword = (req, res) => {
  const { email } = req.query;
  res.render("index", { 
    title: "Ponastavitev gesla - Srečajmo se",
    user: req.session?.user || null,
    admin: req.session?.admin || null,
    email: email || "",
    view: "resetPassword"
  });
};

export default { 
  about, 
  contact, 
  howItWorks,
  faq,
  gdpr,
  terms,
  chat,
  rating,
  resetPassword
};