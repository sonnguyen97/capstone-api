const express = require("express");
const router = express.Router();

const auth = require("../../../middleware/auth.middleware");

const automationFlowDao = require("../../../dao/automationFlow.dao");

const { DELETED } = require("../../../constants/automation-flow/AutomationFlowOperationStatus.constant");

/**
 * GET: /
 * Returns all AutomationFlows in system which belong to the signed in Account
 * Returns 200 status code if not found
 * Returns 500 status code if any exception occurs
 */
router.get("/", auth, async (req, res) => {
  const accountId = req.account.id;

  try {
    const automationFlows = await automationFlowDao.findAll(accountId);

    if (automationFlows.length > 0) {
      res.status(200).send({
        success: true,
        emailFlows: automationFlows
      });
    } else {
      res.status(200).send({
        success: false,
        error: "Resource Not Found!"
      });
    }
  } catch (err) {
    console.log('> Error at Automation Flow Route GET "/".\n> Error message: ' + err.message);
    res.status(500).send({
      success: false,
      error: "Internal Server Error"
    });
  }
});

/**
 * GET: /:id
 * Returns a specific AutomationFlow in system which belong to the signed in Account by its ID
 * Returns 200 status code if not found
 * Returns 500 status code if any exception occurs
 */
router.get("/:id", auth, async (req, res) => {
  const accountId = req.account.id;
  const automationFlowId = req.params.id;

  try {
    const automationFlow = await automationFlowDao.find(accountId, automationFlowId);

    if (automationFlow !== null) {
      res.status(200).send({
        success: true,
        currEmailFlow: automationFlow
      });
    } else {
      res.status(200).send({
        success: false,
        error: "Resource Not Found!"
      });
    }
  } catch (err) {
    console.log('> Error at Automation Flow Route GET "/' + automationFlowId + '".\n> Error message: ' + err.message);
    res.status(500).send({
      success: false,
      error: "Internal Server Error"
    });
  }
});

/**
 * POST: /
 * Returns a new created AutomationFlow
 * Returns 500 status code if any exception occurs
 */
router.post("/", auth, async (req, res) => {
  const accountId = req.account.id;
  const data = req.body;

  try {
    const automationFlow = await automationFlowDao.save(accountId, data);

    res.status(200).send({
      success: true,
      currEmailFlow: automationFlow
    });
  } catch (err) {
    console.log('> Error at Automation Flow Route POST "/".\n> Error message: ' + err.message);
    res.status(500).send({
      success: false,
      error: "Internal Server Error"
    });
  }
});

/**
 * PUT: /
 * Returns an updated version of an existed AutomationFlow with new data,
 * and the status remains unchanged
 * Returns 500 status code if any exception occurs
 */
router.put("/", auth, async (req, res) => {
  const accountId = req.account.id;
  const data = req.body;

  try {
    const automationFlow = await automationFlowDao.update(accountId, data);

    res.status(200).send({
      success: true,
      currEmailFlow: automationFlow
    });
  } catch (err) {
    console.log('> Error at Automation Flow Route PUT "/".\n> Error message: ' + err.message);
    res.status(500).send({
      success: false,
      error: "Internal Server Error"
    });
  }
});

router.put("/delete", auth, async (req, res) => {
  const accountId = req.account.id;
  const automationFlowIds = req.body;

  try {
    var result = [];
    await Promise.all(automationFlowIds.map(async id => {
      const automationFlow = await automationFlowDao.changeStatus(accountId, id, DELETED.id);

      result.push(automationFlow.id);
    }));

    res.status(200).send({
      success: true,
      deletedAutomationFlowIds: result
    });
  } catch (error) {
    console.log('> Error at Automation Flow Route PUT "/status".\n> Error message: ' + error.message);
    res.status(500).send({
      success: false,
      error: "Internal Server Error"
    });
  }
})

/**
 * PUT: /status
 * Return an updated version of an existed AutomationFlow with new status
 * Return 500 status code if any exception occurs
 */
router.put("/status", auth, async (req, res) => {
  const accountId = req.account.id;
  const { automationFlowId, statusId } = req.body;

  try {
    const automationFlow = await automationFlowDao.changeStatus(accountId, automationFlowId, statusId);

    res.status(200).send({
      success: true,
      currEmailFlow: automationFlow
    });
  } catch (err) {
    console.log('> Error at Automation Flow Route PUT "/status".\n> Error message: ' + err.message);
    res.status(500).send({
      success: false,
      error: "Internal Server Error"
    });
  }
});

module.exports = router;
