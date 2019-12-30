const Sequelize = require("sequelize");
const db = require("../config/db");

const AudienceActivationStatus = require("./AudienceActivationStatus");
const Criterion = require("./Criterion");

const Audience = db.define(
  "Audience",
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    },
    last_modified_date: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    status_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    criterion_id: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    },
    owner_id: {
      type: Sequelize.STRING
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

// FK_Audience_has_Criterion
Audience.belongsTo(Criterion, {
  foreignKey: "criterion_id",
  sourceKey: "id"
});
Criterion.hasMany(Audience, {
  foreignKey: "criterion_id",
  sourceKey: "id"
});

// FK_Audience_has_Status
Audience.belongsTo(AudienceActivationStatus, {
  foreignKey: "status_id",
  sourceKey: "id"
});
AudienceActivationStatus.hasMany(Audience, {
  foreignKey: "status_id",
  sourceKey: "id"
});

module.exports = Audience;
