const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const {Chall} = require('../models');
const showdown = require('showdown');
const fs = require('fs');

const router = express.Router();
const converter = new showdown.Converter();

router.get('/chall',isLoggedIn, (req,res) => {
    fs.readdir('challs', (err,ids) => {
        res.render('challList', {
            title: 'CTF_review',
            user: req.user,
            ids: ids,
        })
    })
})

router.get('/chall/:id', (req,res) => {
    const {id} = req.params;
    fs.readFile('challs/'+id+'/desc.md', "utf8",(err,md) => {
        let html = converter.makeHtml(md);
        res.render('chall', {
            title: 'CTF_review',
            user: req.user,
            correct: req.flash('correct'),
            incorrect: req.flash('incorrect'),
            desc: html,
            id:id,
        })
    })
})
router.get('/join',isNotLoggedIn, (req,res) => {
    res.render('join', {title: 'CTF_Review', user: req.user, joinError: req.flash('joinError')});
});

router.get('/', (req,res,next) => {
    res.render('main', {
        title: 'CTF_Review',
        user: req.user,
        loginError: req.flash('loginError'),
    });
});

module.exports = router;