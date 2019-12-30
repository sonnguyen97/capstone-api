const Sequelize = require("sequelize");
const db = require("../config/db");

const Audience = require("./Audience");
const Subscriber = require("./Subscriber");

const Audience_Subscriber = db.define(
  "Audience_Subscriber",
  {
    audience_id: {
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

// FK_Audience_Subscriber_AudienceID
Audience_Subscriber.belongsTo(Audience, {
  foreignKey: "audience_id",
  sourceKey: "id"
});
Audience.hasMany(Audience_Subscriber, {
  foreignKey: "audience_id",
  sourceKey: "id"
});

// FK_Audience_Subscriber_SubscriberID
Audience_Subscriber.belongsTo(Subscriber, {
  foreignKey: "subscriber_id",
  sourceKey: "id"
});
Subscriber.hasMany(Audience_Subscriber, {
  foreignKey: "subscriber_id",
  sourceKey: "id"
});

module.exports = Audience_Subscriber;
