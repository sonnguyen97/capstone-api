const Sequelize = require("sequelize");
const db = require("../config/db");

const Campaign = require("./Campaign");
const Step = require("./Step");

const Action = db.define(
  "Action",
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    next_step_id: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    },
    campaign_id: {
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

// FK_Aciton_contains_campaign
Action.belongsTo(Campaign, {
  as: "newsletter",
  foreignKey: "campaign_id",
  sourceKey: "id"
});
Campaign.hasMany(Action, {
  foreignKey: "campaign_id",
  sourceKey: "id"
});

// FK_Action_is_Step
Action.belongsTo(Step, {
  as: "stepCommonData",
  foreignKey: "id",
  sourceKey: "id"
});
Step.hasOne(Action, {
  foreignKey: "id",
  sourceKey: "id"
});

// FK_Action_next_Step
Action.belongsTo(Step, {
  as: "nextStep",
  foreignKey: "next_step_id",
  sourceKey: "id"
});
Step.hasMany(Action, {
  foreignKey: "next_step_id",
  sourceKey: "id"
});

module.exports = Action;
