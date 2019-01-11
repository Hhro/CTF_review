const express = require('express');
const {isNotLoggedIn, isChallengeExist} = require('./middlewares');
const {TagChall} = require('../models');
const showdown = require('showdown');
const fs = require('fs');
const {cidsToMeta, isExistUC} = require('../utils/query');

const router = express.Router();
const converter = new showdown.Converter();

router.get('/', (req,res,next) => {
    res.render('main', {
        title: 'CTF_Review',
        user: req.user,
    });
});

router.get('/join',isNotLoggedIn, (req,res) => {
    res.render('join', {title: 'CTF-Review', user: req.user, joinError: req.flash('joinError')});
});

router.get('/login',isNotLoggedIn, (req,res) => {
    res.render('login', {title: 'CTF-review', user: req.user, loginError: req.flash('loginError')})
});

router.get('/chall', (req,res) => {
    fs.readdir('challs', async (err,ids) => {
        metas=await cidsToMeta(ids);
        res.render('challList', {
            title: 'CTF-review',
            user: req.user,
            metas: metas,
        })
    })
});

router.get('/chall/:id', isChallengeExist, async (req,res) => {
    const cid = req.params.id;
    await fs.readFile('challs/'+cid+'/desc.md', "utf8",async (err,md) => {
        let html = converter.makeHtml(md);
        res.render('chall', {
            title: 'CTF-review',
            user: req.user,
            correct: req.flash('correct'),
            incorrect: req.flash('incorrect'),
            desc: html,
            cid:cid,
            solved: req.isAuthenticated() && await isExistUC(parseInt(req.user.id), parseInt(cid)),
        })
    })
});

router.get('/pwn', async (req,res) => {
        const cids = await TagChall.findAll({attributes: ['challId'], where: {tag: 'pwn'}});

        if(cids.length > 0){
            cids = cids.map(cid=> cid.challId);
            metas = await cidsToMeta(cids);
            console.log(metas);
            res.render('challList', {
                title: '0dayCTF',
                user: req.user,
                metas: metas,
                category: 'pwn',
            })
        } else {
            res.render('challList', {
                title: '0dayCTF',
                user: req.user,
                metas: [],
                category: 'pwn',
            })
        }
});

router.get('/rev', async (req,res) => {
    let cids = await TagChall.findAll({attributes: ['challId'], where: {tag: 'rev'}});

    if(cids.length > 0){
        cids = cids.map(cid=> cid.challId);
        metas = await cidsToMeta(cids);
        console.log(metas);
        res.render('challList', {
            title: '0dayCTF',
            user: req.user,
            metas: metas,
            category: 'rev',
        })
    } else {
        res.render('challList', {
            title: '0dayCTF',
            user: req.user,
            metas: [],
            category: 'rev',
        })
    }
});

module.exports = router;