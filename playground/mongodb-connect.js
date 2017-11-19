// const MongoClient = require('mongodb').MongoClient
const { MongoClient, ObjectID} = require('mongodb') //destructure
//new object id's on fly
var obj = new ObjectID()
console.log(obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('unable to connect to db server')
  }
  console.log('Connected to mongodb server')
  // db.collection('Todos').insertOne({
  //   text:'something to do',
  //   completed: false
  // },(err,res) => {
  //
  //   if (err){
  //     return console.log('cannot insert todo', err)
  //   }
  //   console.log(JSON.stringify(res.ops,undefined,2))
  // })

  //insert users
  // db.collection('Users').insertOne({
  //   name:'Kate Atkinson',
  //   age: 2,
  //   location: 'San Francisco'
  // },(err,res) => {
  //
  //   if (err){
  //     return console.log('cannot insert user', err)
  //   }
  //   console.log(res.ops[0]._id.getTimestamp())
  // })

  db.close()
}) //connecs\ts to db - url db lives, callback fire after connection succeeded or failed
