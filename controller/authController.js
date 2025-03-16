const User = require("../Model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//************ Todo: -  Add code  to check emaii Id aready exist or not */

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  // console.log("this is create token methos",user,user._id)
  return jwt.sign({ id }, "ChatApp2024", { expiresIn: maxAge });
};

module.exports.signUp = async (req, res) => {
  try {
    console.log("this is body data", req.body);

    const getUser = await User.findOne({ emailId: req.body.emailId });

    if (getUser) {
      res.status(404).json({ message: "Email Id already exits...! Please login to account" });
    } else {
      const userData = await User.create(req.body);
      console.log("this isdab data", userData);
      res.json(userData);
    }
  } catch (error) {
    res.status(404).json(error);
  }
};

//*****  Todo: - Add check for email and password should not be null */
module.exports.login = async (req, res) => {
  try {
    const userData = await User.findOne({ emailId: req.body.emailId });

    if (userData) {
      console.log("this is try login data111", userData._id);

      const passwordCheck = await bcrypt.compare(
        req.body.password,
        userData.password
      );
      if (passwordCheck) {
        console.log("this is try login data", userData._id);

        const token = createToken(userData);
        console.log("this is try login data", userData._id, token);

        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.json({
          id: userData._id,
          name: userData.name,
          email: userData.emailId,
          token,
        });
      } else {
        res.status(404).json({message:"Incorrect Password"});
      }
    } else {
      res.status(404).json({message:"Incorrect Email"});
    }
  } catch (error) {
    console.log("this is login error", error);
    res.status(404).json(error);
  }
};
