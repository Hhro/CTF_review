const sequelize = require('sequelize');
const {Chall} = require('../models');

exports.idsToMeta = async ids => {
    let result = [];
    try{
        await Promise.all(ids.map(async (id) => {
            await Chall.find({attributes:['id','title','solves'],where:{id:parseInt(id)}})
            .then((data) => {
                result.push({'id':data.id,'title':data.title,'solves': data.solves})
            })
        }))
        return result;
    } catch(error) {
        console.error(error);
        return next(error);
    }
};

/* check if exist userId-challId in table UserChall*/
/* param: int(uid), int(cid)                                            */

exports.isExistUC = async (uid,cid) => {
    const challId  = await Chall.find({attributes: ['id'], where: {id: cid}});
    const exUser = await challId.getUsers({where: {id: uid}});
    if(exUser.length){
        return 1;
    } else {
        return 0;
    }
}

/* add userId-challId in table UserChall*/
/* param : int(uid), int(cid)                        */

exports.addUC= async (uid,cid) => {
    const challId = await Chall.find({attributes: ['id'], where: {id: cid}});
    if(!exports.isExistUC(uid,cid)){
        await challId.addUsers(uid);
    }
}
