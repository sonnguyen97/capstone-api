const Sequelize = require("sequelize");
const db = require("../config/db");

const SubscriberType = db.define(
  "SubscriberType",
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

module.exports = SubscriberType;
