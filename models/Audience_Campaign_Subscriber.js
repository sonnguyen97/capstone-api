const Sequelize = require("sequelize");
const db = require("../config/db");

const Audience = require("./Audience");
const Campaign = require("./Campaign");
const Subscriber = require("./Subscriber");

const Audience_Campaign_Subscriber = db.define(
  "Audience_Campaign_Subscriber",
  {
    audience_id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    campaign_id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    subscriber_id: {
      type: Sequelize.STRING,
      primaryKey: true
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

// FK_Audience_Campaign_Subscriber_AudienceID
Audience_Campaign_Subscriber.belongsTo(Audience, {
  foreignKey: "audience_id",
  sourceKey: "id"
});;
Audience.hasMany(Audience_Campaign_Subscriber, {
  foreignKey: "audience_id",
  sourceKey: "id"
});

// FK_Audience_Campaign_Subscriber_CampaignID
Audience_Campaign_Subscriber.belongsTo(Campaign, {
  foreignKey: "campaign_id",
  sourceKey: "id"
});
Campaign.hasMany(Audience_Campaign_Subscriber, {
  as: 'AudienceCampaignSubscriber',
  foreignKey: "campaign_id",
  sourceKey: "id"
});

// FK_Audience_Campaign_Subscriber_SubscriberID
Audience_Campaign_Subscriber.belongsTo(Subscriber, {
  foreignKey: "subscriber_id",
  sourceKey: "id"
});
Subscriber.hasMany(Audience_Campaign_Subscriber, {
  foreignKey: "subscriber_id",
  sourceKey: "id"
});

module.exports = Audience_Campaign_Subscriber;
