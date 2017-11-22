const validator = require('validator')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

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
  var token = jwt.sign({_id:user._id.toHexString(), access},'abc123').toString()

  user.tokens.push({access, token})

  //save returns promise, pass in success callback and return token as opposed to promise
  return user.save().then(() =>{
    return token
  })
}//fn

//create a user model
var User = mongoose.model('User', UserSchema)
module.exports = { User }

//npm validator
