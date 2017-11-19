const { MongoClient, ObjectID } = require('mongodb') //destructure


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('unable to connect to db server')
  }
  console.log('Connected to mongodb server')

  //delete many ************
  // db.collection('Todos').deleteMany({text:'eat lunch'}).then((result) => {
  //   console.log(result)
  // })

  //delete one - find first match then stops
  // db.collection('Todos').deleteOne({text:'Walk the dog'}).then((result) => {
  //   console.log(result)
  // })

  //find one and delete
  //delete todo and return object back
  // db.collection('Todos').findOneAndDelete({completed:false}).then((result) => {
  //   console.log(result)
  // })

// ************** USERS **********************************************************>>>
  //delete many ************
  // db.collection('Users').deleteMany({name:'Kate Atkinson'}).then((result) => {
  //   console.log(result)
  // })

  //del sophie
  db.collection('Users').findOneAndDelete({
    _id: new ObjectID('5a10e54b50e6ef07ce097a13')
  }).then((result) => {
    console.log(result)
  })



  // db.close()
}) //connecs\ts to db - url db lives, callback fire after connection succeeded or failed
