const { DataTypes } = require("sequelize");
const db = require("./db");

const PollOption = db.define("poll_option", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
        notEmpty: true,
    },
  },
  finalRanking: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
});

module.exports = PollOption;
