const express = require("express");
const router = express.Router();
const { Poll, PollOption, PollVote } = require("../database");
const { Sequelize } = require("sequelize");
const { authenticateJWT } = require("../auth");

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
    const result = await Poll.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: [
            ["firstName", "creatorFirstName"],
            ["lastName", "creatorLastName"],
          ],
        },
        {
          model: PollOption,
          as: [Sequelize.fn("COUNT", Sequelize.col("pollId"))],
        },
        {
          model: PollVote,
          where: { rank: 1 },
          as: [Sequelize.fn("COUNT", Sequelize.col("pollId"))],
        },
      ],
    });
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(501).send("Bad", error);
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
router.post("/", authenticateJWT, async (req, res) => {
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
router.patch("/:userId/edit/:id", authenticateJWT, async (req, res) => {
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

// Get the results of a poll
router.get("/:id/results", async (req, res) => {
  const id = req.params.id;
  try {
    // Verify that the poll exists
    const poll = await Poll.findByPk(id);
    if (!poll)
      return res.status(404).send({error: `Could not find poll with ID ${id}`});

    // Check if the results have already been calculated and stored
    // If so, return the results from the table
    // Otherwise run the calculation algorithm
  
    // Calculate the results
    // Get all of the options
    const options = await PollOption.findAll({ where: { pollId: id } });
    const numOptions = options.length;
    if (numOptions === 0)
      return res.status(404).send({error: `Could not find options for poll with ID ${id}`});

    // Keep track of their indexes for proper result tallying
    const optionIndexes = {};
    options.map((option, index) => (optionIndexes[option.id] = index));

    // Get all the votes
    const votes = await PollVote.findAll({
      where: { 
        pollId: id, 
        submitted: true 
      },
      order: [['userId'], ['rank']],
      attributes: [
        ['userId', 'voterId'],
        'rank',
        'optionId'
      ]
    })
    
    // Convert all votes into an array of ballots
    const ballots = [];
    const ballot = [];
    let currentVoterId = votes[0].dataValues.voterId;
    for (let i = 0; i < votes.length; i++) {
      const vote = votes[i].dataValues;
      // Push the current voter's ballot
      // and move to the next voter
      if (vote.voterId !== currentVoterId) {
        currentVoterId = vote.voterId;
        ballots.push([...ballot]);
        ballot.length = 0;
      }

      // Add the vote to the current voter's ballot
      ballot.push(vote.optionId);
    }
    ballots.push([...ballot]);

    // Create containers for eliminated options and final results
    let eliminated = new Set();
    //console.log(eliminated);
    const finalResults = []

    let finished = false;
    // For each round:
    while (!finished) {
      // Create a round results array initialized with as many 0s as there are options
      const roundResults = new Array(numOptions).fill(0);

      // For each ballot:
      for (const ballot of ballots) {
        // There is no option in the first slot, skip this ballot
        if (!ballot[0])
          continue;

        // While there is an option in the first slot of the ballot:
        while (ballot[0]) {
          // If the option has been eliminated, shift the array and check again
          if (eliminated.has(ballot[0])) {
            ballot.shift();
            continue;
          }
          // Otherwise increment the option's total in round results
          const index = optionIndexes[ballot[0]];
          roundResults[index]++;
          break;
        }
      }

      // After all ballots have been counted:
      // Push round results to results
      finalResults.push([...roundResults]);

      // If there is an option in round results with more than half the votes, end the calculation
      for (const total of roundResults) {
        if (total > ballots.length / 2) {
          finished = true;
          continue;
        }
      }

      // Otherwise get all the options with the least amount of votes
      const leastVoted = new Set();
      let leastVotes = -1;
      for (let i = 0; i < numOptions; i++) {
        // Skip already eliminated options
        if (eliminated.has(options[i].id)) {
          console.log(`Skipping ${options[i].id}`);
          continue;
        }

        const total = roundResults[i];
        // Tied for least amount of votes
        if (total === leastVotes)
          leastVoted.add(options[i].id);
        // New least amount of votes
        else if (leastVotes === -1 || total < leastVotes) {
          leastVotes = total;
          leastVoted.clear();
          leastVoted.add(options[i].id);
        }
      }

      // If the number of options with least votes is the same as the number of
      // remaining options, end the calculation
      if (leastVoted.size === 0 || leastVoted.size === numOptions - eliminated.size) {
        finished = true;
        continue;
      }

      // Otherwise add the newly eliminated options to the eliminated array
      eliminated = new Set([...eliminated, ...leastVoted]);
    }

    // Store the results
    // Return the results
    res.status(200).send(finalResults);
  } catch (error) {
    res.status(500).send({error: `Error getting the results of poll ${id}: ${error}`});
  }
});

module.exports = router;
