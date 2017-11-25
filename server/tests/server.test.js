const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')
const {todos,populateTodos,users, populateUsers} = require('./seed/seed')

//testing lifecycle method - does before each test -
beforeEach(populateUsers)
beforeEach(populateTodos)


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


//Check users AUTH
describe('GET /users/me',() => {
    it('Should return user if authenticated', (done) => {
        request(app)
          .get('/users/me')
          .set('x-auth', users[0].tokens[0].token)
          .expect(200)
          .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString())
            expect(res.body.email).toBe(users[0].email)
          })
        .end(done)
    })

    it('Should return 401 if NOT authenticated', (done) => {
      //401 and body empty toEqual
      request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
          expect(res.body).toEqual({})
        })
      .end(done)
    })


})//AUTH - DESC End

//user create
describe('POST /users',() => {

    it('Should create a user', (done) => {

        var email = 'katestx@test.com'
        var password = 'password'

        request(app)
          .post('/users')
          .send({email, password})
          .expect(200)
          .expect((res) => {
            expect(res.headers['x-auth']).toExist()
            expect(res.body._id).toExist()
            expect(res.body.email).toBe(email)
          })
          .end((err) => {
            if(err) {
              return done(err)
            }

            User.findOne({email}).then((user) => {
              expect(user).toExist()
              expect(user.password).toNotBe(password)
              done()
            }).catch((e) => done(e))
          })

    })

    it('Should return validation errors if request invalid', (done) => {
        var email = 'katesttest.com'
        var password = 1
        request(app)
          .post('/users')
          .send({email, password})
          .expect(400)
          .end(done)

    })

    it('it should not create user if email in use', (done) => {

        var email = users[0].email

        request(app)
          .post('/users')
          .send({email})
          .expect(400)
          .end(done)

    })
})//AUTH - DESC End


//user create
describe('POST /users/login',() => {

    it('Should login user and return auth token', (done) => {

      request(app)
        .post('/users/login')
        .send({
          email: users[1].email,
          password: users[1].password,
        })
        .expect(200)
        .expect((res) =>{
          expect(res.headers['x-auth']).toExist()
        })
        .end((err,res) => {
          if(err){
            return done(err)
          }

          User.findById(users[1]._id).then((user) => {
            expect(user.tokens[0]).toInclude({
              access:'auth',
              token: res.headers['x-auth']
            })
            done()
          }).catch((e) => done(e))
        })
    })

    it('Should reject invalid login', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: users[1].email,
          password: 'wrongpassword!',
        })
        .expect(400)
        .expect((res) =>{
          expect(res.headers['x-auth']).toNotExist()
        })
        .end((err,res) => {
          if(err){
            return done(err)
          }

          User.findById(users[1]._id).then((user) => {
            expect(user.tokens.length).toBe(0)
            done()
          }).catch((e) => done(e))
        })
    })

})
