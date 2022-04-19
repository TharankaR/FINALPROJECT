const router = require("express").Router();
const Pin = require("../models/Pin");

const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const ObjectId = require("mongodb").ObjectId;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

//create a pin
router.post("/", async (req, res) => {
  const newPin = new Pin(req.body); //send title, description and rating inside body
  newPin.likes = [];
  try {
    const savedPin = await newPin.save();
    res.status(200).json(savedPin);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all pins
router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find();
    // console.log(pins);
    res.status(200).json({ status: 200, data: pins, message: "success" });
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a pin
router.delete("/:_id/delete", async (req, res) => {
  const { _id } = req.params;
  const deletePins = await Pin.deleteOne({ _id });
  console.log(_id);
  console.log(deletePins);
  res.status(204).json({ status: 204, message: "deleted" });
});
//like a pin

//add _id to pins users
//increment numoflikes
router.patch("/:_id/like", async (req, res) => {
  // console.log(req.params);
  // console.log(req.body);
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const { _id } = req.params;
  const db = client.db("pin");

  const updatePin = await Pin.updateOne(
    { _id: new ObjectId(_id) },
    { $inc: { numOfLikes: req.body.numLike } }
  );
  if (req.body.numLike === 1) {
    const user = await db
      .collection("pins")
      .updateOne(
        { _id: new ObjectId(_id) },
        { $push: { likes: req.body.currentUserId } }
      );
    res.status(200).json({ message: "success" });
  } else {
    const user = await db
      .collection("pins")
      .updateOne(
        { _id: new ObjectId(_id) },
        { $pull: { likes: req.body.currentUserId } }
      );

    res.status(200).json({ message: "success" });
  }
});
module.exports = router;
