const express = require("express");
const router = express.Router();
const subscriberType_dao = require("../../../dao/subscriberType.dao");
const auth = require("../../../middleware/auth.middleware");


router.get("/", auth, async (req, res) => {
  try {
    const subscriberTypes = await subscriberType_dao.getAllSubscriberTypes();
    res.json(subscriberTypes);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error" + err.message);
  }
});

module.exports = router;
