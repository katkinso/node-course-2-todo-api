const {ObjectID} = require('mongodb')
const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

// var todo_id = '5a11ac8ee657a51f3d579e44111'
var id = '5a10fe74af9068df0eb3d8a9'

// if (!ObjectID.isValid(id)){
//   console.log('id not valid')
// }

// Todo.find({_id: id}).then((todos) => {
//   console.log('todos: ', todos)
// })
//
// Todo.findOne({_id: id}).then((todo) => {
//   console.log('todo: ', todo)
// })

// Todo.findById(id).then((todo) => {
//   console.log('todo by id: ', todo)
// }).catch((e) => {
//   console.log(e)
// })

//find by id
//if user not found - not found
User.findById(id).then((user) => {
  if (!user) return console.log('User Not Found')
  console.log('User by id: ', JSON.stringify(user,undefined,2))

}).catch((e) => {
  console.log(e)
})


//print user
//errors
