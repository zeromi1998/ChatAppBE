const {Router} = require("express");
const chatController = require("../controller/chatController");

const chatRouter = Router();


chatRouter.get("/chat",chatController.chatController);

module.exports=chatRouter;