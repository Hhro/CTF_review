const express = require('express');
const sequelize = require('sequelize');
const {isLoggedIn, isNotSolved, isChallengeExist} = require('./middlewares');
const {addUC, isUniqueCinUC} = require('../utils/query')
const {Chall,User, UserChall} = require('../models');

const router = express.Router();

router.post('/:id/submit', isLoggedIn, isChallengeExist, isNotSolved, async (req,res,next) => {
    const cid = req.params.id;
    const uid = req.user.id;
    const {flag} = req.body;
    try{
        const result = await Chall.findOne({attributes: ['flag'], where: {id: cid}})
        const correct_flag = result.flag;
        if(correct_flag === flag){
            await Chall.update({solves: sequelize.literal('solves+1')}, {where: {id: cid}});
            await addUC(uid,cid);
            if(await isUniqueCinUC(cid)){
                await UserChall.update({firstsolve: 1},{where:{userId: uid, challId: cid}});
            };
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