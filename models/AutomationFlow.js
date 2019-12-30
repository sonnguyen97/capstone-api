const Sequelize = require("sequelize");
const db = require("../config/db");

const Account = require("./Account");
const AutomationFlowOperationStatus = require("./AutomationFlowOperationStatus");
const Step = require("./Step");

const AutomationFlow = db.define(
  "AutomationFlow",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    last_modified_date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    owner_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    status_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    first_step_id: {
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

// FK_AutomationFlow_belong_to_Owner
AutomationFlow.belongsTo(Account, {
  as: "owner",
  foreignKey: "owner_id",
  sourceKey: "id"
});
Account.hasMany(AutomationFlow, {
  foreignKey: "owner_id",
  sourceKey: "id"
});

// FK_AutomationFlow_has_Status
AutomationFlow.belongsTo(AutomationFlowOperationStatus, {
  as: "status",
  foreignKey: "status_id",
  sourceKey: "id"
});
AutomationFlowOperationStatus.hasMany(AutomationFlow, {
  foreignKey: "status_id",
  sourceKey: "id"
})

//FK_AutomationFlow_first_Step
AutomationFlow.belongsTo(Step, {
  as: "stepSequence",
  foreignKey: "first_step_id",
  sourceKey: "id"
});
Step.hasOne(AutomationFlow, {
  foreignKey: "first_step_id",
  sourceKey: "id"
});

module.exports = AutomationFlow;
