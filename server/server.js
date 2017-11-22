require('./config/config')

const port = process.env.PORT

const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')

const {ObjectID} = require('mongodb')
var { mongoose } = require('./db/mongoose')
var { Todo } = require('./models/todo')
var { User } = require('./models/user')

var app = express()
app.use(bodyParser.json()) //middleware

app.post('/todos',(req,res) => {
  // console.log(req.body)
  var todo = new Todo({
    text:req.body.text
  })
  todo.save().then((doc) =>{
    res.send(doc)
  },(e)=> {
    res.status(400).send(e)
  })
})

app.get('/todos',(req,res) =>{
   Todo.find().then((todos) => {
      res.send({ todos })
   },(e) => {
      res.status(400).send(e)
   })
})

//var id = '5a11ac8ee657a51f3d579e44'
app.get('/todos/:id',(req,res) => {
  // res.send(req.params) //get value from req get
  //validate id using isvalidid is not stop and respond with 404 - send empty body
  //findby id
    //success - if todo send it back, if no todo then call succesed & not found then send back 404 & eptyy
    //err - 400 & send empty body back

  var id = req.params.id
  if(!ObjectID.isValid(id)){
    return res.status(404).send()
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send()
    }
    res.send({todo})

  },(e) => {
    res.status(400).send()
  })
}) //GET by ID

app.delete('/todos/:id',(req,res) => {
  var id = req.params.id
  if(!ObjectID.isValid(id)){
    return res.status(404).send()
  }

  Todo.findByIdAndRemove(id).then((todo) => {
     if(!todo){
       return res.status(404).send('404 Not Found')
     }
     res.send({todo})
  }).catch((e) => {
    res.status(400).send()
  })

}) //DEL by ID

//only updating some items
app.patch('/todos/:id',(req, res) => {
    var id = req.params.id
    var body = _.pick(req.body,['text','completed']) //pick subset of items user passed

    if(!ObjectID.isValid(id)){
      return res.status(404).send()
    }

    //updated completedAt
    if (_.isBoolean(body.completed) && body.completed){
      body.completedAt = new Date().getTime()
    }else{
      body.completed = false
      body.completedAt = null
    }

    //update DB - Mongoose
    Todo.findByIdAndUpdate(id, {$set:body}, {new:true}).then((todo) => {
        if (!Todo){
          return res.status(404).send()
        }
        res.send({todo})

    }).catch((e) => {
      res.status(400).send()
    })

})
//User - model method. User.findByToken is a custom model method
//user.generateAuthToken - method on instance of user.

//POST to users & user _.Pick to get properties (email and pwd for body var)
app.post('/users',(req,res) => {

  var body = _.pick(req.body, ['email', 'password'])
  var user = new User(body)
  //
  user.save().then(() => {
    return user.generateAuthToken()
  //   // res.send(doc)
  }).then((token) => {
    res.header('x-auth', token).send(user)
  }).catch((e) => {
    res.status(400).send(e)
  })
})

app.listen(port, () => {
  console.log(`started on port ${port}`)
})

module.exports = {app}
