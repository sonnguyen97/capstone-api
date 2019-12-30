const express = require("express");
const router = express.Router();
const campaign_dao = require("../../../dao/campaign.dao");
const auth = require("../../../middleware/auth.middleware");
const CampaignTrigger = require("../../../models/CampaignTrigger");
const email_dao = require("../../../dao/email.dao");
const campaignTriggerType = require("../../../constants/campaign/campaign-trigger/CampaignTriggerType.constant");
const Email = require("../../../models/Email");
const Campaign = require("../../../models/Campaign");
const Subscriber = require("../../../models/Subscriber");
const Audience_Campaign_Subscriber = require("../../../models/Audience_Campaign_Subscriber");
// GET ALL CAMPAIGNS
router.get("/", auth, async (req, res) => {
  const accountId = req.account.id;
  try {
    const getCampaignsResult = await campaign_dao.getAllCampaigns(accountId);

    if (getCampaignsResult) {
      res.status(200).send({
        success: true,
        campaigns: getCampaignsResult
      });
    } else {
      res.status(200).send({
        success: false,
        error: "Failed to get campaigns from server"
      });
    }
  } catch (error) {
    console.log("** ROUTE GET CAMPAIGNS ERROR");
    console.log(error.message);
    res.status(200).send({
      success: false,
      error: error.message
    });
  }
});

// GET ALL CAMPAIGNS TRIGGER
router.put("/deleteCampaigns", auth, async (req, res) => {
  const accountId = req.account.id;
  const selectedRowKeys = req.body;
  try {
    const check = await campaign_dao.deleteCampaign(selectedRowKeys, accountId);

    if (check) {
      res.status(200).send(true);
    } else {
      res.status(200).send(false);
    }
  } catch (error) {
    console.log("** DELETE CAMPAIGNS ERROR");
    console.log(error.message);
    res.status(200).send(false);
  }
});

router.post("/hooks", async (req, res) => {
  // let url = req.params.url;
  const data = req.body;
  try {
    const emailContent = await campaign_dao.callCampaignByHooks(data);

    if (emailContent && emailContent.length > 0) {
      emailContent.map(async item => {
        await email_dao.sendMail(item);
      });
    }
    // const sendingResult =

    if (emailContent) {
      res.status(200).send({
        success: true,
        campaigns: emailContent
      });
    } else {
      res.status(200).send({
        success: false,
        error: "Failed to get campaigns from server"
      });
    }
  } catch (error) {
    console.log("** ROUTE GET CAMPAIGNS ERROR");
    console.log(error.message);
    res.status(200).send({
      success: false,
      error: error.message
    });
  }
});

router.post("/", auth, async (req, res) => {
  const data = req.body;
  const accountId = req.account.id;
  try {
    const campaign = await campaign_dao.createCampaign(data, accountId);
    res.json(campaign);
  } catch (error) {
    console.log(error);
  }
});

router.post("/changeOperationStatusAutomatedCampaign", auth, async (req, res) => {
  const status = req.body;
  const accountId = req.account.id;
  try {
    const isUpdate = await campaign_dao.changeOperationStatusAutomatedCampaign(status, accountId);
    if (isUpdate) {
      res.json(true);
    } else {
      res.json(false);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/automated-campaign", auth, async (req, res) => {
  const accountId = req.account.id;
  try {
    const automatedCampaigns = await campaign_dao.getAutomatedCampaign(accountId);
    res.status(200).json(automatedCampaigns);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:campaignId", auth, async (req, res) => {
  const accountId = req.account.id;
  const campaignId = req.params.campaignId;
  try {
    const campaignObj = await campaign_dao.getAutomatedById(accountId, campaignId);
    res.status(200).json(campaignObj);
  } catch (error) {
    console.log(error);
  }
});

router.put("/", auth, async (req, res) => {
  const accountId = req.account.id;
  const campaign = req.body;
  try {
    const campaignObj = await campaign_dao.updateCampaign(campaign, accountId);
    res.status(200).json(campaignObj);
  } catch (error) {
    console.log(error);
  }
});

router.put("/create", auth, async (req, res) => {
  const accountId = req.account.id;
  const campaign = req.body;
  try {
    const campaignObj = await campaign_dao.createCampaignCurrent(campaign, accountId);
    res.status(200).json(campaignObj);
  } catch (error) {
    console.log(error);
  }
});

router.get("/campaign/:campaignId", auth, async (req, res) => {
  const accountId = req.account.id;
  const campaignId = req.params.campaignId;
  try {
    const campaignObj = await campaign_dao.getCampaignById(accountId, campaignId);
    res.status(200).json(campaignObj);
  } catch (error) {
    console.log(error);
  }
});

router.post("/changeOperationStatusCampaign", auth, async (req, res) => {
  const statusCampaign = req.body;
  const accountId = req.account.id;
  try {
    const isUpdate = await campaign_dao.changeOperationStatusCampaign(statusCampaign, accountId);
    if (isUpdate) {
      res.json(isUpdate);
    } else {
      res.json(false);
    }
  } catch (error) {
    console.log(error);
  }
});

// router.get("/sendSchedulerCampaign/:id", auth, async (req, res) => {
//   // let url = req.params.url;
//   const campaignId = req.params.id;
//   const accountId = req.account.id;
//   const isCampaignRun = await sendCampaign(campaignId, accountId)
// });

module.exports = router;
