const Sequelize = require("sequelize");
const db = require("../config/db");

const AccountActivationStatus = require("./AccountActivationStatus");
const Role = require("./Role");

const Account = db.define(
  "Account",
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    last_modified_date: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    store_domain: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    store_name: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    },
    role_id: {
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

// FK_Account_has_Status
Account.belongsTo(AccountActivationStatus, {
  foreignKey: "status_id",
  sourceKey: "id"
});
AccountActivationStatus.hasMany(Account, {
  foreignKey: "status_id",
  sourceKey: "id"
});

// FK_Account_has_Role
Account.belongsTo(Role, {
  foreignKey: "role_id",
  sourceKey: "id"
});
Role.hasMany(Account, {
  foreignKey: "role_id",
  sourceKey: "id"
});

module.exports = Account;
