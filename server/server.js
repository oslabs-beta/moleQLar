const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Sequelize } = require('sequelize');
const authRoutes = require('./routes/auth.js');
const User = require('./models/User.js');
const db =  require("./models/userModels.js");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


// Creates a new Sequalize Instance w/ Parameters
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres',
})
// Test Connection to the Database
// sequelize.authenticate()
// .then(() => console.log('Database connected...'))
// .catch(err => console.log('Error ' = err));
// Sync the Database
sequelize.sync();

app.use('/auth', authRoutes);

app.get("/testdb", async (req, res) => {
  const result = await db.query("SELECT * FROM users LIMIT 1");
  console.log("result", result);
  res.status(200).json(result);
});

// Global error handler:
app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(3000, () => {
  console.log("listening on port 3000");
}); //listens on port 3000 -> http://localhost:3000/

module.exports = app;