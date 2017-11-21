var mongoose = require('mongoose')

//config mongoose
mongoose.Promise = global.Promise
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp')
mongoose.connect(process.env.MONGODB_URI)

module.exports = { mongoose }

// process.env.NODE_ENV - heroku sets to 'production' by default, 'development' - locally,
