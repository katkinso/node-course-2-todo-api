var {User} = require('./../models/user')

//middleware
var authenticate = (req,res,next) => {
  var token = req.header('x-auth') //gets value from header

  User.findByToken(token).then((user) => {

    if (!user){
      return Promise.reject() //stops function and goes to catch block
    }
    req.user = user
    req.token = token
    next()
  }).catch((e) => {
    res.status(401).send()
  }) //model method
}

module.exports = {authenticate}
