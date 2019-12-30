const Sequelize = require("sequelize");
const db = require("../config/db");

const ConditionType = require("./ConditionType");
const Step = require("./Step");

const Condition = db.define(
  "Condition",
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    condition_match_step_id: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    },
    condition_failed_step_id: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    },
    condition_type_id: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

// FK_Condition_has_Type
Condition.belongsTo(ConditionType, {
  as: "conditionType",
  foreignKey: "condition_type_id",
  sourceKey: "id"
});
ConditionType.hasMany(Condition, {
  foreignKey: "condition_type_id",
  sourceKey: "id"
});

// FK_Condition_is_Step
Condition.belongsTo(Step, {
  as: "stepCommonData",
  foreignKey: "id",
  sourceKey: "id"
});
Step.hasOne(Condition, {
  foreignKey: "id",
  sourceKey: "id"
});

// FK_Condition_match_Step
Condition.belongsTo(Step, {
  as: "matchedStep",
  foreignKey: "condition_match_step_id",
  sourceKey: "id"
});
Step.hasMany(Condition, {
  foreignKey: "condition_match_step_id",
  sourceKey: "id"
});

// FK_Condition_failed_Step
Condition.belongsTo(Step, {
  as: "failedStep",
  foreignKey: "condition_failed_step_id",
  sourceKey: "id"
});
Step.hasMany(Condition, {
  foreignKey: "condition_failed_step_id",
  sourceKey: "id"
});

module.exports = Condition;
