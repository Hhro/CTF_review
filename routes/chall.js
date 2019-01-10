const express = require('express');
const sequelize = require('sequelize');
const {isLoggedIn, isNotLoggedIn, isNotSolved} = require('./middlewares');
const {addUC} = require('../utils/query')
const {Chall} = require('../models');

const router = express.Router();

router.post('/:id/submit',isLoggedIn, isNotSolved, async (req,res,next) => {
    const cid = parseInt(req.params.id);
    const uid = parseInt(req.user.id);
    const {flag} = req.body;
    try{
        const result = await Chall.find({attributes: ['flag'], where: {id: cid}})
        correct_flag = result.dataValues;

        if(correct_flag['flag'] === flag){
            await Chall.update({solves: sequelize.literal('solves+1')}, {where: {id: cid}});
            await addUC(uid,cid);
            const id_inst= await Chall.find({attributes: ['id'], where:{id: cid}});
            await id_inst.addUsers(uid);
            req.flash('correct','Great!');
            return res.redirect('/chall/'+cid);
        }
        else{
            req.flash('incorrect','Wrong flag...');
            return res.redirect('/chall/'+cid);
        }
    } catch(error){
        console.error(error);
        return next(error);
    }
})

module.exports = router;