const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

// import routes
const app = express();
const port = 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

dotenv.config();

// connect to mongodb
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// routes
app.use("/api/users/card", require("./controllers/Card"));
app.use("/api/users", require("./controllers/User"));
