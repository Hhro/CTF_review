const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const {Chall} = require('../models');

const router = express.Router();

router.post('/submit/:id',isLoggedIn,async (req,res,next) => {
    const {id} = req.params;
    const {flag} = req.body;

    await Chall.find({attributes: ['flag'], where: {id: parseInt(id)}})
    .then((result) => {
        correct_flag = result.dataValues;
    })
    if(correct_flag['flag'] === flag){
        return res.render('correct',{
            title: 'CTF_Review',
            user: req.user,
        });
    }
    else{
        return res.render('incorrect');
    }
})

module.exports = router;