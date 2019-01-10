const {isExistUC} = require('../utils/query');

exports.isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('Login Please');
    }
};

exports.isNotLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        next();
    } else{
        res.redirect('/');
    }
}

exports.isNotSolved = async (req,res,next) => {
    const cid = parseInt(req.params.id);
    const uid = parseInt(req.user.id);

    if(!await isExistUC(uid,cid)){
        next();
    }else{
        res.status(403).send('You already solve it')
    }
}