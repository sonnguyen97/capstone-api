const Sequelize = require("sequelize");
const db = require("../config/db");

const Account = require("./Account");
const CampaignOperationStatus = require("./CampaignOperationStatus");
const Email = require("./Email");

const Campaign = db.define(
  "Campaign",
  {
    // paranoid: true,
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    last_modified_date: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    },
    status_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    owner_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email_id: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    },
    is_news_letter: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_tracking_click: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tracking_url: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ""
    },
    is_tracking_open: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

// FK_Campaign_has_Owner
Campaign.belongsTo(Account, {
  foreignKey: "owner_id",
  sourceKey: "id"
});
Account.hasMany(Campaign, {
  foreignKey: "owner_id",
  sourceKey: "id"
});

// FK_Campaign_has_Status
Campaign.belongsTo(CampaignOperationStatus, {
  as: 'status',
  foreignKey: "status_id",
  sourceKey: "id"
});
CampaignOperationStatus.hasMany(Campaign, {
  as: 'status',
  foreignKey: "status_id",
  sourceKey: "id"
});

// FK_Campaign_has_Email
Campaign.belongsTo(Email, {
  foreignKey: "email_id",
  sourceKey: "id"
});
Email.hasMany(Campaign, {
  foreignKey: "email_id",
  sourceKey: "id"
});

module.exports = Campaign;
