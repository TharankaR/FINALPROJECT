const router = require("express").Router();
const Pin = require("../models/Pin");

//create a pin
router.post("/", async (req, res) => {
  const newPin = new Pin(req.body); //send title, description and rating inside body
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
    console.log(pins);
    res.status(200).json({ status: 200, data: pins, message: "success" });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
