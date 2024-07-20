const path = require('path');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// static files
app.use(express.static(path.join(__dirname, 'build')));

// graphQL
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}));

// Authorization Route
const authRouter = require('./routes/authRouter');
app.use('/api/auth', authRouter);

// Graph Routes
const graphRouter = require('./routes/graphRouter');
app.use('/api/graph', graphRouter);


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Global error handler:
app.use((err, req, res, next) => {
  console.log('GLOBAL ERROR HANDLER:', err);
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