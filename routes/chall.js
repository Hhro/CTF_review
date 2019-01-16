const express = require('express');
const sequelize = require('sequelize');
const {isLoggedIn, isNotSolved, isChallengeExist} = require('./middlewares');
const {addUC} = require('../utils/query')
const {Chall,User} = require('../models');

const router = express.Router();

router.post('/:id/submit', isLoggedIn, isChallengeExist, isNotSolved, async (req,res,next) => {
    const cid = parseInt(req.params.id);
    const uid = parseInt(req.user.id);
    const {flag} = req.body;
    try{
        const result = await Chall.findOne({attributes: ['flag'], where: {id: cid}})
        const correct_flag = result.flag;

        if(correct_flag === flag){
            await Chall.update({solves: sequelize.literal('solves+1')}, {where: {id: cid}});
            await addUC(uid,cid);
            await User.update({solves: sequelize.literal('solves+1')}, {where: {id: uid}});
            req.flash('msg','Great!');
            return res.redirect('/chall/'+cid);
        }
        else{
            req.flash('msg','Wrong flag...');
            return res.redirect('/chall/'+cid);
        }
    } catch(error){
        console.error(error);
        return next(error);
    }
})

module.exports = router;