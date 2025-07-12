const db = require("./db");
const User = require("./user");
const Poll = require("./poll");
const PollOption = require("./poll_option");
const PollVote = require("./poll_vote");

// Create one to many relationship between User and Poll
Poll.belongsTo(User, { foreignKey: {
  name: "creatorId",
  allowNull: false,
}});
User.hasMany(Poll, { as: "creator"});

// Create one to many relationship between Poll and PollOption
PollOption.belongsTo(Poll, { foreignKey: {
  name: "pollId",
  allowNull: false,
}});
Poll.hasMany(PollOption);

// Create (zero or one) to many relationship between User and PollVote
PollVote.belongsTo(User, { as: "voter", foreignKey: {
  name: "userId",
  allowNull: true,
}});
User.hasMany(PollVote);

// Create one to many relationship between PollOption and PollVote
PollVote.belongsTo(PollOption, { foreignKey: {
  name: "optionId",
  allowNull: false,
}});
PollOption.hasMany(PollVote);

// Create a one to many relationship between Poll and PollVote
PollVote.belongsTo(Poll, { foreignKey: {
  name: "pollId",
  allowNull: false,
}});

module.exports = {
  db,
  User,
  Poll,
  PollOption,
  PollVote,
};
