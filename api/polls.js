const express = require("express");
const router = express.Router();
const { Poll, PollOption } = require("../database");
const { Sequelize } = require("sequelize");

// Validates if the given poll can be published
// Returns an object with the boolean 'publishable' and
// an array 'errors' with any errors if not publishable
const isPublishable = async (poll, creatorId, pollId = -1) => {
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
        creatorId: creatorId,
        title: poll.title 
      }
    });
  if (duplicate && duplicate.id !== pollId)
    response.errors = [...response.errors, "A poll with this title already exists for this user"];

  // Verify that the title, description, and options are all not empty
  if (!poll.title.trim())
    response.errors = [...response.errors, "Title cannot be empty"];

  if (!poll.description.trim())
    response.errors = [...response.errors, "Description cannot be empty"];

  for (let i = 0; i < poll.options.length; i++)
    if (!poll.options[i].trim())
      response.errors = [...response.errors, `Option ${i + 1} cannot be empty`];
  
  // All verifications passed
  if (response.errors.length === 0)
    response.publishable = true;

  return response;
}

// Fills any empty fields with placeholder values
// This should only be done on polls saved as drafts
const fillEmptyFields = (poll) => {
  if (poll.status !== "Draft")
    return;

  if (!poll.title.trim())
    poll.title = "Untitled Poll";

  if (!poll.description.trim())
    poll.description = "[DRAFT]";

  for (let i = 0; i < poll.options.length; i++)
    if (!poll.options[i].trim())
      poll.options[i] = `[OPTION PLACEHOLDER ${i + 1}]`;
};

// Formats the array of options as objects ready for database insertion
// Returns the array of formatted options
const formattedOptions = (options, pollId) => {
  return options.map((option) => ({
    text: option,
    pollId: pollId
  }));
}

router.get("/", async (req, res) => {
  try {
    const result = await Poll.findAll();
    res.send(result);
  } catch (error) {
    res.status(501).send("Not Implemented");
  }
});

// Get a poll by id
router.get("/:id", async (req, res) => {
  const pollId = Number(req.params.id);
  try {
    const rawPoll = await Poll.findByPk(pollId, {
      include: {
        model: PollOption,
        attributes: ['text'],
      },
      order: [
        [{ model: PollOption }, Sequelize.col('id')],
      ]
    });
    
    // Validate that the poll exists
    if (!rawPoll)
      return res.status(404).send({ error: `Poll with ID ${pollId} not found` });
    
    const poll = rawPoll.toJSON();
    res.status(200).send({ message: `Successfully retrieved poll`, poll: poll});
  } catch (error) {
    res.status(500).send({ error: `Error getting poll with ID ${pollId}: ${error}` });
  }
});

// Create a new poll
router.post("/", async (req, res) => {
  try {
    const pollInfo = req.body;

    // Poll is set to be published
    if (pollInfo.status === "Open") {
      // Validate that the poll can be published
      const publishability = await isPublishable(pollInfo, pollInfo.creatorId);
      if (!(publishability.publishable))
        return res.status(422).send({errors: publishability.errors});
    } 
    // Poll is set to be saved as a draft
    else {
      // Fill any empty fields (title, description, or options) with placeholders
      fillEmptyFields(pollInfo);
    }

    // Create new poll
    const poll = await Poll.create({
      title: pollInfo.title,
      description: pollInfo.description,
      status: pollInfo.status,
      close_date: pollInfo.closeDate,
      authVotes: !pollInfo.open,
      creatorId: pollInfo.creatorId,
    });
    
    // Create new options
    if (pollInfo.options) {
      const options = formattedOptions(pollInfo.options, poll.id);
      await PollOption.bulkCreate(options);
    }

    if (pollInfo.status === "Draft")
      res.status(201).send({ message: "Successfully saved new poll draft", pollId: poll.id });
    else
      res.status(201).send({ message: "Successfully published new poll", pollId: poll.id });
  } catch (error) {
    res.status(500).send({ error: `Error creating new poll: ${error}` });
  }
});

// Edit a poll
router.patch("/:userId/edit/:id", async (req, res) => {
  try {
    const newPollInfo = req.body;
    const pollId = Number(req.params.id);
    const userId = Number(req.params.userId);
    const poll = await Poll.findByPk(pollId);
    
    // Validate that the poll to be edited exists
    if (!poll)
      return res.status(404).send({ error: `Poll with ID ${pollId} not found` });
    
    // Validate that the poll can be edited
    if (poll.status !== "Draft")
      return res.status(403).send({ error: `Poll with ID ${pollId} was already published and cannot be edited` });
    
    // Validate that the user is allowed to edit this poll
    if (poll.creatorId !== userId)
      return res.status(403).send({ error: "You are not the creator of this poll and thus cannot edit it" });

    // Poll is set to be published
    if (newPollInfo.status === "Open") {
      // Validate that the poll can be published
      const publishability = await isPublishable(newPollInfo, userId, pollId);
      if (!(publishability.publishable))
        return res.status(422).send({errors: publishability.errors});
    }
    // Poll is set to be saved as a draft
    else {
      // Fill any empty fields (title, description, or options) with placeholders
      fillEmptyFields(newPollInfo);
    }
    
    // Update the existing poll's options
    await poll.update({
      title: newPollInfo.title,
      description: newPollInfo.description,
      status: newPollInfo.status,
      close_date: newPollInfo.closeDate,
      authVotes: !newPollInfo.open,
    });

    // Format the options to be saved
    const newOptions = formattedOptions(newPollInfo.options, pollId);

    // Get the existing options
    const existingOptions = await PollOption.findAll({ where: { pollId: pollId }});

    // Update options
    let i = 0;
    while (i < existingOptions.length){
      // Update existing options text
      if (i < newOptions.length)
        existingOptions[i].update({ text: newOptions[i].text });
      // Delete extraneous existing options (for polls to be published only)
      else if (newPollInfo.status === "Open")
        existingOptions[i].destroy();
      
      i++;
    }

    // Create any remaining new options
    if (i < newOptions.length)
      await PollOption.bulkCreate(newOptions.slice(i));

    res.status(200).send({ message: "Succesfully updated poll" });
  } catch (error) {
    res.status(500).send({ error: `Error updating poll: ${error}` });
  }
});

module.exports = router;
