const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
    const title = 'Welcome to Selfcare';
    res.render('index', {title: title});
});

// About page
router.get('/about', (req, res) => {
    res.render('about');
});

// Logout user
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Login page
router.get('/displaylogin', (req, res) => {
    res.render('user/login');
});

// Register page
router.get('/displayregister', (req, res) => {
    res.render('user/register');
});


module.exports = router;