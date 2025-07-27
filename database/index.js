const db = require("./db");
const User = require("./user");
const Poll = require("./poll");
const PollOption = require("./poll_option");
const PollVote = require("./poll_vote");
const PollResult = require("./poll_result");

// Create one to many relationship between User and Poll
User.hasMany(Poll, {
  foreignKey: {
    name: "creatorId",
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "polls",
});
Poll.belongsTo(User, {
  as: "creator",
  foreignKey: "creatorId",
});

// Create one to many relationship between Poll and PollOption
Poll.hasMany(PollOption, {
  foreignKey: {
    name: "pollId",
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
PollOption.belongsTo(Poll, {
  foreignKey: "pollId",
});

// Create (zero or one) to many relationship between User and PollVote
User.hasMany(PollVote, {
  foreignKey: {
    name: "userId",
    allowNull: true,
  },
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
PollVote.belongsTo(User, {
  as: "voter",
  foreignKey: "userId",
});

// Create one to many relationship between PollOption and PollVote
PollOption.hasMany(PollVote, {
  foreignKey: {
    name: "optionId",
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
PollVote.belongsTo(PollOption, {
  foreignKey: "optionId",
});

// Create a one to many relationship between Poll and PollVote
Poll.hasMany(PollVote, {
  foreignKey: {
    name: "pollId",
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
PollVote.belongsTo(Poll, {
  foreignKey: "pollId",
});

// Create a one to many relationship between Poll and PollResult
Poll.hasMany(PollResult, {
  foreignKey: "pollId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
PollResult.belongsTo(Poll, {
  foreignKey: "pollId",
});

// Create a one to many relationship between PollOption and PollResult
PollOption.hasMany(PollResult, {
  foreignKey: "optionId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
PollResult.belongsTo(PollOption, {
  foreignKey: "optionId",
});

module.exports = {
  db,
  User,
  Poll,
  PollOption,
  PollVote,
  PollResult,
};
