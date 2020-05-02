const mongoose = require('mongoose');

const mongoDB = `mongodb://${process.env.MONGO_HOST}/`;

mongoose.connection.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:')
);

mongoose.connect(mongoDB, {
  dbName: process.env.MONGO_DB_NAME,
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PASS,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

mongoose.Promise = global.Promise;

module.exports = mongoose;