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

  //returns a cursor not docs -> pointer to the docs and has methods
  //toArray gets docs and returns a promise
  //cannot just pass in id
  // db.collection('Todos').find({
  //   _id: new ObjectID('5a10703dc2af4f826b8741e9')
  // }).toArray().then((docs) => {
  //   console.log('Todos')
  //   console.log(JSON.stringify(docs, undefined, 2))
  // },(err) => {
  //   console.log('cannot get todos',err)
  // })

  //********
  // db.collection('Todos').find().count().then((count) => {
  //   console.log('Todos')
  //   console.log(`count: ${count}`)
  // },(err) => {
  //   console.log('cannot get todos',err)
  // })
  //********

  //******
  //returns a cursor not docs -> pointer to the docs and has methods
  //toArray gets docs and returns a promise
  db.collection('Users').find({name:'Kate Atkinson'}).toArray().then((docs) => {
    console.log('Users with name Kate Atkinson')
    console.log(JSON.stringify(docs, undefined, 2))
  },(err) => {
    console.log('cannot get users',err)
  })

  // db.close()
}) //connecs\ts to db - url db lives, callback fire after connection succeeded or failed
