const Sequelize = require("sequelize");
const db = require("../config/db");

const EmailTemplate = db.define(
  "EmailTemplate",
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
    body: {
      type: Sequelize.STRING,
      allowNull: false
    },
    raw_content: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

module.exports = EmailTemplate;
