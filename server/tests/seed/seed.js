const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')
const {Todo} = require('./../../models/todo')
const {User} = require('./../../models/user')

var userOneId = new ObjectID()
var userTwoId = new ObjectID()

const users = [{
  _id: userOneId,
  password: 'userOnePass',
  email: 'userOne@test.com',
  tokens:[{
    access:'auth',
    token: jwt.sign({_id:userOneId, access:'auth'}, 'abc123').toString()
  }]
},{
  _id: userTwoId,
  password: 'userTwoPass',
  email: 'userTwo@test.com',
}]

const todos = [
  {
    _id: new ObjectID(),
    text: 'test todo 1'
  },
  {
    _id: new ObjectID(),
    text: 'test todo 2',
    completed: true,
    completeAt: 333
  }
]

const populateTodos = (done) => {
  Todo.remove().then(() => {
    return Todo.insertMany(todos)
  }).then(() => done())
}


const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save()
    var userTwo = new User(users[1]).save()

    return Promise.all([userOne, userTwo]).then(() => {

    }).then(() => done())


  })
}

module.exports = {todos, populateTodos, users, populateUsers}
