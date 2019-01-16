const {isExistUC, isExistC, isExistUByNick} = require('../utils/query');

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

/* check user already solved challenge */
exports.isNotSolved = async (req,res,next) => {
    const cid = parseInt(req.params.id);
    const uid = parseInt(req.user.id);

    if(!await isExistUC(uid,cid)){
        next();
    }else{
        res.status(403).send('You already solve it')
    }
}

/* check if challenge loaded in DB */
exports.isChallengeExist = async (req,res,next) => {
    const cid = parseInt(req.params.id);

    if(cid && await isExistC(cid)){
        next();
    }else{
        res.status(404).send('Problem not exist');
    }
}

/* check if user exist */
exports.isUserExistByNick = async (req,res,next) => {
    const unick = req.params.nick;

    if(await isExistUByNick(unick)){
        next();
    } else {
        res.status(404).send('User not exist');
    }
}