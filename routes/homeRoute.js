const {Router} = require("express");
const homeController = require("../controller/homeController")
const  {authMiddleware} =  require("../Middleware/authMiddleware")
const homeRouter = Router()


homeRouter.get("/chat",authMiddleware,homeController.homeController)

module.exports =  homeRouter;