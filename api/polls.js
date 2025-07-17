const express = require("express");
const router = express.Router();
const { Poll, PollOption, User, PollVote } = require("../database");
const { Sequelize } = require("sequelize");

// router.get("/", async (req, res) => {
//   try {
//     const result = await Poll.findAll();
//     res.send(result);
//   } catch (error) {
//     res.status(501).send("Not Implemented");
//   }
// });

router.get("/", async (req, res) => {
  try {
    const result = await Poll.findAll({
      include: {
        model: User,
        as: "creator",
        attributes: [
          ["firstName", "creatorFirstName"],
          ["lastName", "creatorLastName"],
        ],
      },

      include: {
        model: PollOption,
        as: "options"[
          (Sequelize.fn("COUNT", Sequelize.col("options.pollId")),
          "totalOptions")
        ],
      },
    });
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(501).send("Bad", error);
  }
});

module.exports = router;
