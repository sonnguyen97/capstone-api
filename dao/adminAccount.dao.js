
const Account = require("../models/Account");
const Role = require("../models/Role")
const uuidv1 = require("uuid/v1");
var CryptoJS = require("crypto-js");
const sequelize = require("sequelize");

module.exports = {
  getAllAccount: async () => {
    const sql = `SELECT Account.id, Account.email, Account.last_modified_date as lastModifiedDate, Account.status_id, 
    Account.store_domain, Account.store_name,  AccountActivationStatus.name as activation
    FROM Account , Role, AccountActivationStatus 
    where  Account.role_id = Role.id and Role.name = 'StoreOwner' and Account.status_id = AccountActivationStatus.id` ;
    // console.log("Account Object: " + Account.store_name);
    const Accounts = await Account.sequelize
      .query(sql, { type: sequelize.QueryTypes.SELECT })
      .then(function(result) {
        return result;
      });
    return Accounts;
  },

  createAccount: async acc => {
    
    var passwordEncrypt = CryptoJS.SHA256(acc.password);
    acc.password = passwordEncrypt.toString();
    console.log(acc);

    try {
      var newaccount = new Account(acc);
      console.log(JSON.stringify(acc));
      newaccount.id = acc.id;
      newaccount.email = acc.email
      newaccount.password = acc.password
      newaccount.store_domain = acc.store_domain;
      newaccount.store_name = acc.store_name;
      newaccount.role_id = acc.role_id;
      newaccount.status_id = acc.status_id;

     
      return await newaccount.save().then(() => {
        console.log("Create new account successfully!");
       
      });
    } catch (err) {
      console.log(err.message);
    }
  }
};