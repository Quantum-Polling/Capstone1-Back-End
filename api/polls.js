const express = require("express");
const router = express.Router();
const { Poll, PollOption, User, PollVote } = require("../database");
const { Sequelize } = require("sequelize");

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

module.exports = router;
