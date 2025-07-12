const { DataTypes } = require("sequelize");
const db = require("./db");
const bcrypt = require("bcrypt");

const User = db.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  auth0Id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatarURL: {
    type: DataTypes.STRING,
    defaultValue: "https://static.thenounproject.com/png/5100711-200.png",
    validate: {
      isUrl: true,
    },
  },
  role: {
    type: DataTypes.ENUM("User", "Admin"),
    defaultValue: "User",
  }
});

// Instance method to check password
User.prototype.checkPassword = function (password) {
  if (!this.passwordHash) {
    return false; // Auth0 users don't have passwords
  }
  return bcrypt.compareSync(password, this.passwordHash);
};

// Class method to hash password
User.hashPassword = function (password) {
  return bcrypt.hashSync(password, 10);
};

module.exports = User;
