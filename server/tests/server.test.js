const expect = require('expect')
const request = require('supertest')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')


const todos = [
  {
    text: 'test todo 1'
  },
  {
    text: 'test todo 2'
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
      .expect(400)
      .expect((res) => { //gets passed response
         expect(res.body.length).toBe(2)
      })
      .end(done)
  })


})
