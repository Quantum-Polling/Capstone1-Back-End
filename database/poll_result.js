const { DataTypes } = require("sequelize");
const db = require("./db");

const PollResult = db.define("poll_result", {
  pollId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  round: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  optionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  totalVotes: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = PollResult;
