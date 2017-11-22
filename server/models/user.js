const validator = require('validator')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required:true,
    minlength:1,
    trim: true,
    unique:true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
}) //tack on custom methods


UserSchema.methods.toJSON = function (){
  var user = this
  var userObject = user.toObject() //convert
  return _.pick(userObject, ['_id', 'email']) //only send some things back
}
//instance menthod on to anything. Have access to docs.
//Arrow functions don't bind this
UserSchema.methods.generateAuthToken = function () {
  var user = this //access to individual document
  var access = 'auth'
  var token = jwt.sign({_id:user._id.toHexString(), access},'abc123').toString() //turns user id into a token

  user.tokens.push({access, token})

  //save returns promise, pass in success callback and return token as opposed to promise
  return user.save().then(() =>{
    return token
  })
}//fn


//statics is like an instance method, but on model
UserSchema.statics.findByToken = function (token) {
    var User = this //model
    var decoded

    //if error in try then moved to catch and cont w/program
    try{
      decoded = jwt.verify(token, 'abc123')
    }catch (e){
      // return new Promise((resolve, reject) => {
      //   reject()
      // })
      return Promise.reject() //shortcut
    }

    //success decoded
    return User.findOne({
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access':'auth'
    })
}

//middleware to hash pwds before calling SAVE
UserSchema.pre('save', function (next) {
  var user = this
  if (user.isModified('password')){
    //salt pwds
    //10 rounds - bcrypt intentionally slow - stops brute force
    bcrypt.genSalt(10, (err,salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash
        next()
      })
    })

  }else{
    next()
  }

})

//create a user model
var User = mongoose.model('User', UserSchema)
module.exports = { User }

//npm validator
