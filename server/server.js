var express = require('express')
var bodyParser = require('body-parser')

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

  //findby id
    //success - if todo send it back, if no todo then call succesed & not found then send back 404 & eptyy
    //err - 400 & send empty body back


})

app.listen(3000, () => {
  console.log('started on port 3000')
})

module.exports = {app}
