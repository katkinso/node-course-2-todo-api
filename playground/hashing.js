//SHA 256 - crypto.js
const {SHA256} = require('crypto-js') //playground only
const jwt = require(`jsonwebtoken`)

// npm i jsonwebtoken@7.1.9 --save
// jwt.sign - takes object and signs it (creates hash)
// jwt.verify - takes token and secret and makes sure the data was not manipulated

var data = {
  id: 10
}
var token = jwt.sign(data,'123abc') //produces a token and store in token array. checks the
console.log(token)
var decoded = jwt.verify(token, '123abc')
console.log('decoded', decoded)

// decoded { id: 10, iat: 1511310783 } Date/Time
// Data must be same decoded

//BAKGROUND INFO *********************************************
// var message = 'I am user number 3'
// var hash = SHA256(message).toString()
//
// console.log(`Message: ${message}`)
// console.log(`Hash: ${hash}`)
//
// //one way algo - always getting the same result, but cannot reverse hash
// //store pwds - salt and hash
// //sourceforge - file you downloaded is the one you wanted to get. Hashing.
// //prevent people from changing id of user by hashing
//
// //data send back to client - make sure client doesn't change to id 4 and delete for another user
// var data = {
//   id: 4
// }
//
// //create a token and salt the hash with a different salt every time eg: 'somesecret' so client cannot change locally
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// //EXAMPLE - MIM - Change token id = 5, but don't have the SALT
// token.data.id = 5
// token.hash = SHA256(JSON.stringify(token.data)).toString()
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString()
//
// if (resultHash === token.hash){
//   console.log(`Data was not changed`)
// }else{
//   console.log(`Data WAS changed. BAD`)
// }

//JWT!!! Instead
