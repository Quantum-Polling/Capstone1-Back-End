const { DataTypes } = require("sequelize");
const db = require("./db");

const Poll = db.define("poll", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Draft", "Open", "Closed"),
    defaultValue: "Draft",
    allowNull: false,
  },
  close_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  authVotes: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
});

module.exports = Poll;
