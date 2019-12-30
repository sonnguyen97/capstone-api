const db = require("../config/db");
const schedule = require("node-schedule");

const Condition = require("../models/Condition");
const ConditionType = require("../models/ConditionType");
const Step = require("../models/Step");
const StepType = require("../models/StepType");

const { RUNNING } = require("../constants/automation-flow/AutomationFlowOperationStatus.constant");
const { CLICKED, OPENED } = require("../constants/automation-flow/step/condition/ConditionType.constant");

module.exports = {
  /**
   * Perform querying to retrieve a specific Condition by its ID.
   * If a transaction is passed as second argument, this will perform a transaction query process instead of an independent query.
   * @param {string} stepId ID of the Condition to be retrieved
   * @param {object} transaction A transaction instance (optional)
   * @returns {Promise<object>} A new created Condition or null if any exception occurs
   */
  find: async (stepId, transaction = null) => {
    var queryOptions = {
      attributes: [],
      include: [
        // Step Common Data
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
        // Condition Type
        {
          model: ConditionType,
          as: "conditionType",
          attributes: ["id", "name", "description"]
        },
        // Matched Step
        {
          model: Step,
          as: "matchedStep",
          attributes: ["id"],
          include: [
            {
              model: StepType,
              as: "stepType",
              attributes: ["id", "name"]
            }
          ]
        },
        // Failed Step
        {
          model: Step,
          as: "failedStep",
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

    const condition = await Condition.findByPk(stepId, queryOptions);

    return condition ? condition : null;
  },

  /**
   * Perform querying to save an Action.
   * If a transaction is passed as second argument, this will perform a transaction query process instead of an independent query.
   * @param {object} data Raw data of the Condition information
   * @param {object} transaction A transaction instance (optional)
   * @returns {object} A new created Condition or null if any exception occurs
   */
  save: async (data, transaction = null) => {
    var queryOptions = {};

    if (transaction !== null) {
      queryOptions["transaction"] = transaction;
    }

    const condition = await Condition.create(data, queryOptions);

    return condition ? condition : null;
  },

  startCondition: async (ownerId, automationFlowId, currentAction, condition, startDate) => {
    // Begin Start Condition
    console.log("> Begin Start Condition with params: ", {
      ownerId: ownerId,
      automationFlowId: automationFlowId,
      currentAction: currentAction,
      condition: condition,
      startDate: startDate
    });

    // Schedule a Cron Job to be run at the configured date
    schedule.scheduleJob(startDate, function() {
      executeCondition(ownerId, automationFlowId, currentAction, condition);
    });
  }
};

const executeCondition = async (ownerId, automationFlowId, currentAction, condition) => {
  // Ensure no params is null
  if (ownerId !== null && automationFlowId !== null && currentAction !== null && condition !== null) {
    // Begin Execute Condition
    console.log(
      "> Begin Execute Condition with params: ",
      JSON.stringify({
        ownerId: ownerId,
        automationFlowId: automationFlowId,
        currentAction: currentAction,
        condition: condition
      })
    );

    // Retrieve an Automation Flow current Operation Status
    const status = await automationFlowDao.getAutomationFlowStatus(ownerId, automationFlowId);

    console.log(">>> Retrieved AutomationFlow status: ", JSON.stringify(status));

    // If and only if the current status is running, the rest of the action is performed
    if (status !== null && status.id === RUNNING.id) {
      // Retrieve a Newsletter by its ID from Action
      const newsletter = await newsletterDao.find(ownerId, currentAction.newsletter.id);

      console.log(">>> Retrieved Newsletter: ", newsletter);

      if (newsletter !== null) {
        // Verify the Newsletter Tracking config
        const isTracking =
          (condition.conditionType.dataValues.id === CLICKED.id && newsletter.isTrackingClick === 1) ||
          (condition.conditionType.dataValues.id === OPENED.id && newsletter.isTrackingOpen === 1);

        console.log(">>> Condition Type: ", condition.conditionType);
        console.log(">>> Is tracking: ", isTracking);

        if (isTracking) {
          // Retreive an Email belongs to the Newsletter
          const email = await emailDao.find(newsletter.emailId);

          console.log(">>> Retrieved Email: ", JSON.stringify(email));

          if (email !== null) {
            // Current executed time
            const now = new Date();
            // Retrieve a list of Recipients who are gonna receive the Email from the Newsletter
            const recipients = await audienceCampaignSubscriberDao.getCampaignRecipients(newsletter.id);

            if (recipients !== null) {
              await Promise.all(
                recipients.map(async recipient => {
                  // Retrieve the email response status which is included in Email_Subscriber
                  const emailSubscriber = await emailSubscriberDao.find(email.id, recipient.id);

                  // Verify whether the condition is matched or not
                  const isConditionMatched =
                    (condition.conditionType.dataValues.id === CLICKED.id && emailSubscriber.hasClickedUrl === 1) ||
                    (condition.conditionType.dataValues.id === OPENED.id && emailSubscriber.hasOpenedEmail === 1);

                  if (isConditionMatched) {
                    if (condition.matchedStep !== null) {
                      await stepDao.startStep(ownerId, automationFlowId, currentAction, condition.matchedStep, now);
                    }
                  } else {
                    if (condition.failedStep !== null) {
                      await stepDao.startStep(ownerId, automationFlowId, currentAction, condition.failedStep, now);
                    }
                  }

                  return Promise.resolve();
                })
              );
            }
          }
        }
      }
    }
  }
};

const automationFlowDao = require("./automationFlow.dao");
const audienceCampaignSubscriberDao = require("./audienceCampaignSubscriber.dao");
const emailDao = require("./email.dao");
const emailSubscriberDao = require("./emailSubscriber.dao");
const newsletterDao = require("./newsletter.dao");
const stepDao = require("./step.dao");
