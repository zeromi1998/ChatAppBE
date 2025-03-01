const {Router} = require("express");
const usersController = require("../controller/userController");
const userRoute = Router();

userRoute.get("/getUsers",usersController.getUsers);

module.exports = userRoute;


