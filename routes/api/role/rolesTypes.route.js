const express = require("express");
const router = express.Router();
const db = require("../../../config/db");
const Account = require("../../../models/Account");

const roletype_dao = require("../../../dao/roletype.dao");
const auth = require("../../../middleware/auth.middleware");

router.get("/", auth, async (req, res) => {
  try {
    const roles = await roletype_dao.getRoleType();
    res.json(roles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error" + err.message);
  }
});

module.exports = router;
