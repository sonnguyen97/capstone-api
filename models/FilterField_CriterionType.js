const Sequelize = require("sequelize");
const db = require("../config/db");

const CriterionType = require("./CriterionType");
const FilterField = require("./FilterField");

const FilterField_CriterionType = db.define(
  "FilterField_CriterionType",
  {
    criterion_type_id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    filter_field_id: {
      type: Sequelize.STRING,
      primaryKey: true
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

// FK_FilterField_CriterionType_CriterionTypeID
FilterField_CriterionType.belongsTo(CriterionType, {
  foreignKey: "criterion_type_id",
  sourceKey: "id"
});
CriterionType.hasMany(FilterField_CriterionType, {
  foreignKey: "criterion_type_id",
  sourceKey: "id"
});

// FK_FilterField_CriterionType_FilterFieldID
FilterField_CriterionType.belongsTo(FilterField, {
  foreignKey: "filter_field_id",
  sourceKey: "id"
});
FilterField.hasMany(FilterField_CriterionType, {
  foreignKey: "filter_field_id",
  sourceKey: "id"
});

module.exports = FilterField_CriterionType;
