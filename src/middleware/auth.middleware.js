const jwt = require('jsonwebtoken');
const {user : userModel, status:statusModel} = require('../models');

const verifyToken = async(req, res, next) => {

    const token = req.session.token;

    jwt.verify(token, process.env.JWT_SECRET, async(err, decoded)=>{
        if(err){
            return res.status(401).send({
                message:"access expired, please login again",
                data:err.expiredAt
            });
        }

        const user = await userModel.findOne({
            where:{
                uuid:decoded.uuid
            },
            include:[
                {
                    model:statusModel,
                    attributes:['name','code']
                }
            ]
        })

        if(!user){
            return res.status(404).json({
                status:404,
                success: false,
                data:{
                    message:"login failed, user not found or deleted"
                }
            })
        }
    
        if(user.status.code !== 2){
            return res.status(401).json({
                status:401,
                success: false,
                data:{
                    message: `you don't have access, user is ${findUser.status.name}`
                }
            })
        }

        req.user = user;

        next()
    });
}

module.exports = {
    verifyToken
}