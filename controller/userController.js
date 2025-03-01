const User = require("../Model/User");

module.exports.getUsers = async (req, res) => {
  try {
    const userData = await User.find({});
    console.log("this is all user data", userData);
    res.status(200).json(userData);
  } catch (err) {
    res.status(400).json(err);
  }
};
