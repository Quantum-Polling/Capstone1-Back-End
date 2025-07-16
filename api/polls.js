const express = require("express");
const router = express.Router();
const { Poll, PollOption } = require("../database");

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

    // Validate that there are at least 2 options if the user is publishing
    if (pollInfo.options && pollInfo.options.length < 2 && pollInfo.status === "Open")
      return res.status(422).send({ message: "Not enough options to publish poll" });

    // Validate that this user doesn't already have a poll with this title
    const duplicate = await Poll.findOne({
      where: { 
        creatorId: pollInfo.creatorId,
        title: pollInfo.title 
      }
    });
    if (duplicate)
      return res.status(409).send({ message: "A poll with this title already exists for this user" });

    const poll = await Poll.create({
      title: pollInfo.title,
      description: pollInfo.description,
      status: pollInfo.status,
      closeDate: pollInfo.closeDate,
      authVotes: !pollInfo.open,
      creatorId: pollInfo.creatorId,
    });

    if (pollInfo.options) {
      const options = pollInfo.options.map((opt) => ({
        text: opt,
        pollId: poll.id
      }));
      await PollOption.bulkCreate(options);
    }

    if (pollInfo.status === "Draft")
      res.status(201).send({ message: "Successfully saved new poll draft" });
    else
      res.status(201).send({ message: "Successfully published new poll", pollId: poll.id });
  } catch (error) {
    res.status(500).send({ error: `Error creating new poll: ${error}` });
  }
});

// Edit a poll
router.patch("/:userId/:id", async (req, res) => {
  try {
    const pollInfo = req.body;
    const pollId = Number(req.params.id);
    const userId = Number(req.params.userId);
    const poll = await Poll.findByPk(pollId);
    
    // Validate that this user doesn't already have a poll with this title
    const duplicate = await Poll.findOne({
      where: { 
        creatorId: pollInfo.creatorId,
        title: pollInfo.title 
      }
    });
    if (duplicate)
      return res.status(409).send("A poll with this title already exists for this user");

    // Validate that the poll to be edited exists
    if (!poll)
      return res.status(404).send({ error: `Poll with ID ${pollId} not found` });

    // Validate that the user is allowed to edit this poll
    if (poll.creatorId !== userId)
      return res.status(403).send({ error: "You are not the creator of this poll and thus cannot edit it" });

    // Validate that the poll can be edited
    if (poll.status !== "Draft")
      return res.status(403).send({ error: `Poll with ID ${pollId} was already published and cannot be edited` });

    // Update the poll
    poll.update({
      title: pollInfo.title,
      description: pollInfo.description,
      status: pollInfo.status,
      closeDate: pollInfo.closeDate,
      authVotes: !pollInfo.open,
    });

    res.status(200).send({ message: "Succesfully updated poll" });
  } catch (error) {
    res.status(500).send({ error: `Error updating poll: ${error}` });
  }
});

module.exports = router;
