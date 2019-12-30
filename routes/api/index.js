const express = require("express");
const router = express.Router();

router.use("/accounts", require("./account/account.route"));
router.use("/admin", require("./admin/admin.route"));
router.use("/audience", require("./audience/audience.route"));
router.use("/auth", require("./authentication/auth.route"));
router.use("/automation-flows", require("./automation-flows/automationFlow.route"));
router.use("/campaigns", require("./campaigns/campaign.route"));
router.use("/criteria", require("./audience/criteria.route"));
router.use("/emails", require("./emails/email.route"));
router.use("/newsletters", require("./campaigns/newsletter.route"));
router.use("/roles", require("./role/role.route"));
router.use("/rolesTypes", require("./role/rolesTypes.route"));
router.use("/subscribers", require("./subscribers/subscriber.route"));
router.use("/subscriberTypes", require("./subscribers/subscriberType.route"));
router.use("/statistics", require("./statistic/statistic.route"));

module.exports = router;