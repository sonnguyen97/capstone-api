const Sequelize = require("sequelize");
const db = require("../config/db");

const Account = require("./Account");
const SubscriberActivationStatus = require("./SubscriberActivationStatus");
const SubscriberType = require("./SubscriberType");

const Subscriber = db.define(
  "Subscriber",
  {
    // paranoid: true,
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    created_date: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    },
    last_modified_date: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    shopify_id: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    },
    type_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    account_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    status_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    total_spent: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    orders_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    cancelled_order_times: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    country: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ""
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ""
    },
    province: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ""
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

// FK_Subscriber_belong_to_Account
Subscriber.belongsTo(Account, {
  foreignKey: "account_id",
  sourceKey: "id"
});
Account.hasMany(Subscriber, {
  foreignKey: "account_id",
  sourceKey: "id"
});

// FK_Subscriber_has_Status
Subscriber.belongsTo(SubscriberActivationStatus, {
  foreignKey: "status_id",
  sourceKey: "id"
});
SubscriberActivationStatus.hasMany(Subscriber, {
  foreignKey: "status_id",
  sourceKey: "id"
});

// FK_Subscriber_has_Type
Subscriber.belongsTo(SubscriberType, {
  foreignKey: "type_id",
  sourceKey: "id"
});
SubscriberType.hasMany(Subscriber, {
  foreignKey: "type_id",
  sourceKey: "id"
});

module.exports = Subscriber;
