const uuid = require("uuid/v4");
const schedule = require("node-schedule");

const Action = require("../models/Action");
const Campaign = require("../models/Campaign");
const Step = require("../models/Step");
const StepType = require("../models/StepType");

const { RUNNING } = require("../constants/automation-flow/AutomationFlowOperationStatus.constant");
const { CLICK, OPEN, UNSUBSCRIBE } = require("../constants/email/tracking/trackingCondition.constant");

module.exports = {
  /**
   * Perform querying to retrieve a specific Action by its ID.
   * If a transaction is passed as second argument, this will perform a transaction query process instead of an independent query.
   * @param {string} stepId ID of the Action to be retrieved
   * @param {object} transaction A transaction instance (optional)
   * @returns {object} The Action object with the Campaign included or null if not found.
   */
  find: async (stepId, transaction = null) => {
    var queryOptions = {
      attributes: [],
      include: [
        {
          model: Step,
          as: "stepCommonData",
          attributes: ["id", ["start_duration", "startDuration"]],
          include: [
            {
              model: StepType,
              as: "stepType",
              attributes: ["id", "name"]
            }
          ]
        },
        {
          model: Campaign,
          as: "newsletter",
          attributes: ["id", "name"]
        },
        {
          model: Step,
          as: "nextStep",
          attributes: ["id"],
          include: [
            {
              model: StepType,
              as: "stepType",
              attributes: ["id", "name"]
            }
          ]
        }
      ]
    };

    if (transaction !== null) {
      queryOptions["transaction"] = transaction;
    }

    const action = await Action.findByPk(stepId, queryOptions);

    return action ? action : null;
  },

  /**
   * Perform querying to save an Action.
   * If a transaction is passed as second argument, this will perform a transaction query process instead of an independent query.
   * @param {object} data Raw data of the Action information
   * @param {object} transaction A transaction instance
   * @returns {object} A new created Action or null if any exception occurs
   */
  save: async (data, transaction = null) => {
    var queryOptions = {};

    if (transaction !== null) {
      queryOptions["transaction"] = transaction;
    }

    const action = await Action.create(data, queryOptions);

    return action ? action : null;
  },

  startAction: async (ownerId, automationFlowId, action, startDate) => {
    // Begin Start Action
    console.log("> Begin Start Action with params: ", {
      ownerId: ownerId,
      automationFlowId: automationFlowId,
      action: action,
      startDate: startDate
    });

    // Schedule a Cron Job to be run at the configured date
    schedule.scheduleJob(startDate, function() {
      executeAction(ownerId, automationFlowId, action);
    });
  }
};

const executeAction = async (ownerId, automationFlowId, action) => {
  // Begin Execute Action
  console.log("> Begin Execute Action with params: ", {
    ownerId: ownerId,
    automationFlowId: automationFlowId,
    action: action
  });

  // Retrieve an Automation Flow current Operation Status
  const status = await automationFlowDao.getAutomationFlowStatus(ownerId, automationFlowId);

  console.log(">>> Retrieved AutomationFlow status: ", JSON.stringify(status));

  // If and only if the current status is running, the rest of the action is performed
  if (status !== null && status.id === RUNNING.id) {
    // Retrieve a Newsletter by its ID from Action
    const newsletter = await newsletterDao.find(ownerId, action.newsletter.dataValues.id);

    console.log(">>> Retrieved Newsletter: ", newsletter);

    if (newsletter !== null) {
      // Retreive an Email belongs to the Newsletter
      var email = await emailDao.find(newsletter.emailId);

      console.log(">>> Retrieved Email: ", JSON.stringify(email));

      if (email !== null) {
        // Retrieve a list of Recipients who are gonna receive the Email from the Newsletter
        const recipients = await audienceCampaignSubscriberDao.getCampaignRecipients(newsletter.id);

        console.log(">>> Retrieved list Recipients: ", recipients);

        if (recipients !== null) {
          // New Email in case the Email has been sent
          const newEmail = {
            ...email,
            id: uuid()
          };

          await Promise.all(
            recipients.map(async recipient => {
              // Verify email existence, verify failed means email will be bounced
              const isVerified = await emailDao.verify(recipient.email);
              var saveResult;

              console.log(">>>>> Recipient " + JSON.stringify(recipient) + " bounced status: " + !isVerified);

              // Verify the email sending status
              const emailSubscriber = await emailSubscriberDao.find(email.id, recipient.id);
              setTimeout(async () => {
                console.log("EMAIL_SUBSCRIBER_RESULT ", emailSubscriber);
              }, 2500);

              // Email is sent already, create a new one with same value
              if (emailSubscriber !== null) {
                console.log(
                  ">>>>> Recipient " + JSON.stringify(recipient) + " sent email status: " + emailSubscriber.isSent
                );

                if (emailSubscriber.isSent === 1) {
                  // Only perform as the first time when Email instance is not changed
                  if (email.id !== newEmail.id) {
                    email = newEmail;

                    // Save new Email with the same data
                    saveResult = await emailDao.save(email);

                    setTimeout(async () => {
                      console.log(">>>>>>> New Email: " + email);
                    }, 2500);

                    // Any exception occurs
                    if (saveResult === null) {
                      throw new Error("Error when saving Email: " + JSON.stringify(email));
                    }
                  }
                }
              }

              // If email is existed, sending process may not be bounced
              if (isVerified) {
                // Save new Email_Subscriber, bounced is false
                saveResult = await emailSubscriberDao.save(email.id, recipient.id, !isVerified);

                // Setup tracking information: Click
                if (newsletter.isTrackingClick === 1) {
                  email.body = email.body.replace(
                    CLICK.searchStr,
                    '<a href="https://emm-api-server.herokuapp.com/api/emails/tracking/' +
                      CLICK.id +
                      "/" +
                      "?sid=" +
                      recipient.id +
                      "&eid=" +
                      email.id +
                      "&rurl=" +
                      newsletter.trackingUrl +
                      '"'
                  );
                } else {
                  email.body = email.body.replace(CLICK.searchStr, '<a href="' + newsletter.trackingUrl + '"');
                }

                // Setup tracking information: Open
                if (newsletter.isTrackingOpen === 1) {
                  email.body = email.body.replace(
                    OPEN.searchStr,
                    '<img src="https://emm-api-server.herokuapp.com/api/emails/tracking/' +
                      OPEN.id +
                      "/" +
                      "?sid=" +
                      recipient.id +
                      "&eid=" +
                      email.id +
                      '" ' +
                      'style="display:none" />'
                  );
                } else {
                  email.body = email.body.replace(OPEN.searchStr, "");
                }

                // Remove unsubscribe URL
                email.body = email.body.replace(UNSUBSCRIBE.searchStr2, "").replace(UNSUBSCRIBE.searchStr1, "");

                // Content to be sent
                const sendContent = {
                  id: email.id,
                  to: recipient.email,
                  subject: email.subject,
                  html: email.body
                };

                // Send the Email
                // console.log(sendContent.html)

                const sendResult = await emailDao.sendMail(sendContent);
                setTimeout(async () => {
                  console.log(">> Send Result: ", sendResult);
                }, 5000);

                // Update the Email Result
                const updateSentResult = await emailSubscriberDao.updateSentStatus(email.id, recipient.id, sendResult);

                // Any exception occurs
                if (updateSentResult === false) {
                  throw new Error(
                    "Error when updating Email_Subscriber: " +
                      JSON.stringify({
                        email_id: email.id,
                        subscriber_id: recipient.id
                      })
                  );
                }

                return sendResult;
              } else {
                // Save new Email_Subscriber, bounced is true
                saveResult = await emailSubscriberDao.save(email.id, recipient.id, !isVerified);

                // Any exception occurs
                if (saveResult === null) {
                  throw new Error(
                    "Error when saving Email_Subscriber: " +
                      JSON.stringify({
                        email_id: email.id,
                        subscriber_id: recipient.id
                      })
                  );
                }

                return saveResult;
              }
            })
          );
        }
      }
    }

    if (action.nextStep !== null) {
      // Current executed time
      const now = new Date();
      await stepDao.startStep(ownerId, automationFlowId, action, action.nextStep, now);
    }
  }
};

const automationFlowDao = require("./automationFlow.dao");
const audienceCampaignSubscriberDao = require("./audienceCampaignSubscriber.dao");
const emailDao = require("./email.dao");
const emailSubscriberDao = require("./emailSubscriber.dao");
const newsletterDao = require("./newsletter.dao");
const stepDao = require("./step.dao");
