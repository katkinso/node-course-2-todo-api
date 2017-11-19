const { MongoClient, ObjectID } = require('mongodb') //destructure


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('unable to connect to db server')
  }
  console.log('Connected to mongodb server')

  //find one and update - todo
  // db.collection('Todos').findOneAndUpdate(
  //   {
  //    _id: new ObjectID('5a10ed54e11fafcdb94386b8')
  //   },
  //   {
  //     $set: { completed:true }
  //   },
  //   {
  //     returnOriginal:false
  //   }
  //   ).then((result) => {
  //     console.log(result)
  //   })
  //

    //USERS - update using inc
    db.collection('Users').findOneAndUpdate(
      {
       _id: new ObjectID('5a10e5572800e307cf5d9dce')
      },
      {
        $set: { name: 'Kate Atkinson' },
        $inc: {age: 1 }
      },
      {
        returnOriginal:false
      }
      ).then((result) => {
        console.log(result)
      })

  // db.close()
}) //connecs\ts to db - url db lives, callback fire after connection succeeded or failed
