const autoBind = require('auto-bind');
const { validationResult,validationBody } = require('express-validator');
module.exports = class{
    constructor(){
        autoBind(this)
        
        

    }
    validationBody(req,res){
        const result = validationResult(req);
        if(!result.isEmpty()){
          const errors = result.array();
          const messages = [];
          errors.forEach(err => messages.push(err.msg));
          res.status(400).json({
            message: 'validation error',
            data: messages
          })
        }
           
        
         
    }
    validate(req,res,next){
        if(this.validationBody(req,res)){
            return
        }
        next()
    }
    response({res,message,code=200,data={}}){
        res.status(code).json({message,data})
    }
}