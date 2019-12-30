const express = require("express");
const router = express.Router();
const statistic_dao = require("../../../dao/statistic.dao.js");
const auth = require("../../../middleware/auth.middleware");

router.get("/", auth, async (req, res) => {
  const accountId = req.account.id;
  try {
    const count = await statistic_dao.count(accountId);

    res.status(200).send({
      success: true,
      statistics: count
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;
