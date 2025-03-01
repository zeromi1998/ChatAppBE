const {Router} =  require("express");
const authController  = require("../controller/authController")
const authRouter = Router();


authRouter.post("/signUp",authController.signUp)

authRouter.post("/login",authController.login)




module.exports = authRouter