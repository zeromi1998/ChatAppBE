const jwt = require("jsonwebtoken");

module.exports.authMiddleware =  (req,res,next)=>{

    const authToken  = req.headers.authorization

    if(authToken){
        const token = authToken.split(" ")[1];
        jwt.verify(token,"ChatApp2024",(err,decodedData)=>{
            if(err){
                res.status(401).json({err})
            }
            else{
                req.user = decodedData
                console.log("this is token decode data",decodedData,req)

                next()
            }
    })
    }
    else{
        res.status(401).json("Unauthorized User")
    }
}