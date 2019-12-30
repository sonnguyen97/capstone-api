
const express = require("express");
const router = express.Router();
const db = require("../../../config/db");
const Account = require("../../../models/Account");

const adminAccount_dao = require("../../../dao/adminAccount.dao");
const auth = require("../../../middleware/auth.middleware");

const uuidv1 = require("uuid/v1");

router.get("/", auth, async (req, res) => {
    try {
      const account = await adminAccount_dao.getAllAccount();
      res.json(account);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error" + err.message);
    }
  });

  router.post("/", auth, async (req, res) => {
    var body = req.body;
   // var accountId = body.accountId;
    const account_model = {
      id: null,
      email: null,
      password: null,
      store_domain: null,
      store_name: null,
      role_id: null,
      status_id: null
    };
    
    try {
      account_model.id = uuidv1();
      account_model.email = body.email;
      account_model.password = '123';
      account_model.store_domain = body.storedomain;
      account_model.store_name = body.storename;
      account_model.role_id = body.RoleID;
      account_model.status_id ='ecb017ee-8cd4-49d3-b73b-424bab2c6422'
      console.log(account_model);
      adminAccount_dao.createAccount(account_model);
     
      res.status(200).json(body);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error " + body);
    }
  });

  
module.exports = router;