//should have express here cz in package says that
// (if you call it server then have to change it on package)

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const PORT = 8000;

const app = express();

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => console.log(err));

app.use(morgan("tiny"));
app.use(helmet());
app.use(cors());

// app.router...can use this to organize into other folders

app.listen(PORT, () => console.log(`Listening on ${PORT}`));