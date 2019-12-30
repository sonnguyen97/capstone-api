const express = require("express");
const router = express.Router();
const db = require("../../../config/db");
const Role = require("../../../models/Role");
const auth = require("../../../middleware/auth.middleware");

//  /**
//  * @swagger
//   * /api/role:
//  *   get:
//  *     tags:
//  *       - roles
//  *     description: Returns all roles
//  *     produces:
//  *       - application/json
//  *     responses:
//  *       200:
//  *         description: An array of roles
//  *         schema:
//  *           $ref: '#/definitions/Puppy
//  */
router.get("/", auth, async (req, res) => {
  try {
    const role = await Role.findAll();
    res.status(200).send(role);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});



module.exports = router;
