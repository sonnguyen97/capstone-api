const Sequelize = require("sequelize");
const db = require("../config/db");

const CriterionFollowerExpression = require("./CriterionFollowerExpression");
const CriterionType = require("./CriterionType");
const Filter = require("./Filter");

const Criterion = db.define(
  "Criterion",
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    type_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    filter_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    has_follower: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    follower_id: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    },
    follower_expression_id: {
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

// FK_Criterion_has_Follower
Criterion.belongsTo(Criterion, {
  foreignKey: "follower_id",
  sourceKey: "id"
});
Criterion.hasOne(Criterion, {
  foreignKey: "follower_id",
  sourceKey: "id"
});

// FK_Criterion_Follower_has_Expression
Criterion.belongsTo(CriterionFollowerExpression, {
  foreignKey: "follower_expression_id",
  sourceKey: "id"
});
CriterionFollowerExpression.hasOne(Criterion, {
  foreignKey: "follower_expression_id",
  sourceKey: "id"
});

// FK_Criterion_has_Type
Criterion.belongsTo(CriterionType, {
  foreignKey: "type_id",
  sourceKey: "id"
});
CriterionType.hasMany(Criterion, {
  foreignKey: "type_id",
  sourceKey: "id"
});

// FK_Criterion_has_Filter
Criterion.belongsTo(Filter, {
  foreignKey: "filter_id",
  sourceKey: "id"
});
Filter.hasMany(Criterion, {
  foreignKey: "filter_id",
  sourceKey: "id"
})

module.exports = Criterion;
