
const Account = require("../models/Account");
const Role = require("../models/Role")
const uuidv1 = require("uuid/v1");
var CryptoJS = require("crypto-js");
const sequelize = require("sequelize");

module.exports = {
    getRoleType: async () => {
        const sql = `SELECT Role.id, Role.name FROM Role`;
        // console.log("Account Object: " + Account.store_name);
        const Roles = await Role.sequelize
          .query(sql, { type: sequelize.QueryTypes.SELECT })
          .then(function(result) {
            return result;
          });
        return Roles;
      }
};