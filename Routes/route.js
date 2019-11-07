
const router = require('express').Router();


router.get('/computer', (req, res) => {
    res.render('computer');
});

router.get('/multiplayer', (req, res) => {
    res.render('home-multiplayer')
})

router.get('/online', (req, res) => {
    res.render('online');
});

router.get('/offline', (req, res) => {
    res.render('offline');
});

router.get('/', (req, res) => {
    res.render('home');
});

module.exports = router;