const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const {Chall} = require('../models')

const router = express.Router();

router.get('/chall',isLoggedIn, (req,res) => {
    Chall.findAll({
        attributes: ['id'],
    })
    .then((challs) => {
        res.render('chall',{
            title: 'Chall-CTF_REVIEW', 
            user: req.user,
            judge:req.flash('judge'),
            challs: challs,
        })
    })
    .catch((error) => {
        console.error(error);
        next(error);
    });
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