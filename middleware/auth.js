const jwt =require('jsonwebtoken');
const User = require('./../src/models/user')
require('dotenv').config()
async function isLoggedIn(req,res, next){
    const token = req.header("x-auth-token")
    if(!token) res.status(401).send('access denied')
    try{
        const decoded = jwt.verify(token,process.env.JWT_KEY);
        const user = await User.findById(decoded._id);
        console.log(user);
        req.user = user;
        next();
      }catch(ex){
        res.status(400).send('invalid token');
      }
}
module.exports = { isLoggedIn}