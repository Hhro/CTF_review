const {Chall, User} = require('../models');

/* use challenge id list to get challenge meta info(title, solves) */
/* param: int cid[] */

exports.cidsToMeta = async cids => {
    let result = [];
    try{
        await Promise.all(cids.map(async (cid) => {
            await Chall.find({attributes:['id','title','solves'],where:{id:parseInt(cid)}})
            .then((data) => {
                result.push({'id':data.id,'title':data.title,'solves': data.solves})
            })
        }))
        return result;
    } catch(error) {
        console.error(error);
    }
};

/* get ranking page meta data */
/* param : void */
exports.uidsToRankingMeta = async () => {
    try{
        let rows = await User.findAll({attributes:['id','nick','solves','msg'], order:[['solves','DESC']]});
        return rows.map( row => row.dataValues);
    } catch(error){
        console.error(error);
    }
}

/* check if exist userId-challId in table UserChall*/
/* param: int uid , int cid                                            */

exports.isExistUC = async (uid,cid) => {
    const challId  = await Chall.find({attributes: ['id'], where: {id: cid}});
    const exUser = await challId.getUsers({where: {id: uid}});
    return exUser.length? 1 : 0;
}

/* add userId-challId in table UserChall*/
/* param : int uid, int cid                        */

exports.addUC= async (uid,cid) => {
    const challId = await Chall.find({attributes: ['id'], where: {id: cid}});
    if(!await exports.isExistUC(uid,cid)){
        await challId.addUsers(uid);
    }
}

/* get Challenge IDs belongs to UserID */
/* param : int uid                        */

exports.getCinUC = async (uid) => {
    const userId = await User.find({attributes: ['id'], where: {id:uid}});
    let challs = await userId.getChalls();
    let result = challs.map(chall => chall.id);
    return result;
}

/* check if cid in table challs */
/* param : int cid                   */

exports.isExistC = async (cid) => {
    const check = await Chall.find({attributes: ['id'], where: {id: cid}});
    return check ? 1 : 0;
}

/* check if uid in table users by Nick*/
/* param : string nick                             */

exports.isExistUByNick = async (unick) => {
    const check = await User.find({attributes: ['id'], where: {nick: unick}});
    return check ? 1 : 0;
}