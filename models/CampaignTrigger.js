const Sequelize = require("sequelize");
const db = require("../config/db");

const Campaign = require("./Campaign");
const CampaignTriggerOperationStatus = require("./CampaignTriggerOperationStatus");
const CampaignTriggerType = require("./CampaignTriggerType");
const Email = require("./Email");

const CampaignTrigger = db.define(
  "CampaignTrigger",
  {
    // paranoid: true,
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    scheduled_expression: {
      type: Sequelize.STRING,
      allowNull: true
    },
    email_id: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    },
    type_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    campaign_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    status_id: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

// FK_CampaignTrigger_has_Type
CampaignTrigger.belongsTo(CampaignTriggerType, {
  foreignKey: "type_id",
  sourceKey: "id"
});
CampaignTriggerType.hasMany(CampaignTrigger, {
  foreignKey: "type_id",
  sourceKey: "id"
});

// FK_CampaignTrigger_has_Status
CampaignTrigger.belongsTo(CampaignTriggerOperationStatus, {
  foreignKey: "status_id",
  sourceKey: "id"
});
CampaignTriggerOperationStatus.hasMany(CampaignTrigger, {
  foreignKey: "status_id",
  sourceKey: "id"
});

// FK_CampaignTrigger_has_Email
CampaignTrigger.belongsTo(Email, {
  foreignKey: "email_id",
  sourceKey: "id"
});
Email.hasMany(CampaignTrigger, {
  foreignKey: "email_id",
  sourceKey: "id"
});

// FK_CampaignTrigger_belongs_to_Campaign
CampaignTrigger.belongsTo(Campaign, {
  foreignKey: "campaign_id",
  sourceKey: "id"
});
Campaign.hasMany(CampaignTrigger, {
  foreignKey: "campaign_id",
  sourceKey: "id"
});

module.exports = CampaignTrigger;
