const express = require("express");
const router = express.Router();
const { Poll } = require("../database");

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send("Missing userId");

    const result = await Poll.findAll({
      where: { creatorId: userId },
    });

    console.log("CAPCAP")
    console.log(result);

    res.send(result);
  } catch (error) {
    res.status(501).send("Not Implemented");
  }
});

module.exports = router;
