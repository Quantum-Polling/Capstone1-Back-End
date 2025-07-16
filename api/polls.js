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

// Publish a new poll
router.post("/", async (req, res) => {
  try {
    const pollInfo = req.body;

    const newPoll = await Poll.create({
      title: pollInfo.title,
      description: pollInfo.description,
      status: "Open",
      closeDate: pollInfo.closeDate ? pollInfo.closeDate : null,
      authVotes: !pollInfo.open,
      creatorId: pollInfo.creatorId,
    });

    res.status(201).send({ pollId: newPoll.id });
  } catch (error) {
    res.status(500).send("Error creating new poll:", error);
  }
});

module.exports = router;
