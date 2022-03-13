const {check} = require('express-validator')
module.exports = new class {
    register(){
        return[
            check('email').isEmail().withMessage('Please enter a valid email address'),
            check('firstName').not().isEmpty().withMessage('firstName cannot be empty'),
            check('lastName').not().isEmpty().withMessage('lastName cannot be empty'),
            check('password').not().isEmpty().isLength({min:5}).withMessage('password invalid')
            
        ]
    }
    login(){
        return[
             
            check('email').isEmail().withMessage('Please enter a valid email address or password'),
        ]
    }
    email(){
        return[
             
            check('email').isEmail().withMessage('Please enter a valid email address'),
           
        ]
    }
    password(){
      return [ check('password').not().isEmpty().isLength({min:5}).withMessage('password invalid')
    ]

    }
}