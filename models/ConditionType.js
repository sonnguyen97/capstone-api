const Sequelize = require("sequelize");
const db = require("../config/db");

const ConditionType = db.define(
  "ConditionType",
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

module.exports = ConditionType;
