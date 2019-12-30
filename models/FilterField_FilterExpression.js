const Sequelize = require("sequelize");
const db = require("../config/db");

const FilterExpression = require("./FilterExpression");
const FilterField = require("./FilterField");

const FilterField_FilterExpression = db.define(
  "FilterField_FilterExpression",
  {
    expression_id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    field_id: {
      type: Sequelize.STRING,
      primaryKey: true
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

// FK_FilterField_FilterExpression_FilterExpressionID
FilterField_FilterExpression.belongsTo(FilterExpression, {
  foreignKey: "expression_id",
  sourceKey: "id"
});
FilterExpression.hasMany(FilterField_FilterExpression, {
  foreignKey: "expression_id",
  sourceKey: "id"
});

// FK_FilterField_FilterExpression_FilterFieldID
FilterField_FilterExpression.belongsTo(FilterField, {
  foreignKey: "field_id",
  sourceKey: "id"
});
FilterField.hasMany(FilterField_FilterExpression, {
  foreignKey: "field_id",
  sourceKey: "id"
});

module.exports = FilterField_FilterExpression;
