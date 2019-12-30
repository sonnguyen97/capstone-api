const express = require("express");
const router = express.Router();
// const db = require("../../config/db");
const newsletter_dao = require("../../../dao/newsletter.dao");
const audience_dao = require("../../../dao/audience.dao");
const email_dao = require("../../../dao/email.dao");
const auth = require("../../../middleware/auth.middleware");
const EmailSubscriber = require("../../../models/Email_Subscriber");
const Email = require("../../../models/Email");
const NewsletterStatus = require("../../../constants/campaign/CampaignOperationStatus.constant");
const TrackingType = require("../../../constants/email/tracking/trackingCondition.constant");
const EmailStatusConstant = require("../../../constants/email/EmailActivationStatus.constant");

// GET ALL NEWSLETTERS
router.get("/", auth, async (req, res) => {
  // let url = req.params.url;
  const accountId = req.account.id;
  try {
    const getNewslettersResult = await newsletter_dao.getAllNewsletters(accountId);

    if (getNewslettersResult) {
      res.status(200).send({
        success: true,
        newsletterList: getNewslettersResult
      });
    } else {
      res.status(200).send({
        success: false,
        error: "Failed to get newsletters from server"
      });
    }
  } catch (error) {
    console.log("** ROUTE GET NEWSLETTERS ERROR");
    console.log(error.message);
    res.status(200).send({
      success: false,
      error: error.message
    });
  }
});

// ADD NEW NEWSLETTER --- NEWSLETTER OBJECT RETURN FORMATION NEEDED
router.post("/", auth, async (req, res) => {
  const currNewsletter = req.body.currNewsletter;
  const accountId = req.account.id;

  try {
    console.log("** ROUTE ADD NEWSLETTER req.body");
    console.log(currNewsletter);

    const email = await email_dao.createEmail();
    const newsletter = await newsletter_dao.addNewsletter(currNewsletter, email.id, accountId);

    if (newsletter) {
      let status = "";

      console.log("** ROUTE addNewsletter checking newsletter");
      console.log(`${newsletter.id} -- trackingOpen: ${newsletter.is_tracking_open}`);
      if (newsletter.status_id === NewsletterStatus.AVAILABLE.id) {
        status = NewsletterStatus.AVAILABLE.name;
      } else if (newsletter.status_id === NewsletterStatus.RUNNING.id) {
        status = NewsletterStatus.RUNNING.name;
      } else if (newsletter.status_id === NewsletterStatus.PAUSED.id) {
        status = NewsletterStatus.PAUSED.name;
      } else if (newsletter.status_id === NewsletterStatus.DELETED.id) {
        status = NewsletterStatus.DELETED.name;
      } else {
        status = NewsletterStatus.DELETED.name;
      }

      res.status(200).send({
        success: true,
        message: `Newsletter created successfully with newsletterId <${newsletter.id}> and emailId <${email.id}>`,
        createdNewsletter: {
          id: newsletter.id,
          last_modified_date: newsletter.last_modified_date,
          name: newsletter.name,
          status: status,
          selectedAudiences: [],
          trackingUrl: "",
          trackingConfig: {
            isCheckingOpenedEmail: newsletter.is_tracking_open === true ? true : false,
            isCheckingClickedUrl: newsletter.is_tracking_click === true ? true : false
          },
          email: {
            id: email.id,
            from: email.from,
            subject: email.subject,
            htmlContent: email.body,
            rawContent: email.raw_content,
            templateId: email.template_id
          }
        }
      });
    } else {
      res.status(500).send({
        success: false,
        createdNewsletter: null,
        error: "Failed to create new newsletter"
      });
    }
  } catch (error) {
    console.log("** ROUTE GET NEWSLETTERS ERROR");
    console.log(error.message);
    res.status(500).send({
      success: false,
      error: error.message
    });
  }
});

// GET NEWSLETTER BY ID --- NEWSLETTER OBJECT RETURN FORMATION NEEDED
router.get("/:id", auth, async (req, res) => {
  let newsletterId = req.params.id;
  let accountId = req.account.id;

  try {
    const getNewsletterResult = await newsletter_dao.findNewsletterById(newsletterId, accountId);
    const newsletter = getNewsletterResult[0];
    const emailId = newsletter.email_id;
    console.log("** ROUTE GET NEWSLETTER BY ID newsletter.email_id");
    console.log(emailId);
    const getEmailResult = await email_dao.findEmailById(emailId);
    const email = getEmailResult[0];
    // console.log("** ROUTE GET NEWSLETTER BY ID email");
    // console.log(email);
    const audienceList = await newsletter_dao.getAudienceByNewsletterId(newsletterId);

    let selectedAudience = await audienceList.map(audience => {
      return {
        key: audience.id,
        label: audience.name
      };
    });

    if (newsletter) {
      res.status(200).send({
        success: true,
        message: `Newsletter "${newsletter.name}" with id <${newsletter.id}> recovered successfully`,
        currNewsletter: {
          id: newsletter.id,
          last_modified_date: newsletter.last_modified_date,
          name: newsletter.name,
          status: newsletter.status,
          selectedAudiences: selectedAudience,
          trackingUrl: newsletter.tracking_url,
          trackingConfig: {
            isCheckingOpenedEmail: newsletter.is_tracking_open === 1 ? true : false,
            isCheckingClickedUrl: newsletter.is_tracking_click === 1 ? true : false
          },
          email: {
            id: email.id,
            from: email.from,
            subject: email.subject,
            htmlContent: email.body,
            rawContent: email.raw_content,
            templateId: email.template_id,
            originId: email.origin_id
          }
        }
      });
    } else {
      res.status(500).send({
        success: false,
        error: `Failed to recover newsletter Id <${newsletterId}> from server`
      });
    }
  } catch (error) {
    console.log("** ROUTE GET NEWSLETTER BY ID ERROR");
    console.log(error.message);
    res.status(500).send({
      success: false,
      error: error.message
    });
  }
});

// DELETE NEWSLETTERS
router.put("/delete", auth, async (req, res) => {
  const selectedNewsletterKeys = req.body.selectedNewsletters;
  const accountId = req.account.id;
  console.log("** ROUTE DELETE NEWSLETTER req.body.selectedNewsletters");
  console.log(req.body.selectedNewsletters);

  try {
    const deleteNewsletterResults = [];
    const forLoop = async _ => {
      console.log("--------- START - DELETE NEWSLETTERS LOOP ---------");

      for (let index = 0; index < selectedNewsletterKeys.length; index++) {
        console.log(`************   [[ ${index} ]]   ************`);
        const aNewsletterId = selectedNewsletterKeys[index];
        console.log("** ROUTE DELETE NEWSLETTER newsletterId");
        console.log(aNewsletterId);

        // DESTROY EMAIL AND NEWSLETTER
        const getNewsletterResult = await newsletter_dao.findNewsletterById(aNewsletterId, accountId);
        const currNewsletter = getNewsletterResult[0];

        if (currNewsletter) {
          const aDeleteNewsletterResult = {
            success: false,
            message: "",
            newsletter: {
              id: currNewsletter.id,
              name: currNewsletter.name,
              emailResult: null
            }
          };

          // Destroy Newsletter
          const deleteNewsletterResult = await newsletter_dao.deleteNewsletters(aNewsletterId, accountId);

          if (deleteNewsletterResult) {
            aDeleteNewsletterResult.success = true;
            aDeleteNewsletterResult.message = `newsletter_id <${aNewsletterId}> deleted successfully`;
          } else {
            aDeleteNewsletterResult.success = false;
            aDeleteNewsletterResult.message = `newsletter_id <${aNewsletterId}> does not exist`;
          }

          // Destroy email
          const emailId = currNewsletter.email_id;
          console.log("** ROUTE DELETE NEWSLETTER email_id");
          console.log(emailId);

          if (emailId) {
            const deleteEmailResult = await email_dao.deleteEmail(emailId);
            if (deleteEmailResult) {
              aDeleteNewsletterResult.newsletter.emailResult = {
                success: true,
                message: `email_id <${emailId}> deleted successfully`,
                email: {
                  id: emailId
                }
              };
            } else {
              aDeleteNewsletterResult.newsletter.emailResult = {
                success: true,
                message: `email_id <${emailId}> does not exist`,
                email: {
                  id: emailId
                }
              };
            }
          } else {
            aDeleteNewsletterResult.newsletter.emailResult = null;
          }

          deleteNewsletterResults.push(aDeleteNewsletterResult);
        }
      }

      console.log("--------- END - DELETE NEWSLETTERS LOOP ---------");
    };

    await forLoop();

    res.status(200).send({
      finish: true,
      result: deleteNewsletterResults
    });
  } catch (error) {
    console.log("** ROUTE GET NEWSLETTERS ERROR");
    console.log(error.message);
    res.status(200).send({
      finish: false,
      error: error.message
    });
  }

  // console.log(`accId: ${accountId} deleted items ${JSON.stringify(body)}`);
  // try {
  //   await body.selectedRowKeys.forEach(async newsletterId => {
  //     const newsletter = await newsletter_dao.findNewsletterById(newsletterId, accountId);
  //     await newsletter_dao.deleteNewsletters(newsletterId, accountId);
  //     console.log(`curr newsletter: ${JSON.stringify(newsletter[0].emailId)}`);
  //     if (newsletter[0].emailId) {
  //       console.log(`EmailId: ${newsletter[0].emailId}`);
  //       await email_dao.deleteEmail(newsletter[0].emailId);
  //     }
  //     console.log("Deleted newsletter");
  //   });
  //   res.status(200).json({
  //     success: true,
  //     message: "Selected newsletters are deleted"
  //   });
  // } catch (err) {
  //   console.log(err.message);
  //   res.status(500).send(`Server error ${err}`);
  // }
});

// UPDATE NEWSLETTER --- NEWSLETTER OBJECT RETURN FORMATION NEEDED
router.put("/update/", auth, async (req, res) => {
  let body = req.body;
  let accountId = req.account.id;

  try {
    const currNewletter = body;
    const email = currNewletter.email;
    const newsletterId = currNewletter.id;
    const selectedAudiences = currNewletter.selectedAudiences;

    const responseResult = {
      emailMessage: "",
      newsletterMessage: "",
      updatedNewsletter: null
    };

    // Update email
    const updateEmailResult = await email_dao.updateEmailContent(email);
    if (updateEmailResult === 1) {
      console.log("** ROUTE UPDATE NEWSLETTER emailUpdateResult");
      console.log("Updated successfully");
      responseResult.emailMessage = "Updated successfully";
    } else {
      console.log("** ROUTE UPDATE NEWSLETTER emailUpdateResult");
      console.log("No changes");
      responseResult.emailMessage = "No changes";
    }

    // Update newsletter
    const updateNewsletterResult = await newsletter_dao.updateNewsletter(currNewletter, selectedAudiences);
    const audienceList = await newsletter_dao.getAudienceByNewsletterId(newsletterId);
    if (updateNewsletterResult) {
      console.log("** ROUTE UPDATE NEWSLETTER newsletterUpdateResult");
      console.log("Updated successfully");
      responseResult.newsletterMessage = "Updated successfully";
    } else {
      console.log("** ROUTE UPDATE NEWSLETTER newsletterUpdateResult");
      console.log("No changes");
      responseResult.newsletterMessage = "No changes";
    }

    let selectedAudience = await audienceList.map(audience => {
      return {
        key: audience.id,
        label: audience.name
      };
    });

    // Done
    res.status(200).send({
      success: true,
      response: responseResult,
      result: updateNewsletterResult,
      currNewsletter: {
        id: currNewletter.id,
        last_modified_date: updateNewsletterResult.last_modified_date,
        name: currNewletter.name,
        status: currNewletter.status,
        selectedAudiences: selectedAudience,
        trackingUrl: currNewletter.trackingUrl,
        trackingConfig: {
          isCheckingOpenedEmail: currNewletter.is_tracking_open === 1 ? true : false,
          isCheckingClickedUrl: currNewletter.is_tracking_click === 1 ? true : false
        },
        email: {
          id: email.id,
          from: email.from,
          subject: email.subject,
          htmlContent: email.htmlContent,
          rawContent: email.rawContent,
          templateId: email.templateId,
          originId: email.origin_id
        }
      }
    });
  } catch (error) {
    console.log("** ROUTE UPDATE NEWSLETTER ERROR");
    console.log(error.message);
    res.status(500).send({
      success: false,
      error: error.message
    });
  }
});

// GET ALL AUDIENCE
router.get("/audience/getAll", auth, async (req, res) => {
  let accountId = req.account.id;
  try {
    const allAudience = await audience_dao.getAudience(accountId);

    res.status(200).send({
      success: true,
      audienceList: allAudience
    });
  } catch (error) {
    console.log("** ROUTE GET ALL AUDIENCE ERROR");
    console.log(error.message);
    res.status(500).send({
      success: false,
      error: error.message
    });
  }
});

// SEND NEWSLETTER
router.post("/send/newsletter", auth, async (req, res) => {
  const accountId = req.account.id;
  const newsletter = req.body;
  const email = newsletter.email;
  const isTrackingOpen = newsletter.trackingConfig.isCheckingOpenedEmail;
  const isTrackingClick = newsletter.trackingConfig.isCheckingClickedUrl;
  const clickUrl = newsletter.trackingUrl;
  const selectedAudiences = newsletter.selectedAudiences;

  // console.log("ROUTE SEND NEWSLETTER", newsletter);

  try {
    // const sender = "abc@abc.com";
    const sender = "vinhnqse63033@fpt.edu.vn";
    const subscriberList = new Map();
    let subscriberArr = [];
    let receiverList = [];
    let succeededReceivers = [];
    let failedReceivers = [];

    // GET SUBSCRIBERS FROM AUDIENCES
    const getSubscriberList = async (subscriberList, subscriberArr) => {
      for (let i = 0; i < selectedAudiences.length; i++) {
        const selectedAudience = selectedAudiences[i];

        console.log(` ** AUDIENCE: "${selectedAudience.label}"`);

        const getAudienceSubscriberResult = await audience_dao.getSubscribersByAudienceId(selectedAudience.key);

        if (!getAudienceSubscriberResult.success) {
          res
            .status(500)
            .send({ success: false, error: `Cannot get subscribers in "${selectedAudience.label}". Error occured!` });
        }

        const subscribers = getAudienceSubscriberResult.subscribers;
        // console.log(`***** "${selectedAudience.label}" subscribers ----------------`);
        for (let index = 0; index < subscribers.length; index++) {
          const subscriber = subscribers[index];
          // console.log("**ROUTE NEWSLETTER SEND MAIL subscriber");
          // console.log(JSON.stringify(subscriber));

          // Update to subscriberList without duplication
          subscriberList.set(subscriber.id, {
            storeId: subscriber.account_id,
            emailAddress: subscriber.email
          });
        }

        // END OF FOR
      }

      // CHECK RECEIVERS IN RECEIVERLIST
      console.log("** ROUTE SEND EMAIL checking subscriberList");
      for (const receiver of subscriberList) {
        //

        console.log(`${receiver[1].emailAddress} --------------------------- <${receiver[0].toUpperCase()}>`);
        subscriberArr.push({
          subscriberId: receiver[0],
          values: receiver[1]
        });

        // END OF FOR
      }
    };

    // CHECK EMAIL EXISTENCE
    const checkEmailExistence = async receiverList => {
      console.log();
      console.log("--------- START - VERIFY SUBSCRIBER EMAIL ADDRESS LOOP ---------");
      for (const subscriber of subscriberList) {
        const subscriberId = subscriber[0];
        const subscriberEmailAddress = subscriber[1].emailAddress;

        let emailSubscriber = new EmailSubscriber();

        emailSubscriber.subscriber_id = subscriberId;
        emailSubscriber.email_id = email.id;
        emailSubscriber.has_opened_email = false;
        emailSubscriber.has_clicked_url = false;
        emailSubscriber.is_sent = false;
        emailSubscriber.is_tracking_open = isTrackingOpen;
        emailSubscriber.is_tracking_click = isTrackingClick;

        let receiver = {
          emailAddress: subscriberEmailAddress,
          emailSubscriber: emailSubscriber
        };

        const result = await email_dao.verify(subscriberEmailAddress);
        receiver.emailSubscriber.is_bounced = !result;

        receiverList.push(receiver);
      }
      console.log();
      console.log("TOTAL SUBSCRIBERS: ", subscriberList.size);

      console.log("--------- END - VERIFY SUBSCRIBER EMAIL ADDRESS LOOP ---------");
      console.log();
    };

    // CHECKING receiverList
    const displayReceivers = async () => {
      console.log();
      let totalReceiver = 0;
      for (const receiver of receiverList) {
        ++totalReceiver;
        console.log("** ROUTE SEND EMAIL checking receiver in receiverList");
        console.log(JSON.stringify(receiver));
        console.log();

        // END OF FOR
      }
      console.log("TOTAL RECEIVERS: ", totalReceiver);
    };

    // SEND NEWSLETTER
    const sendNewsletter = async (recipient, newEmailId) => {
      console.log("New_Email_Id ", newEmailId);
      // Add tracking url to HTML email content
      let newEmailContent = email.htmlContent;

      // Tracking open
      if (isTrackingOpen) {
        newEmailContent = newEmailContent.replace(
          TrackingType.OPEN.searchStr,
          `<img src="https://emm-api-server.herokuapp.com/api/emails/tracking/${TrackingType.OPEN.id}/?sid=${recipient.emailSubscriber.subscriber_id}&eid=${newEmailId}" style="display:none" />`
        );
      } else {
        newEmailContent = newEmailContent.replace(TrackingType.OPEN.searchStr, "");
      }

      // Tracking clicked URL
      if (isTrackingClick) {
        newEmailContent = newEmailContent.replace(
          TrackingType.CLICK.searchStr,
          `<a href="https://emm-api-server.herokuapp.com/api/emails/tracking/${TrackingType.CLICK.id}/?sid=${recipient.emailSubscriber.subscriber_id}&eid=${newEmailId}&rurl=http://${clickUrl}"`
        );
      }

      // Remove unsubscribe link
      const url = `http://localhost:3001/#/`;
      // const url = `http://emm-api-client.herokuapp.com/#/`;
      newEmailContent = newEmailContent.replace(TrackingType.UNSUBSCRIBE.searchStr2, "");
      newEmailContent = newEmailContent.replace(TrackingType.UNSUBSCRIBE.searchStr1, "");

      // Add the below constant in the declaration part
      // const TrackingType = require("../../../constants/email/tracking/trackingCondition.constant");

      // // Handling unsubscribe
      // const testUrl = `http://localhost:3001/#/subscriber/unsubscribe`;
      // const url = `http://emm-api-client.herokuapp.com/#/subscriber/unsubscribe`;
      // const subscriberId = "abc";
      // const audienceId = "abc";
      // const campaignId = "abc";
      // newEmailContent = newEmailContent.replace(
      //   TrackingType.UNSUBSCRIBE.searchStr1,
      //   `<a href="${testUrl}?sid=${subscriberId}&aid=${audienceId}&cid=${campaignId}">Unsubscribe me</a> now!`
      // );

      const sendingEmailContent = {
        id: recipient.emailSubscriber.email_id,
        to: recipient.emailAddress,
        subject: email.subject,
        html: newEmailContent
      };

      const sendingResult = await email_dao.sendMail(sendingEmailContent);
      return sendingResult;
    };

    // CHECKING IF EMAIL_SUBSCRIBER IS/IS NOT IN DB,
    // THEN SEND NEWSLETTER
    // AND UPDATE TO DB
    const checkEmailSubscriberIsSent = async (receiverList, succeededReceivers, failedReceivers) => {
      let newEmail = new Email();
      newEmail.id = "";
      newEmail.from = email.from;
      newEmail.subject = email.subject;
      newEmail.body = email.htmlContent;
      newEmail.raw_content = email.rawContent;
      newEmail.template_id = null;
      newEmail.status_id = EmailStatusConstant.ACTIVATED.id;
      newEmail.origin_id = email.id;

      let newEmailReturn = await email_dao.createEmail(newEmail);

      // if (newEmailReturn) {
      console.log(`COMPARING EMAIL ID ${newEmailReturn.id} --- ${email.id}`);

      for (const recipient of receiverList) {
        const emailSubscriber = recipient.emailSubscriber;

        let updatedEmailSubscriber = new EmailSubscriber();

        updatedEmailSubscriber.subscriber_id = emailSubscriber.subscriber_id;
        updatedEmailSubscriber.email_id = newEmailReturn.id;
        updatedEmailSubscriber.has_clicked_url = emailSubscriber.has_clicked_url;
        updatedEmailSubscriber.has_opened_email = emailSubscriber.has_opened_email;
        updatedEmailSubscriber.is_bounced = emailSubscriber.is_bounced;
        updatedEmailSubscriber.is_sent = emailSubscriber.is_sent;
        updatedEmailSubscriber.is_tracking_click = emailSubscriber.is_tracking_click;
        updatedEmailSubscriber.is_tracking_open = emailSubscriber.is_tracking_open;

        // send mail first then add to db
        if (!emailSubscriber.is_bounced) {
          const sendingResult = await sendNewsletter(recipient, newEmailReturn.id);
          updatedEmailSubscriber.is_bounced = !sendingResult;
          updatedEmailSubscriber.is_sent = true;

          succeededReceivers.push({
            subscriberId: updatedEmailSubscriber.subscriber_id,
            recipient_email: recipient.emailAddress,
            email_id: updatedEmailSubscriber.email_id,
            is_bounced: updatedEmailSubscriber.is_bounced,
            is_sent: updatedEmailSubscriber.is_sent,
            is_tracking_open: updatedEmailSubscriber.is_tracking_open,
            is_tracking_click: updatedEmailSubscriber.is_tracking_click,
            origin_id: email.id
          });
        } else {
          updatedEmailSubscriber.is_bounced = true;
          updatedEmailSubscriber.is_sent = true;

          failedReceivers.push({
            subscriberId: updatedEmailSubscriber.subscriber_id,
            recipient_email: recipient.emailAddress,
            email_id: updatedEmailSubscriber.email_id,
            is_bounced: updatedEmailSubscriber.is_bounced,
            is_sent: updatedEmailSubscriber.is_sent,
            is_tracking_open: updatedEmailSubscriber.is_tracking_open,
            is_tracking_click: updatedEmailSubscriber.is_tracking_click,
            origin_id: email.id
          });
        }

        // add to db
        await addToDB(updatedEmailSubscriber);
        // }
      }
      // console.log("TOTAL SENT: ", sentCount);
    };

    const addToDB = async emailSubscriber => {
      const addEmailSubscriberResult = await email_dao.addEmailSubscriber(emailSubscriber);
      // console.log(addEmailSubscriberResult);
    };

    const waitUntilFinishCheckingEmailExistence = async (receiverList, succeededReceivers, failedReceivers) => {
      console.log("WAIT TIME = ", waitTime);

      setTimeout(async () => {
        await displayReceivers();
        await checkEmailSubscriberIsSent(receiverList, succeededReceivers, failedReceivers);

        // RESPONSE RESULT
        console.log(`SENT SUCCESSFULLY: ${succeededReceivers.length}`);
        console.log(`FAILED TO SEND: ${failedReceivers.length}`);

        res.status(200).send({
          success: true,
          totalSubscribers: subscriberList.size,
          totalReceivers: receiverList.length,
          receivers: receiverList,
          subscribers: subscriberArr,
          sendResult: {
            success: succeededReceivers,
            failure: failedReceivers
          }
        });
      }, waitTime);
    };

    // EXECUTE SENDING NEWSLETTER PROCESS
    await getSubscriberList(subscriberList, subscriberArr);

    let waitTime = subscriberList.size === 0 ? 0 : (subscriberList.size / 10) * 3000 + 2000;

    await checkEmailExistence(receiverList);

    await waitUntilFinishCheckingEmailExistence(receiverList, succeededReceivers, failedReceivers);
    // end
  } catch (error) {
    console.log("** ROUTE SEND MAIL ERROR");
    console.log(error.message);
    res.status(500).send({
      success: false,
      error: error.message
    });
  }
});

// GET Audience for newsletters
router.get("/getAudienceByNewsletterId/:id", auth, async (req, res) => {
  let newsletterId = req.params.id;
  try {
    const audience = await newsletter_dao.getAudienceByNewsletterId(newsletterId);

    res.json(audience);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error: " + error.message);
  }
});

module.exports = router;
