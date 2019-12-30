const Sequelize = require("sequelize");
const db = require("../config/db");

const StepType = require("./StepType");

const Step = db.define(
  "Step",
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    }, 
    start_duration: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: "0"
    },
    type_id: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

// FK_Step_has_Type
Step.belongsTo(StepType, {
  as: "stepType",
  foreignKey: "type_id",
  sourceKey: "id"
});
StepType.hasMany(Step, {
  foreignKey: "type_id",
  sourceKey: "id"
});

module.exports = Step;
