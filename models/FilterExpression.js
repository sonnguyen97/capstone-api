const Sequelize = require("sequelize");
const db = require("../config/db");

const FilterExpression = db.define(
  "FilterExpression",
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    value: {
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

module.exports = FilterExpression;
