const {Chall} = require('../models');

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

/* check if exist userId-challId in table UserChall*/
/* param: int uid , int cid                                            */

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
/* param : int uid, int cid                        */

exports.addUC= async (uid,cid) => {
    const challId = await Chall.find({attributes: ['id'], where: {id: cid}});
    if(!exports.isExistUC(uid,cid)){
        await challId.addUsers(uid);
    }
}

/* check if cid in table chall */
/* param : int cid                   */

exports.isExistC = async (cid) => {
    const check = await Chall.find({attributes: ['id'], where: {id: cid}});
    if(check)
        return 1;
    else
        return 0;
}
