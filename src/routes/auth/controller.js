const controller = require('../controller')
const User =require('./../../models/user')
const Token =require('../../models/token')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash')
require('dotenv').config()
const auth = require('google-auth-library')
const client = new auth.OAuth2Client(process.env.CLIENT_ID)
const sendEmail = require('./../../../config/sendEmail')
const crypto = require('crypto')
const {validationResult} =require('express-validator')

module.exports = new (class extends controller{
    
    async register(req,res){
    let user = await User.findOne({email:req.body.email})
    if(user){
        return this.response({res,code:400,message:'user name or email is not available'})
    }
     const {email,firstName,lastName ,password} = req.body;
     user = new User({email,firstName,lastName ,password});
     
     const salt = await bcrypt.genSalt(10)
     user.password = await bcrypt.hash(user.password,salt)
     await user.save()
     this.response({res,message:'the user successfully created',
    data:_.pick(user,[firstName,lastName]),status:200 })
    }
    async login(req,res){
        const user = await User.findOne({email:req.body.email})
        if(!user){
            return this.response({res,code:400,message:'invalid user name or password'})
        }
        const isValid = await bcrypt.compare(req.body.password,user.password)
        if(!isValid){
            return this.response({res,code:400,message:'invalid user name or password'})
        }
        
        try{
            const token = jwt.sign({_id: user.id},process.env.JWT_KEY.toString())
            this.response({res,message:'successfuly logged in', data: {token}});

        }catch(ex){ 
          res.status(400).send('invalid token')
          console.log(ex)

        }
        

    }
    async google(req, res){
        const{tokenId} = req.body
        response = await client.verifyIdToken({idToken:tokenId,audience: process.env.CLIENT_ID})
           const{email_verified,firstname,lastname,email,name} = response.payload
            if(email_verified){
                const user = await User.findOne({email})
                if(user){
                    const token = jwt.sign({_id: user.id},process.env.JWT_KEY.toString())
                    this.response({res,message:'successfuly logged in', data: {token}});
                }
                let password = email + process.env.JWT_KEY.toString()
                user = new User({email,firstName,lastName,password})
                await user.save()
                this.response({res,message:'the user successfully created',
                data:_.pick(user,[firstName,lastName]),status:200 })
            }
        
    }
    async email(req,res){
        const user = await User.findOne({email:req.body.email})
       if(!user) {return this.response({res,status:400,message:"user does not exist"})}
       let token = await Token.findOne({userId:user._id})
       if(!token){
        let token = new Token({
               userId:user._id,
               token:crypto.randomBytes(32).toString('hex')
           })
           await token.save()
          
       }
       const link =`${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`
           console.log(token.token)
       await sendEmail(user.email,"password reset",link)
       res.status(200).json({message:"password link sent"})
      
    }
    async password(req,res){
        const user = await User.findById(req.params.userId)
        if(!user) return this.response({res,message:'invalid link or expired link',status:400})
        const token = await  Token.findOne({
            userId:user._id,
            token:req.params.token
        })
        if(!token) return this.response({res,message:'invalid link or expired link',status:400})
        user.password = req.body.password
        await user.save()
        await token.delete()
        this.response({res,message:"password reset successfully",status:200})
    }
})()


   