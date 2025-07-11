const db = require("./db");
const User = require("./user");
const Poll = require("./poll");

// Create one to many relationship between User and Poll
Poll.belongsTo(User, { as: "creator"});
User.hasMany(Poll, { foreignKey: {
  name: "creatorId",
  allowNull: false,
}});

module.exports = {
  db,
  User,
  Poll,
};
