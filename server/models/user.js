var mongoose = require('mongoose')

//create a user model
var User = mongoose.model('User',{
  email: {
    type: String,
    required:true,
    minlength:1,
    trim: true
  }
})

module.exports = { User }
