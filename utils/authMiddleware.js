const jwt = require("jsonwebtoken");
const jwtsecret = process.env.JWT_SECRET_KEY;
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  const token = req.headers["authorization"];

  //Check if token is not avaliable
  if (!token) {
    return res.status(401).json({ msg: "Authorization Denied" });
  }

  //Verify token
  try {
    const decoded = jwt.verify(token, jwtsecret);
    const user = await User.findById(decoded.id).select("-password");
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ msg: "Token is not valid" });
  }
};
module.exports = { auth };
