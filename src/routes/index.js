const express = require('express')
const router = express.Router()
const{isLoggedIn} = require('./../../middleware/auth.js')
 router.use('/auth',require('./auth'))
 router.use('/user',isLoggedIn,require('./user'))
 
module.exports = router
