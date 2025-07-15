const express = require("express");
const router = express.Router();
const { Poll } = require("../database");

router.get("/", async (req, res) => {
  try {
    const result = await Poll.findAll();
    res.send(result);
  } catch (error) {
    res.status(501).send("Not Implemented");
  }
});

module.exports = router;
