const Sequelize = require("sequelize");
const db = require("../config/db");

const Email = require("./Email");
const Subscriber = require("./Subscriber");

const Email_Subscriber = db.define(
  "Email_Subscriber",
  {
    subscriber_id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    email_id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    has_opened_email: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    has_clicked_url: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_bounced: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_sent: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_tracking_click: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
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

// FK_Email_Subscriber_SubscriberID
Email_Subscriber.belongsTo(Subscriber, {
  foreignKey: "subscriber_id",
  sourceKey: "id"
});
Subscriber.hasMany(Email_Subscriber, {
  foreignKey: "subscriber_id",
  sourceKey: "id"
});

// FK_Email_Subscriber_EmailID
Email_Subscriber.belongsTo(Email, {
  foreignKey: "email_id",
  sourceKey: "id"
});
Email.hasMany(Email_Subscriber, {
  foreignKey: "email_id",
  sourceKey: "id"
});

module.exports = Email_Subscriber;
