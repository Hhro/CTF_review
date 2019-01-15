const express = require('express');
const {isNotLoggedIn, isChallengeExist} = require('./middlewares');
const {TagChall, User} = require('../models');
const showdown = require('showdown');
const fs = require('fs');
const {cidsToMeta, isExistUC, uidsToRankingMeta, getCinUC} = require('../utils/query');

const router = express.Router();
const converter = new showdown.Converter();

router.get('/', (req,res,next) => {
    res.render('main', {
        title: 'CTF_Review',
        user: req.user,
    });
});

router.get('/join',isNotLoggedIn, (req,res) => {
    res.render('join', {title: '0dayCTF', user: req.user, joinError: req.flash('joinError')});
});

router.get('/login',isNotLoggedIn, (req,res) => {
    res.render('login', {title: '0dayCTF', user: req.user, loginError: req.flash('loginError')})
});

router.get('/chall', (req,res) => {
    fs.readdir('challs', async (err,ids) => {
        metas=await cidsToMeta(ids);
        res.render('challList', {
            title: '0dayCTF',
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

router.get('/ranking',async (req,res) => {
    let uids = await User.findAll({attributes: ['id']});

    if(uids.length > 0){
        uids = uids.map(uid=>uid.id);
        metas = await uidsToRankingMeta(uids);
        res.render('ranking', {
            title: '0dayCTF',
            user: req.user,
            metas: metas,
        })
    }
})

router.get('/user/:nick', async(req,res) => {
    const nick = req.params.nick;
    let uid = await User.findOne({attributes:['id'], where: {nick:nick}});    
    uid=uid.id;
    const uinfo = await User.findOne({attributes:['solves','msg'],where: {nick: nick}});
    const probIds = await getCinUC(uid);
    const metas = await cidsToMeta(probIds);

    if(uinfo){
        res.render('user', {
            title: '0dayCTF',
            user: req.user,
            nick: nick,
            info: uinfo,
            metas: metas,
        })
    } else{
        res.status(404).send('Uesr not registered');
    }
})
module.exports = router;