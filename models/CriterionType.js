const Sequelize = require("sequelize");
const db = require("../config/db");

const CriterionType = db.define(
  "CriterionType",
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

module.exports = CriterionType;
