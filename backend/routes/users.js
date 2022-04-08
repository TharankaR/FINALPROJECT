const router = require("express").Router();
// const User = require("../models/User");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const { v4: uuidv4 } = require("uuid");
// const register = async (dbName) => {
//create new client

//register
router.post("/register", async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  if (!req.body.password || !req.body.username || !req.body.email) {
    return res.status(400).json("Missing Information");
  }

  // //connect to client
  await client.connect();
  try {
    //generate new password (bcrypt, https://www.npmjs.com/package/bcrypt)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt); //will hash the password

    //create new user
    const newUser = {
      // _id: uuidv4(),
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    };

    const db = client.db("pin");
    //save user and send response
    // const user = await newUser.save();
    const user = await db.collection("users").insertOne(newUser);
    res.status(200).json(user._id);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
  client.close();
});
// };

//login
router.post("/login", async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  await client.connect();
  try {
    const db = client.db("pin");
    const user = await db
      .collection("users")
      .findOne({ username: req.body.username });
    //find user
    // const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json("Wrong username");
    }

    //validate password
    console.log(req.body.password);
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    console.log(validPassword);
    if (!validPassword) {
      return res.status(400).json("Wrong password!");
    }

    //send success response
    return res.status(200).json({ _id: user.id, username: user.username });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
