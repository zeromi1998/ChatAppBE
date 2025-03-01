const User = require("../Model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//************ Todo: -  Add code  to check emaii Id aready exist or not */

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  // console.log("this is create token methos",user,user._id)
  return jwt.sign({id}, "ChatApp2024", { expiresIn: maxAge });
};

module.exports.signUp = async (req, res) => {
  console.log("this is body data", req.body);
  const userData = await User.create(req.body);
  console.log("this isdab data", userData);
  res.json(userData);
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
        console.log("this is try login data", userData._id,token);

        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.json({ id: userData._id, name: userData.name,email:userData.emailId,token});
      }
      else{
      res.json("Wrong Password");

      }
    } else {
      res.json("User not exists please register user");
    }
  } catch (error) {
    console.log("this is login error", error);
  }
};
