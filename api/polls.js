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

// Create a new poll
router.post("/", async (req, res) => {
  try {
    const pollInfo = req.body;

    // Validate that this user doesn't already have a poll with this title
    const duplicate = await Poll.findOne({
      where: { 
        creatorId: pollInfo.creatorId,
        title: pollInfo.title 
      }
    });
    if (duplicate)
      return res.status(409).send("A poll with this title already exists for this user");

    const poll = await Poll.create({
      title: pollInfo.title,
      description: pollInfo.description,
      status: pollInfo.status,
      closeDate: pollInfo.closeDate,
      authVotes: !pollInfo.open,
      creatorId: pollInfo.creatorId,
    });

    if (pollInfo.status === "Draft")
      res.status(201).send({ message: "Successfully saved new poll draft" });
    else
      res.status(201).send({ message: "Successfully published new poll", pollId: poll.id });
  } catch (error) {
    res.status(500).send("Error creating new poll:", error);
  }
});

module.exports = router;
