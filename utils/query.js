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