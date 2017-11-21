const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')


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


beforeEach((done) => {
  Todo.remove().then(() => {
    return Todo.insertMany(todos)
  }).then(() => done())
})

//testing lifecycle method - does before each test -
// beforeEach((done) => {
//   Todo.remove().then(() => done ())
// })


describe('POST /todos',() => {

  it('Should create a new todo', (done) => {
    var text = 'todo text test'

    //attach the app and send request
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => { //gets passed response
         expect(res.body.text).toBe(text)
      })
      .end((err,res) => {
        if(err){
          return done(err) //ends and stops execution
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1)
          expect(todos[0].text).toBe(text)
          done()
        }).catch((e) => done(e))
      })

    })//it todo


    it('Should not create a todo', (done) => {
        request(app)
          .post('/todos')
          .send({})
          .expect(400)
          .end((err,res) => {
            if(err){
               return done(err)
            }

            Todo.find().then((todos) => {
              expect(todos.length).toBe(2)
              done()
            }).catch((e) => done(e))
          })

    })

})//desc POST
// ***********


describe('GET /todos',() => {

  it('Should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => { //gets passed response
         expect(res.body.todos.length).toBe(2)
      })
      .end(done)
  })
})//desc GET

//
//GET a todo
  describe('GET /todos/:id',() => {

    it('Should get todo doc', (done) => {
      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => { //gets passed response
           expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done)
    })//it end

    it('Should return 404 if todo not found', (done) => {
      var hexId = new ObjectID().toHexString()

      request(app)
        .get(`/todos/${hexId}`)
        .expect(404)
        .end(done)
    })//it end

    it('Should return 404 if invalid id', (done) => {
      request(app)
        .get(`/todos/badid`)
        .expect(404)
        .end(done)
    })//it end

})//desc GET



  //POST a todo
  describe('DELETE /todos/:id',() => {

    it('Should remove a todo', (done) => {

      var hexId = todos[0]._id.toHexString()

      request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo._id).toBe(hexId)
        })
        .end((err,res) => {
          if (err){
            return done(err)
          }

          Todo.findById(hexId).then((todo) => {
            expect(todo).toNotExist()
            done()
          }).catch((e) => done(e))
      })
    })//it end


    it('Should return 404 if todo not found', (done) => {
      var hexId = new ObjectID().toHexString()

      request(app)
        .delete(`/todos/${hexId}`)
        .expect(404)
        .end(done)
    })//it end

    it('Should return 404 if onject id is invalid', (done) => {
      request(app)
        .delete('/todos/badid')
        .expect(404)
        .end(done)
    })//it end


}) //DELETE - desc end


//PATCH a todo
describe('PATCH /todos/:id',() => {

  it('Should update the todo', (done) => {

    var hexId = todos[0]._id.toHexString()
    var body = {
      "text":  'Test suite text - 1',
      "completed" : true
    }

    request(app)
      .patch(`/todos/${hexId}`)
      .send(body)
      .expect(200)
      .expect((res) => { //gets passed response
         expect(res.body.todo.text).toBe(body.text)
         expect(res.body.todo.completed).toBe(true)
         expect(res.body.todo.completedAt).toBeA('number')
      })
      .end(done)

  })//it end

  it('Should clear completedAt when todo is not completed', (done) => {
    var hexId = todos[1]._id.toHexString()
    var body = {
      "text":  'Test suite text - 2',
      "completed" : false
    }

    request(app)
      .patch(`/todos/${hexId}`)
      .send(body)
      .expect(200)
      .expect((res) => { //gets passed response
         expect(res.body.todo.text).toBe(body.text)
         expect(res.body.todo.completed).toBe(false)
         expect(res.body.todo.completedAt).toNotExist()
      })
      .end(done)

  })//it end



})//PATCH - DESC End
