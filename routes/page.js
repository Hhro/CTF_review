const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const {Chall} = require('../models');
const showdown = require('showdown');
const fs = require('fs');
const {idsToMeta} = require('../utils/query');

const router = express.Router();
const converter = new showdown.Converter();

router.get('/login',isNotLoggedIn, (req,res) => {
    res.render('login', {title: 'CTF-review', user: req.user, loginError: req.flash('loginError')})
})

router.get('/chall', (req,res) => {
    fs.readdir('challs', async (err,ids) => {
        metas=await idsToMeta(ids);
        res.render('challList', {
            title: 'CTF-review',
            user: req.user,
            metas: metas,
        })
    })
})

router.get('/chall/:id', (req,res) => {
    const {id} = req.params;
    fs.readFile('challs/'+id+'/desc.md', "utf8",(err,md) => {
        let html = converter.makeHtml(md);
        res.render('chall', {
            title: 'CTF-review',
            user: req.user,
            correct: req.flash('correct'),
            incorrect: req.flash('incorrect'),
            desc: html,
            id:id,
        })
    })
})
router.get('/join',isNotLoggedIn, (req,res) => {
    res.render('join', {title: 'CTF-Review', user: req.user, joinError: req.flash('joinError')});
});

router.get('/', (req,res,next) => {
    res.render('main', {
        title: 'CTF_Review',
        user: req.user,
    });
});

module.exports = router;