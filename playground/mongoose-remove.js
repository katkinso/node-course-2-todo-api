const {ObjectID} = require('mongodb')
const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

//DELETE - MULTI
// Todo.remove({}) //must have one thing to remove evenrything
// Todo.remove({}).then((res) => {
//   console.log(res)
// })
//
// Todo.findOneAndRemove({})
Todo.findByIdAndRemove('5a11d6b9e11fafcdb94415b1').then((todo) => {
  console.log(todo)
})
