const express = require("express");
const router = express.Router();
const { Poll, PollOption } = require("../database");

// Validates if the given poll can be published
// Returns an object with the boolean 'publishable' and
// an array 'errors' with any errors if not publishable
const isPublishable = async (poll) => {
  const response = {
    publishable: false,
    errors: []
  };
  
  // Only verify polls that are meant to be published
  if (poll.status !== "Open")
    response.errors = [...response.errors, "Poll is not marked to be published"];

  // Verify that there are at least two options
  if (!poll.options || poll.options.length < 2)
    response.errors = [...response.errors, "Not enough options to publish this poll"];

  // Verify that the user doesn't already have a poll with the given title
  const duplicate = await Poll.findOne({
      where: { 
        creatorId: poll.creatorId,
        title: poll.title 
      }
    });
  if (duplicate)
    response.errors = [...response.errors, "A poll with this title already exists for this user"];

  // Verify that the title, description, and options are all not empty
  if (!title.trim())
    response.errors = [...response.errors, "Title cannot be empty"];

  if (!description.trim())
    response.errors = [...response.errors, "Description cannot be empty"];

  for (let i = 0; i < poll.options.length; i++)
    if (!option[i].trim())
      response.errors = [...response.errors, `Option ${i + 1} cannot be empty`];
  
  // All verifications passed
  if (response.errors.length === 0)
    response.publishable = true;

  return response;
}

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
    // Published
    // Verify that there are at least two options
    // Verify that the user doesn't already have a poll with the given title
    // Verify that the title, description, and each option are not empty
    // Create new poll
    // Create new options

    // Draft
    // Fill any empty fields (title, description, or options) with placeholders
    // Create new poll
    // Create new options

    // Validate that there are at least 2 options if the user is publishing
    if (pollInfo.options && pollInfo.options.length < 2 && pollInfo.status === "Open")
      return res.status(422).send({ error: "Not enough options to publish poll" });

    // Validate that this user doesn't already have a poll with this title
    const duplicate = await Poll.findOne({
      where: { 
        creatorId: pollInfo.creatorId,
        title: pollInfo.title 
      }
    });
    if (duplicate)
      return res.status(409).send({ error: "A poll with this title already exists for this user" });

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
    
    // Verify Poll exists
    // Verify Poll is in draft state
    // Verify User is the creator of the Poll

    // Published
    // Verify that there are at least two options
    // Verify that the user doesn't already have a poll with the given title
    // Verify that the title, description, and each option are not empty
    // Update existing poll data
    // Update existing options text
    // - If more options exist in the database than were published, delete the extra ones
    // - If more options are published than exist in the database, add the new ones

    // Draft
    // Fill any empty fields (title, description, or options) with placeholders
    // Update existing poll data
    // Update existing options text
    // - If more options are published than exist in the database, add the new ones

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
