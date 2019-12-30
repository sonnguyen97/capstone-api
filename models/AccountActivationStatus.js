const Sequelize = require("sequelize");
const db = require("../config/db");

const AccountActivationStatus = db.define(
  "AccountActivationStatus",
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

module.exports = AccountActivationStatus;
