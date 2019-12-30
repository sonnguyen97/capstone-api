const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth.middleware");
const jwt = require("jsonwebtoken");
const config = require("config");
// const bcrypt = require('bcryptjs');
const { check, validationResult } = require("express-validator");
const Account = require("../../../models/Account");
var CryptoJS = require("crypto-js");

/* ----- 
  @route  GET api/auth
  @desc   Test 
-----*/

router.get("/", auth, async (req, res) => {
  try {
    const account = await Account.findOne({
      where: {
        email: req.account.email
      },
      attributes: ["id", "email", "first_name"]
    });
    res.json(account);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/* ----- 
  @route  POST api/auth
  @desc   Authenticate user & get token
-----*/
router.post(
  "/login",
  [
    // check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more character"
    ).exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { storeDomain, password } = req.body;
    var passwordEncrypt = CryptoJS.SHA256(password);
    try {
      console.log(req.body);
      let account = await Account.findOne({
        where: {
          store_domain: storeDomain,
          password: passwordEncrypt.toString()
        }
      });

      if (!account) {
        return res
          .status(400)
          .json({ errors: [{ message: "Invalid email or password" }] });
      }
      // const isMatch = await bcrypt.compare(password, user.password);
      // if (!isMatch) {
      //     return res.status(400).json({ errors: [{ message: 'Invalid email or password' }] })
      // }
      const payload = {
        account: {
          id: account.id
        }
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000000 },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            account
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
