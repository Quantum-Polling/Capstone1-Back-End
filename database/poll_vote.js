const { DataTypes, ValidationError } = require("sequelize");
const db = require("./db");
const PollOption = require("./poll_option");

const PollVote = db.define("poll_vote", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rank: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  submitted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
}, 
{
  indexes: [
    {
      unique: true,
      fields: ['userId', 'optionId'],
    },
    {
      unique: true,
      fields: ['userId', 'pollId', 'rank'],
    }
  ],
  validate: {
    async matchOptionToPoll() {
      const option = await PollOption.findByPk(this.optionId);
      if (this.pollId !== option.pollId)
        throw new ValidationError("Option does not belong to the specified poll");
    }
  }
}
);

module.exports = PollVote;
