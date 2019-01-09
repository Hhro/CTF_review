const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const {Chall} = require('../models');

const router = express.Router();

router.post('/:id/submit',isLoggedIn, async (req,res,next) => {
    const {id} = req.params;
    const {flag} = req.body;
    try{
        await Chall.find({attributes: ['flag'], where: {id: parseInt(id)}})
        .then((result) => {
            correct_flag = result.dataValues;
        })
        if(correct_flag['flag'] === flag){
            req.flash('correct', id);
            return res.redirect('/chall/'+id);
        }
        else{
            req.flash('incorrect', id);
            return res.redirect('/chall/'+id);
        }
    } catch(error){
        console.error(error);
        return next(error);
    }
})

module.exports = router;