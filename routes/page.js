const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');

const router = express.Router();

router.get('/chall',isLoggedIn, (req,res) => {
    res.render('chall',{
        title: 'Chall-CTF_REVIEW', 
        user: req.user
    })
})

router.get('/join',isNotLoggedIn, (req,res) => {
    res.render('join', {title: 'join-CTF_Review', user: req.user, joinError: req.flash('joinError')});
});

router.get('/', (req,res,next) => {
    res.render('main', {
        title: 'CTF_Review',
        user: req.user,
        loginError: req.flash('loginError'),
    });
});

module.exports = router;