const express = require("express");
const router = express.Router();
const Account = require("../../../models/Account");
const AccountActivationStatus = require("../../../models/AccountActivationStatus");
const Role = require("../../../models/Role");
const account_dao = require("../../../dao/account.dao");
const auth = require("../../../middleware/auth.middleware");

router.get("/me", auth, async (req, res) => {
  try {
    const account = await Account.findOne({
      include: [
        {
          model: Role
        }
      ],
      attributes: ["id", "email", "last_modified_date", "store_name", "store_domain", "role_id", "status_id"],
      where: {
        id: req.account.id
      }
    });
    res.json(account);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * GET: /
 * Returns all Accounts in system if no request query params is found
 * Returns specific Accounts based on request query params,
 *  such as: store_name=example%20%name or store_domain=example
 * Returns 404 status code if not found
 */
router.get("/", async (req, res) => {
  try {
    const accounts = await Account.findAll({
      include: [
        {
          model: Role,
          attributes: ["name"]
        },
        {
          model: AccountActivationStatus,
          attributes: ["name"]
        }
      ],
      attributes: ["id", "email", "last_modified_date", "store_name", "store_domain"],
      where: req.query
    });

    if (accounts.length > 0) {
      res.json(accounts);
    } else {
      res.status(404).send("Resource not found");
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/", async (req, res) => {
  const acc = req.body;
  try {
    await account_dao.createAccount(acc).then(account => {
      res.json(account);
    });
  } catch (error) {
    console.log(error.message + " at create account");
    res.status(500).send("Server error at creating an account");
  }
});

module.exports = router;
