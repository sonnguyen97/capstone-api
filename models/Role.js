const Sequelize = require("sequelize");
const db = require("../config/db");

/**
 * @swagger
 * definitions:
 *  Role:
 *   type: object
 *   properties:
 *    id:
 *     type: integer
 *    name:
 *     type: string
 *    required:
 *     - id
 */
const Role = db.define(
  "Role",
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

module.exports = Role;
