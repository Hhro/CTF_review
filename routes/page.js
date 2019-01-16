const express = require('express');
const {isNotLoggedIn, isChallengeExist, isUserExistByNick} = require('./middlewares');
const {TagChall, User, Chall, sequelize} = require('../models');
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
            msg: req.flash('msg'),
            desc: html,
            cid:cid,
            solved: req.isAuthenticated() && await isExistUC(parseInt(req.user.id), parseInt(cid)),
        })
    })
});

router.get('/pwn', async (req,res) => {
    let cids = await TagChall.findAll({attributes: ['challId'], order: [['challId','ASC']], where: {tag: 'pwn'}});
    
    cids = cids.map(cid=> cid.challId);
    metas = await cidsToMeta(cids);
    res.render('challList', {
        title: '0dayCTF',
        user: req.user,
        metas: metas,
        category: 'pwn',
    });
});

router.get('/rev', async (req,res) => {
    let cids = await TagChall.findAll({attributes: ['challId'], order: [['challId','ASC']] ,where: {tag: 'rev'}});

    cids = cids.map(cid=> cid.challId);
    metas = await cidsToMeta(cids);
    res.render('challList', {
        title: '0dayCTF',
        user: req.user,
        metas: metas,
        category: 'rev',
    })
});

router.get('/ranking',async (req,res) => {
    let uids = await User.findAll({attributes: ['id']});

    uids = uids.map(uid=>uid.id);
    metas = await uidsToRankingMeta(uids);
    res.render('ranking', {
        title: '0dayCTF',
        user: req.user,
        metas: metas,
    })
})

router.get('/user/:nick', isUserExistByNick, async(req,res) => {
    const nick = req.params.nick;
    const uinfo = await User.findOne({attributes:['id','solves','msg'], where: {nick: nick}});
    let cids = await getCinUC(uinfo.id);
    const metas = await cidsToMeta(cids);

    /*
    let solves = await User.findOne({
        attributes: [],
        where: {id: uinfo.id}, 
        include: [{model: Chall, attributes: ['id','title','solves']}], 
    });
    solves = solves.challs.map( x => {
        return {
            id : x.id,
            title: x.title,
            solves: x.solves,
        };
    })
    */
    
    res.render('user', {
        title: '0dayCTF',
        user: req.user,
        nick: nick,
        info: uinfo,
        metas: metas,
    });
})
module.exports = router;