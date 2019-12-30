const express = require("express");
const router = express.Router();
const db = require("../../../config/db");
const Email = require("../../../models/Email");
const EmailSubscriber = require("../../../models/Email_Subscriber");
const email_dao = require("../../../dao/email.dao");
const auth = require("../../../middleware/auth.middleware");
const TrackingType = require("../../../constants/email/tracking/trackingCondition.constant");
const fs = require("fs");
const path = require("path");

// ADD NEW EMAIL
router.post("/", auth, async (req, res) => {
  let email = req.body;
  let accountId = req.account.id;
  try {
    console.log("AccountID: " + accountId);
    console.log("Email: " + JSON.stringify(email));
    email_dao.createEmail(email);
    res.status(200).json(email);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error " + email);
  }
});

// GET EMAIL BY ID
router.get("/:id", auth, async (req, res) => {
  const emailId = req.params.id;
  try {
    const email = await email_dao.findEmailById(emailId);
    console.log(email[0].id);
    res.status(200).json({
      success: true,
      email: email
    });
  } catch (error) {
    res.status(500).send(`Server error ${error.message}`);
  }
});

// ADD NEW EMAIL_SUBSCRIBER
router.post("/emailSubscriber/", auth, async (req, res) => {
  const boby = req.body;
  try {
    // TO BE IMPLEMENT LATER -- IF USE
    // let emailSubscriber = boby.
  } catch (error) {
    console.log("****** ROUTE: EMAIL_SUBSCRIBER");
    console.log(error);
    res.status(500).send({
      success: false,
      response: error
    });
  }
});

// DELETE EMAIL_SUBSCRIBERS
router.delete("/emailSubscriber/delete/", auth, async (req, res) => {
  const body = req.body;
  try {
    const emailSubscriberList = !body.emailSubscribers ? [] : body.emailSubscribers;
    const resultList = [];
    const forLoop = async _ => {
      console.log("****** ROUTE: DELETE EMAIL_SUBSCRIBER - START");

      for (let index = 0; index < emailSubscriberList.length; index++) {
        const element = emailSubscriberList[index];
        console.log(`Deleting subscriberId <${element.subscriber_id}> with emailId <${element.email_id}>`);
        const deleteResult = await email_dao.deleteEmailSubscribers(element);
        resultList.push({
          subscriberId: element.subscriber_id,
          emailId: element.email_id,
          isDeleted: deleteResult === 1 ? true : false
        });
      }

      console.log("****** ROUTE: DELETE EMAIL_SUBSCRIBER - END");
    };

    await forLoop();
    res.status(200).send({
      success: true,
      result: resultList
    });
  } catch (error) {
    console.log("****** ROUTE: DELETE EMAIL_SUBSCRIBER");
    console.log(error);
    res.status(500).send({
      success: false,
      response: error
    });
  }
});

// SEND MAIL TEST
router.post("/send/test", auth, async (req, res) => {
  const body = req.body;
  try {
    const sendMail = async _ => {
      const email = {
        to: body.email.receiver,
        subject: body.email.subject,
        html: body.email.content
      };
      const sendingResult = await email_dao.sendMail(email);
      res.status(200).send({
        success: true,
        info: sendingResult
      });
    };
    await sendMail();
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error.");
  }
});

// TRACKING OPENED EMAIL
router.get(`/tracking/${TrackingType.OPEN.id}/`, async (req, res) => {
  const { sid, eid } = req.query;

  try {
    console.log(`** ROUTE EMAIL TRACKING OPEN EMAIL req.query`);
    console.log(`RECEIVE: ... SubscriberId <${sid}> and EmailId<${eid}> ...`);

    const emailSubscriber = new EmailSubscriber();
    emailSubscriber.subscriber_id = sid;
    emailSubscriber.email_id = eid;
    emailSubscriber.has_opened_email = true;

    const updateResult = await email_dao.updateEmailSubscriberHasOpened(emailSubscriber);
    console.log("** ROUTE: TRACKING OPENED EMAIL SUCCESS");
    console.log(updateResult);

    if (updateResult) {
      console.log("** ROUTE: TRACKING OPENED EMAIL SUCCESS");
      res.status(200).sendFile(path.resolve(__dirname, "../../../assets/ok-logo.jpg"));
    } else {
      console.log("** ROUTE: TRACKING OPENED EMAIL ERROR updateResult");
      res.status(200).sendFile(path.resolve(__dirname, "../../../assets/failure-logo.jpg"));
    }
  } catch (error) {
    console.log("** ROUTE: TRACKING OPENED EMAIL ERROR");
    console.log(error);
    const emailSubscriber = new EmailSubscriber();
    emailSubscriber.subscriber_id = sid;
    emailSubscriber.email_id = eid;
    emailSubscriber.has_opened_email = false;

    const updateResult = await email_dao.updateEmailSubscriberHasOpened(emailSubscriber);
    console.log("** ROUTE: TRACKING OPENED EMAIL ERROR updateResult");
    console.log(updateResult);
    res.status(200).sendFile(path.resolve(__dirname, "../../../assets/failure-logo.jpg"));
  }
});

// TRACKING CLICKED COMPONENT
router.get(`/tracking/${TrackingType.CLICK.id}/`, async (req, res) => {
  const { sid, eid, rurl } = req.query;

  try {
    console.log(`** ROUTE EMAIL TRACKING CLICKED EMAIL req.query`);
    console.log(`RECEIVE: ... SubscriberId <${sid}> and EmailId<${eid}> ... and URL<${rurl}>`);

    const emailSubscriber = new EmailSubscriber();
    emailSubscriber.subscriber_id = sid;
    emailSubscriber.email_id = eid;
    emailSubscriber.has_clicked_url = true;

    const updateResult = await email_dao.updateEmailSubscriberHasClicked(emailSubscriber);
    console.log("** ROUTE: TRACKING CLICKED URL SUCCESS");
    console.log(updateResult);

    res.status(200).redirect(rurl);
  } catch (error) {
    console.log("** ROUTE: TRACKING CLICKED URL ERROR");
    console.log(error);
    const emailSubscriber = new EmailSubscriber();
    emailSubscriber.subscriber_id = sid;
    emailSubscriber.email_id = eid;
    emailSubscriber.has_clicked_url = false;

    const updateResult = await email_dao.updateEmailSubscriberHasClicked(emailSubscriber);
    console.log("** ROUTE: TRACKING CLICKED URL ERROR updateResult");
    console.log(updateResult);
    res.status(200).redirect(rurl);
  }
});

// UNSUBSCRIBE
router.post(`/unsubscribe/`, async (req, res) => {
  const { sid, stid } = req.query;

  try {
    console.log(`** ROUTE EMAIL UNSUBSCRIBE req.query`);
    console.log(`RECEIVE: ... SubscriberId <${sid}> and StoreId<${stid}> ...`);

    // console.log("** ROUTE: EMAIL UNSUBSCSRIBE SUCCESS");
    // console.log(updateResult);

    res.status(200).redirect("http://localhost:3001/#/subscriber/unsubscribe/?");
  } catch (error) {
    console.log("** ROUTE: EMAIL UNSUBSCRIBE ERROR");
    console.log(error);

    res.status(500).send({
      success: false,
      response: error
    });
  }
});

// ADD NEW EMAIL TEMPLATE
router.post("/templates/create", auth, async (req, res) => {
  let emailTemplate = req.body;
  let accountId = req.account.id;
  try {
    console.log("AccountID: " + accountId);
    console.log("EmailTemplate: " + emailTemplate.name);
    const createdEmailTemplate = await email_dao.createEmailTemplate(emailTemplate);

    if (createdEmailTemplate) {
      res.status(200).send({
        success: true,
        emailTemplate: createdEmailTemplate
      });
    } else {
      res.status(500).send({
        success: false,
        error: error.message
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      success: false,
      error: error.message
    });
  }
});

// GET ALL EMAIL TEMPLATES
router.get("/templates/getAll", auth, async (req, res) => {
  // let url = req.params.url;
  const accountId = req.account.id;
  try {
    const getEmailTemplatesResult = await email_dao.getAllEmailTemplates();

    if (getEmailTemplatesResult) {
      res.status(200).send({
        success: true,
        emailTemplateList: getEmailTemplatesResult
      });
    } else {
      res.status(200).send({
        success: false,
        error: "Failed to get email templates from server"
      });
    }
  } catch (error) {
    console.log("** ROUTE GET EMAIL TEMPLATES ERROR");
    console.log(error.message);
    res.status(200).send({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
