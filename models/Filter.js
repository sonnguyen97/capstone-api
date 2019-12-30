const Sequelize = require("sequelize");
const db = require("../config/db");

const FilterExpression = require("./FilterExpression");
const FilterField = require("./FilterField");

const Filter = db.define(
  "Filter",
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    value: {
      type: Sequelize.STRING,
      allowNull: false
    },
    filter_field_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    filter_expression_id: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

// FK_Filter_has_Expression
Filter.belongsTo(FilterExpression, {
  foreignKey: "filter_expression_id",
  sourceKey: "id"
});
FilterExpression.hasMany(Filter, {
  foreignKey: "filter_expression_id",
  sourceKey: "id"
});

//FK_Filter_has_Field
Filter.belongsTo(FilterField, {
  foreignKey: "filter_field_id",
  sourceKey: "id"
});
FilterField.hasMany(Filter, {
  foreignKey: "filter_field_id",
  sourceKey: "id"
});

module.exports = Filter;
