const express = require("express");
const router = express.Router();
const db = require("../../../config/db");

const subscriber_dao = require("../../../dao/subscriber.dao");
const auth = require("../../../middleware/auth.middleware");

const Account = require("../../../models/Account");
const Subscriber = require("../../../models/Subscriber");
const SubscriberActivationStatus = require("../../../models/SubscriberActivationStatus");
const SubscriberType = require("../../../models/SubscriberType");
const { ACTIVATED } = require("../../../constants/subscriber/SubscriberActivationStatus.constant");

router.get("/", auth, async (req, res) => {
  const accountId = req.account.id;
  try {
    const subscribers = await subscriber_dao.getAllSubscriber(accountId);
    res.json(subscribers);
    return res;
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error" + err.message);
  }
});

/**
 * GET: /shopify
 * Returns all Subscriber in system if no request query params is found
 * Returns specific Subscriber based on request query params,
 *  such as: first_name=Name or total_spent=5.00
 * Returns 404 status code if not found
 * TODO: Search params with more comparators such as >, < instead of only =
 */
router.get("/shopify", async (req, res) => {
  try {
    const subscribers = await Subscriber.findAll({
      include: [
        {
          model: SubscriberType,
          attributes: ["name"]
        },
        {
          model: Account,
          attributes: ["email", "store_domain", "store_name"]
        },
        {
          model: SubscriberActivationStatus,
          attributes: ["name"]
        }
      ],
      attributes: [
        "id",
        "email",
        "first_name",
        "last_name",
        "created_date",
        "last_modified_date",
        "shopify_id",
        "total_spent",
        "orders_count",
        "cancelled_order_times"
      ],
      where: req.query
    });
    if (subscribers.length > 0) {
      res.json(subscribers);
    } else {
      res.status(404).send("Resource not found");
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error" + err.message);
  }
});

router.post("/importExcel", auth, async (req, res) => {
  var subscriber = req.body;
  var accountId = req.account.id;
  try {
    console.log("at subscriber:" + JSON.stringify(subscriber));
    const check = await subscriber_dao.importExcel(subscriber, accountId);
    res.status(200).send(check);
  } catch (err) {
    console.log(err.message);
    res.status(200).send(false);
  }
});

router.post("/", auth, async (req, res) => {
  const subscriber = req.body;
  const accountId = req.account.id;
  try {
    console.log("at subscriber:" + JSON.stringify(subscriber));
    const vs = await subscriber_dao.addSubscriber(subscriber, accountId);
    res.status(200).send(vs);
  } catch (err) {
    console.log(err.message);
    res.status(200).send(false);
  }
});
/**
 * POST: /shopify
 * Create a new subscriber from request body and store to DB.
 * Must check other constraints before calling this route.
 * Return a new created subscriber
 */
router.post("/shopify", async (req, res) => {
  const data = req.body;
  try {
    await subscriber_dao.createSubscriber(data).then(subscriber => {
      res.json(subscriber);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error " + subscriber);
  }
});

router.put("/", auth, async (req, res) => {
  var subscriber = req.body;
  var accountId = req.account.id;
  // var email = req.body.email;
  try {
    subscriber_dao.updateSubscriber(subscriber, accountId);
    res.status(200).json(subscriber);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error " + subscriber);
  }
});

router.put("/delete", auth, async (req, res) => {
  var selectedRowKeys = req.body;
  console.log(selectedRowKeys);
  var accountId = req.account.id;
  console.log(accountId + JSON.stringify(selectedRowKeys));
  try {
    subscriber_dao.deleteSubscriber(selectedRowKeys, accountId);
    res.status(200).json("Subscriber has been deleted");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error " + subscriber);
  }
});

// router.get("/:subscriberId", auth, async (req, res) => {
//   var visitorId = req.params.visitorId
//   var accountId = req.account.id
// }
router.post("/unsubscribe", async (req, res) => {
  const { subscriber } = req.body;
  console.log(subscriber);

  try {
    const unsubscribeResult = await subscriber_dao.unsubscribe(subscriber);
    if (unsubscribeResult) {
      res.status(200).send({
        success: true,
        message: "Unsubscribed successfully"
      });
    } else {
      res.status(200).send({
        success: true,
        message: "You are not our subscriber. No action was executed"
      });
    }
  } catch (error) {
    console.log("** ROUTE SUBSCRIBER UNSUBSCRIBE ERROR");
    console.log(error.message);
    res.status(500).send({
      success: false,
      error: error.message
    });
  }
});

// router.get("/types/all", auth, async (req, res) => {
//   try {
//     const detail = await subscriber_dao.getVisitorDetail(visitorId, accountId)
//     const re = detail
//     res.status(200).json(detail)
//   } catch (error) {
//     console.log(error)
//   }
// })

router.post("/addingASubsctiberToAudience", auth, async (req, res) => {
  var data = req.body
  try {
    const detail = await subscriber_dao.AddingASubsctiberToAudience(data)
     await res.status(200).json(detail)
  } catch (error) {
    res.status(200).json(false)
    console.log(error)
  }
})

router.post("/detail/:subscriberId", auth, async (req, res) => {
  var data = req.body
  try {
    const detail = await subscriber_dao.getSubscriberDetail(data)
     await res.status(200).json(detail)
  } catch (error) {
    res.status(200).json(false)
    console.log(error)
  }
})

/**
 * PUT: /shopify
 * Create a new subscriber from request body and store to DB.
 * Must check other constraints before calling this route.
 * Return a new created subscriber
 */
router.put("/shopify", async (req, res) => {
  const data = req.body;
  try {
    await subscriber_dao.update(data).then(subscriber => {
      res.json(subscriber);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error " + subscriber);
  }
});

module.exports = router;
