// controllers/pageController.js

export const getHomePage = (req, res) => {
    res.render('partials/hero', {
        title: 'Dobrodošli na Srečajmo se',
        layout: 'layouts/main'
    });
};

export const getTermsPage = (req, res) => {
    res.render('partials/terms', {
        title: 'Pogoji uporabe',
        layout: 'layouts/main'
    });
};

export const getGDPRPage = (req, res) => {
    res.render('partials/gdpr', {
        title: 'Varstvo osebnih podatkov (GDPR)',
        layout: 'layouts/main'
    });
};

export const getFQAPage = (req, res) => {
    res.render('partials/fqa', {
        title: 'Pogosta vprašanja',
        layout: 'layouts/main'
    });
};

export const getContactPage = (req, res) => {
    res.render('partials/contact', {
        title: 'Kontakt',
        layout: 'layouts/main'
    });
};

export const getChatPage = (req, res) => {
    const { group, location, time } = req.query;
    res.render('partials/chat', {
        title: 'Skupinski klepet',
        layout: 'layouts/main',
        groupName: group || 'Kavoljubci',
        groupLocation: location || 'Center Ljubljana',
        groupDateTime: time || 'četrtek, 18:00'
    });
};

export const getRatingPage = (req, res) => {
    const { group, date, meetingId } = req.query;
    res.render('partials/rating', {
        title: 'Oceni srečanje',
        layout: 'layouts/main',
        groupName: group || 'Kavoljubci',
        groupDate: date || 'četrtek, 18:00',
        meetingId: meetingId || Date.now().toString()
    });
};

export const getResetPasswordPage = (req, res) => {
    const { email } = req.query;
    res.render('partials/resetPassword', {
        title: 'Ponastavitev gesla',
        layout: 'layouts/main',
        email: email || ''
    });
};

export const saveRating = (req, res) => {
    const { meetingId, groupName, rating, comment } = req.body;
    console.log('Shranjena ocena:', { meetingId, groupName, rating, comment });
    res.json({ success: true, message: 'Ocena shranjena' });
};

export const saveContact = (req, res) => {
    const { firstName, lastName, email, subject, message } = req.body;
    console.log('Shranjeno sporočilo:', { firstName, lastName, email, subject, message });
    res.json({ success: true, message: 'Sporočilo poslano' });
};