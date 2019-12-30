const Account = require("../models/Account");
const uuidv1 = require("uuid/v1");
var CryptoJS = require("crypto-js");

const { ACTIVATED } = require("../constants/account/AccountActivationStatus.constant");
const { STORE_OWNER } = require("../constants/account/Role.constant");

module.exports = {
  createAccount: async acc => {
    if (!acc.id) {
      acc.id = uuidv1();
    }

    var passwordEncrypt = CryptoJS.SHA256(acc.password);
    acc.password = passwordEncrypt.toString();
    
    acc.status_id = ACTIVATED.id;
    acc.role_id = STORE_OWNER.id;

    try {
      return Account.create(acc);
    } catch (err) {
      console.log(err);
    }
  }
};
