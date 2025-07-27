const express = require("express");
const router = express.Router();
const { User, Poll, PollOption, PollVote, PollResult } = require("../database");
const { Sequelize } = require("sequelize");
const { authenticateJWT } = require("../auth");

// Validates if the given poll can be published
// Returns an object with the boolean 'publishable' and
// an array 'errors' with any errors if not publishable
const isPublishable = async (poll, creatorId, pollId = -1) => {
  const response = {
    publishable: false,
    errors: [],
  };

  // Only verify polls that are meant to be published
  if (poll.status !== "Open")
    response.errors = [
      ...response.errors,
      "Poll is not marked to be published",
    ];

  // Verify that there are at least two options
  if (!poll.options || poll.options.length < 2)
    response.errors = [
      ...response.errors,
      "Not enough options to publish this poll",
    ];

  // Verify that the user doesn't already have a poll with the given title
  const duplicate = await Poll.findOne({
    where: {
      creatorId: creatorId,
      title: poll.title,
    },
  });
  if (duplicate && duplicate.id !== pollId)
    response.errors = [
      ...response.errors,
      "A poll with this title already exists for this user",
    ];

  // Verify that the title, description, and options are all not empty
  if (!poll.title.trim())
    response.errors = [...response.errors, "Title cannot be empty"];

  if (!poll.description.trim())
    response.errors = [...response.errors, "Description cannot be empty"];

  for (let i = 0; i < poll.options.length; i++)
    if (!poll.options[i].trim())
      response.errors = [...response.errors, `Option ${i + 1} cannot be empty`];

  // All verifications passed
  if (response.errors.length === 0) response.publishable = true;

  return response;
};

// Fills any empty fields with placeholder values
// This should only be done on polls saved as drafts
const fillEmptyFields = (poll) => {
  if (poll.status !== "Draft") return;

  if (!poll.title.trim()) poll.title = "Untitled Poll";

  if (!poll.description.trim()) poll.description = "[DRAFT]";

  for (let i = 0; i < poll.options.length; i++)
    if (!poll.options[i].trim())
      poll.options[i] = `[OPTION PLACEHOLDER ${i + 1}]`;
};

// Formats the array of options as objects ready for database insertion
// Returns the array of formatted options
const formattedOptions = (options, pollId) => {
  return options.map((option) => ({
    text: option,
    pollId: pollId,
  }));
};

// Formats data retrieved from the PollResults table into a 2D array
// of results per round. Returns the formatted 2D array
const formatResultsFromTable = (rawResults) => {
  const finalResults = [];
  const roundResults = [];

  let currentRound = 1;
  for (const result of rawResults) {
    if (result.round !== currentRound) {
      currentRound = result.round;
      finalResults.push([...roundResults]);
      roundResults.length = 0;
    }
    roundResults.push(result.totalVotes);
  }
  finalResults.push(roundResults);

  return finalResults;
}

// Formats calculated result data for insertion into the PollResults table
// Returns an array of formatted result objects
const formatResultsForTable = (calculatedResults, options, pollId) => {
  const results = [];

  for (let i = 0; i < calculatedResults.length; i++) {
    const round = i + 1;
    for (let j = 0; j < calculatedResults[i].length; j++) {
      const optionId = options[j].id;
      const totalVotes = calculatedResults[i][j];
      const result = {
        pollId: pollId,
        round: round,
        optionId: optionId,
        totalVotes: totalVotes,
      }
      results.push(result);
    }
  }

  return results;
};

router.get("/mypolls", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send("Missing userId");

    const result = await Poll.findAll({
      where: { creatorId: userId },
    });

    res.send(result);
  } catch (error) {
    res.status(501).send("Not Implemented");
  }
});

// Get all polls, including number of options and votes
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
          required: false,
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
      attributes: {
        include: [
          [
            Sequelize.fn("concat", 
              Sequelize.col("creator.firstName"),
              " ",
              Sequelize.col("creator.lastName"),
            ), 
            "creatorName"
          ],
        ]
      },
      include: [
        {
          model: User,
          as: "creator",
          attributes: [],
        },
        {
          model: PollOption,
          attributes: ["text"],
        },
      ],
      order: [[{ model: PollOption }, Sequelize.col("id")]],
    });

    // Validate that the poll exists
    if (!rawPoll)
      return res
        .status(404)
        .send({ error: `Poll with ID ${pollId} not found` });

    const poll = rawPoll.toJSON();
    res
      .status(200)
      .send({ message: `Successfully retrieved poll`, poll: poll });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: `Error getting poll with ID ${pollId}: ${error}` });
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
      if (!publishability.publishable)
        return res.status(422).send({ errors: publishability.errors });
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
      res.status(201).send({
        message: "Successfully saved new poll draft",
        pollId: poll.id,
      });
    else
      res
        .status(201)
        .send({ message: "Successfully published new poll", pollId: poll.id });
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
      return res
        .status(404)
        .send({ error: `Poll with ID ${pollId} not found` });

    // Validate that the poll can be edited
    if (poll.status !== "Draft")
      return res.status(403).send({
        error: `Poll with ID ${pollId} was already published and cannot be edited`,
      });

    // Validate that the user is allowed to edit this poll
    if (poll.creatorId !== userId)
      return res.status(403).send({
        error: "You are not the creator of this poll and thus cannot edit it",
      });

    // Poll is set to be published
    if (newPollInfo.status === "Open") {
      // Validate that the poll can be published
      const publishability = await isPublishable(newPollInfo, userId, pollId);
      if (!publishability.publishable)
        return res.status(422).send({ errors: publishability.errors });
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
    const existingOptions = await PollOption.findAll({
      where: { pollId: pollId },
    });

    // Update options
    let i = 0;
    while (i < existingOptions.length) {
      // Update existing options text
      if (i < newOptions.length)
        existingOptions[i].update({ text: newOptions[i].text });
      // Delete extraneous existing options (for polls to be published only)
      else if (newPollInfo.status === "Open") existingOptions[i].destroy();

      i++;
    }

    // Create any remaining new options
    if (i < newOptions.length) await PollOption.bulkCreate(newOptions.slice(i));

    res.status(200).send({ message: "Succesfully updated poll" });
  } catch (error) {
    res.status(500).send({ error: `Error updating poll: ${error}` });
  }
});

// Delete a draft poll
router.delete("/:userId/delete/:id", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const pollId = Number(req.params.id);

    const rawPoll = await Poll.findByPk(pollId);
    if (!rawPoll)
      return res.status(404).send({ 
        error: `Error deleting draft: Poll with ID ${pollId} not found`
      });
  
    const poll = rawPoll.toJSON();
    console.log(`USER: ${userId} | POLL:`, poll);
    if (poll.creatorId !== userId)
      return res.status(403).send({ 
        error: `Error deleting draft: You are not the owner of the poll with ID ${pollId}`
      });
    
    if (poll.status !== "Draft")
      return res.status(403).send({ 
        error: `Error deleting draft: Cannot delete poll with ID ${pollId} because it is not a draft`
      });

    await rawPoll.destroy();
    res.status(200).send({ message: `Successfully deleted poll with ID ${pollId}` });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: `Error deleting draft: ${error}` });
  }
});

// Get the results of a poll
router.get("/:id/results", async (req, res) => {
  const id = Number(req.params.id);
  try {
    // Verify that the poll exists
    const poll = await Poll.findByPk(id, {
      include: {
        model: PollOption,
        where: {
          pollId: id,
        }
      }
    });
    if (!poll)
      return res.status(404).send({error: `Could not find poll with ID ${id}`});
    
    // Verify that the poll is in the closed state
    if (poll.status !== "Closed")
      return res.status(403).send({error: `Poll with ID ${id} has not closed yet!`});
    
    // Extract the options
    const options = poll.poll_options;
    const numOptions = options.length;
    if (numOptions === 0)
      return res.status(404).send({error: `Could not find options for poll with ID ${id}`});
    
    // Verify if the results have already been calculated and stored
    const rawResults = await PollResult.findAll({
      where: { pollId: id },
      order: ['round', 'optionId'],
    });
    
    // If so, return the formatted results from the table
    if (rawResults.length !== 0) {
      const results = formatResultsFromTable(rawResults);
      return res.status(200).send({
        message: `Successfully retrieved results for poll with ID ${id}`,
        results: results,
      });
    }
    
    // Otherwise, run the calculation algorithm
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
    
    // Format the ballots
    const ballots = [];
    const ballot = [];
    let currentVoterId = votes[0]?.dataValues.voterId;
    for (const voteData of votes) {
      const vote = voteData.dataValues;
      if (vote.voterId !== currentVoterId) {
        currentVoterId = vote.voterId;
        ballots.push([...ballot]);
        ballot.length = 0;
      }
      
      ballot.push(vote.optionId);
    }
    ballots.push([...ballot]);
    
    let eliminated = new Set();
    const finalResults = [];
    
    // Loop through each round's calculation:
    round: while (true) {
      const roundResults = new Array(numOptions).fill(0);
      
      for (const ballot of ballots) {
        // Check the top option of each ballot
        while (ballot[0]) {
          // Remove elimanted options from top of ballot
          if (eliminated.has(ballot[0])) {
            ballot.shift();
            continue;
          }

          // Add vote for top option
          const index = optionIndexes[ballot[0]];
          roundResults[index]++;
          break;
        }
      }
      const activeBallots = ballots.filter((ballot) => (ballot.length > 0));
      
      finalResults.push([...roundResults]);
      
      // Check for winner
      for (const total of roundResults)
        if (total > activeBallots.length / 2)
          break round;
        
      // Check for least voted option(s)
      const leastVoted = new Set();
      let leastVotes = -1;
      for (let i = 0; i < numOptions; i++) {
        // Skip already eliminated options
        if (eliminated.has(options[i].id))
          continue;
        
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
      
      // Check for tie among all remaining options
      if (leastVoted.size === numOptions - eliminated.size)
        break round;
      
      eliminated = new Set([...eliminated, ...leastVoted]);
    }
    
    // Store the results
    const pollResults = formatResultsForTable(finalResults, options, id);
    await PollResult.bulkCreate(pollResults);
    
    // Return the results
    res.status(200).send({
      message: `Successfully calculated and stored results`, 
      results: finalResults,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({error: `Error getting the results of poll ${id}: ${error}`});
  }
});

router.post("/:userId/vote/:id", authenticateJWT, async (req, res) => {});

module.exports = router;
