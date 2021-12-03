/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');
const User = require('../models/User');


// check json web token exists & is verified
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
  
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.status(401).send({"error": "not authenticated!"})
        } else {
          // console.log(decodedToken);
          next();
        }
      });
    } else {
      res.status(401).send({"error": "not authenticated!"})
    }
};



// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          next();
        } else {
          let user = await User.findById(decodedToken.id);
          res.locals.user = user;
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
};
  
  
module.exports = { requireAuth, checkUser };