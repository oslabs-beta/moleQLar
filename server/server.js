const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// static files
app.use(express.static(path.join(__dirname, "build")));

// Authorization Route
const authRouter = require("./routes/authRouter");
app.use("/api/auth", authRouter);

// Graph Routes
const graphRouter = require("./routes/graphRouter");
app.use("/api/graph", graphRouter);

// catch-all route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Global error handler:
app.use((err, req, res, next) => {
  console.log("GLOBAL ERROR HANDLER:", err);
  const defaultErr = {
    log: "Express error handler caught middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

module.exports = app;
