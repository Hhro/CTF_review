const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const {Chall} = require('../models');

const router = express.Router();

router.post('/submit/:id',isLoggedIn,async (req,res,next) => {
    const {id} = req.params;
    const {flag} = req.body;
    try{
        await Chall.find({attributes: ['flag'], where: {id: parseInt(id)}})
        .then((result) => {
            correct_flag = result.dataValues;
        })
        if(correct_flag['flag'] === flag){
            return res.render('chall',{
                user: req.user,
                correct: 1,
            });
        }
        else{
            return res.render('chall',{
                user: req.user,
                incorrect: 1,
            });
        }
    } catch(error){
        console.error(error);
        return next(error);
    }
})

module.exports = router;