const db = require("./db");
const User = require("./user");
const Poll = require("./poll");
const PollOption = require("./poll_option");

// Create one to many relationship between User and Poll
Poll.belongsTo(User, { as: "creator"});
User.hasMany(Poll, { foreignKey: {
  name: "creatorId",
  allowNull: false,
}});

// Create one to many relationship between Poll and PollOption
PollOption.belongsTo(Poll);
Poll.hasMany(PollOption, {foreignKey: {
  name: "pollId",
  allowNull: false,
}});

module.exports = {
  db,
  User,
  Poll,
  PollOption,
};
