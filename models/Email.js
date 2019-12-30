const Sequelize = require("sequelize");
const db = require("../config/db");

const EmailActivationStatus = require("./EmailActivationStatus");
const EmailTemplate = require("./EmailTemplate");

const Email = db.define(
  "Email",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    from: {
      type: Sequelize.STRING,
      allowNull: false
    },
    subject: {
      type: Sequelize.STRING,
      allowNull: false
    },
    template_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    body: {
      type: Sequelize.STRING,
      allowNull: true
    },
    raw_content: {
      type: Sequelize.STRING,
      allowNull: true
    },
    status_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    origin_id: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

// FK_Email_has_Status
// Email.body(EmailActivationStatus, {
//   foreignKey: "status_id",
//   sourceKey: "id"
// });
// EmailActivationStatus.hasMany(Email, {
//   foreignKey: "status_id",
//   sourceKey: "id"
// });

// FK_Email_has_Template
Email.belongsTo(EmailTemplate, {
  foreignKey: "template_id",
  sourceKey: "id"
});
EmailTemplate.hasMany(Email, {
  foreignKey: "template_id",
  sourceKey: "id"
});

// FK_Email_has_Origin
Email.belongsTo(Email, {
  foreignKey: "origin_id",
  sourceKey: "id"
});
Email.hasMany(Email, {
  foreignKey: "origin_id",
  sourceKey: "id"
})

module.exports = Email;
