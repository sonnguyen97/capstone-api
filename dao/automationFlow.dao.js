const db = require("../config/db");
const sequelize = require("sequelize");
const Op = sequelize.Op;

const uuid = require("uuid/v4");

const Account = require("../models/Account");
const AutomationFlow = require("../models/AutomationFlow");
const AutomationFlowOperationStatus = require("../models/AutomationFlowOperationStatus");
const Step = require("../models/Step");
const StepType = require("../models/StepType");

const { AVAILABLE, RUNNING } = require("../constants/automation-flow/AutomationFlowOperationStatus.constant");
const { ACTION, CONDITION } = require("../constants/automation-flow/step/StepType.constant");

module.exports = {
  changeStatus: async (ownerId, automationFlowId, statusId) => {
    var changeResult = null;

    try {
      // Create a transaction instance for changing AutomationFlow status process
      changeResult = db.transaction(async transaction => {
        // Retrieve the AutomationFlow
        var automationFlow = await getAutomationFlow(ownerId, automationFlowId, transaction);

        // If the AutomationFlow is found
        if (automationFlow !== null) {
          // If nothing has been changed between the current status and the upcoming status
          if (automationFlow.status.id === statusId) {
            return automationFlow;
          } else {
            // Update the Automation Flow Operation Status
            const updateResult = await AutomationFlow.update(
              {
                last_modified_date: null,
                status_id: statusId
              },
              {
                where: {
                  id: automationFlow.id
                },
                transaction: transaction
              }
            );

            // Update successfully
            if (updateResult !== null && updateResult[0] > 0) {
              // Get new updated Automation Flow
              automationFlow = await getAutomationFlow(ownerId, automationFlowId, transaction);

              if (statusId === RUNNING.id) {
                // Start the Automation Flow
                await startAutomationFlow(ownerId, automationFlow);
              }

              return automationFlow;
            } else {
              throw new Error("Failed to update AutomationFlow: " + JSON.stringify(automationFlow));
            }
          }
        } else {
          // If the ID does not matched with any AutomationFlow ID
          throw new Error("AutomationFlow with ID: " + automationFlowId + " not found!");
        }
      });
    } catch (error) {
      throw new Error(error.message);
    }

    return changeResult;
  },

  /**
   * Find a specific Automation Flow by its ID
   * @param {string} ownerId ID of the Account to retrieve its owned Automation Flow
   * @param {string} automationFlowId ID of the Automation Flow to retrieve
   * @returns {Promise<object>} The Automation Flow object with the Steps included or null if not found
   * @throws any exception if occurs
   */
  find: async (ownerId, automationFlowId) => {
    var findResult = null;

    try {
      // Create a transaction instance for retrieving AutomationFlow process
      findResult = await db.transaction(async transaction => {
        // Retrieving AutomationFlow process temporarily
        var automationFlow = await getAutomationFlow(ownerId, automationFlowId, transaction);

        return automationFlow;
      });
    } catch (error) {
      throw new Error(error.message);
    }

    return findResult;
  },

  /**
   * Get all Automation Flows which belong to a specific Account
   * @param {string} ownerId ID of the Account to retrieve its owned Automation Flows
   * @returns {Promise<Array>} An array contains all Automation Flows descending ordered
   * by last modified date
   */
  findAll: async ownerId => {
    return await AutomationFlow.findAll({
      attributes: ["id", ["last_modified_date", "lastModifiedDate"], "name"],
      include: [
        {
          model: AutomationFlowOperationStatus,
          as: "status",
          attributes: ["name"]
        }
      ],
      where: {
        owner_id: ownerId,
        [Op.or]: [{ status_id: AVAILABLE.id }, { status_id: RUNNING.id }]
      },
      order: [["last_modified_date", "DESC"]]
    });
  },

  /**
   * Retrieve an Automation Flow Operation status. The status in one of below:
   * - Available
   * - Deleted
   * - Running
   * @param {string} ownerId ID of the Account to retrieve its owned Automation Flow
   * @param {string} automationFlowId ID of the Automation Flow to retrieve
   * @returns {Promise<object>} The retrieved status or null if any exception occurs
   */
  getAutomationFlowStatus: async (ownerId, automationFlowId) => {
    const findResult = await AutomationFlow.findOne({
      attributes: [],
      include: [
        {
          model: AutomationFlowOperationStatus,
          as: "status",
          attributes: ["id", "name"]
        }
      ],
      where: {
        id: automationFlowId,
        owner_id: ownerId
      }
    }).then(result => result.dataValues.status);

    return findResult ? findResult : null;
  },

  /**
   * Convert a raw data to an AutomationFlow and save its to database.
   * Since an AutomationFlow has many Steps, so saving process will be performed in an transaction
   * which is only commited if all of the children saving processes is success, otherwise, nothing is
   * saved.
   * @param {string} ownerId ID of an Account who has created this AutomationFlow
   * @param {string} raw data of an incoming AutomationFlow to be saved in JSON format
   * @returns A new saved AutomationFlow or null if any exception occurs
   * @throws any exception if occurs
   */
  save: async (ownerId, raw) => {
    var saveResult = null;

    try {
      // Create a transaction instance for saving AutomationFlow process
      saveResult = await db.transaction(async transaction => {
        // Saving AutomationFlow process temporarily
        var result = await saveAutomationFlow(ownerId, raw, transaction);

        return result;
      });
    } catch (error) {
      throw new Error(error.message);
    }

    return saveResult;
  },

  /**
   * Convert a raw data to an AutomationFlow and update its to an exsited AutomationFlow in database.
   * Since an AutomationFlow has many Steps, so saving process will be performed in an transaction
   * which is only commited if all of the children saving processes is success, otherwise, nothing is
   * saved.
   * @param {string} ownerId ID of an Account who has created this AutomationFlow
   * @param {string} raw data of an incoming AutomationFlow to be updated in JSON format
   * @returns A new updated AutomationFlow or null if any exception occurs
   * @throws any exception if occurs
   */
  update: async (ownerId, raw) => {
    var updateResult = null;

    try {
      // Create a transaction instance
      updateResult = await db.transaction(async transaction => {
        // Retrieve old AutomationFlow process
        var oldAutomationFlow = await getAutomationFlow(ownerId, raw.id, transaction);
        // End of process

        // --------------- Line Break --------------- //

        // Delete old AutomationFlow process
        if (oldAutomationFlow !== null) {
          if (oldAutomationFlow.stepSequence !== null) {
            // Delete all Step sequence of its
            await deleteStep(oldAutomationFlow.stepSequence, transaction);
          }

          // Delete the old AutomationFlow
          await AutomationFlow.destroy({
            where: {
              id: oldAutomationFlow.id
            },
            transaction: transaction
          });
          // End of process

          // --------------- Line Break --------------- //

          // Save new AutomationFlow process
          var saveResult = await saveAutomationFlow(ownerId, raw, transaction);

          if (saveResult !== null) {
            var newAutomationFlow = await getAutomationFlow(ownerId, saveResult.id, transaction);

            return newAutomationFlow;
          } else {
            throw new Error("Failed to Update AutomationFlow: " + JSON.stringify(raw));
          }
          // End of process
        } else {
          throw new Error("AutomationFlow not found: " + JSON.stringify(raw));
        }
      });
    } catch (error) {
      throw new Error(error.message);
    }

    return updateResult;
  }
};

/**
 * Recursive functions to delete all Steps, i.e. Action or Condition, belongs to a specific Step
 * by its ID
 * @param {object} currentStep A Step object which contains its ID and type to determine whether it's Action
 * or Condtion
 * @param {object} transaction A transaction instance
 * @returns {boolean} the result of deleting process
 * @throws any exception if occurs
 */
const deleteStep = async (currentStep, transaction) => {
  var deleteStepResult;

  switch (currentStep.stepCommonData.stepType.id) {
    case ACTION.id:
      if (currentStep.nextStep !== null) {
        deleteStepResult = await deleteStep(currentStep.nextStep, transaction);
      } else {
        // Delete the current Step => delete the corresponding Action
        deleteStepResult = await stepDao.delete(currentStep.stepCommonData.id, transaction);
      }

      if (!deleteStepResult) {
        throw new Error("Exception when deleting Action: " + JSON.stringify(currentStep));
      }

      return deleteStepResult;
    case CONDITION.id:
      if (currentStep.matchedStep !== null || currentStep.failedStep !== null) {
        var deletedMatchedStepResult, deleteFailedStepResult;

        if (currentStep.matchedStep !== null) {
          deletedMatchedStepResult = await deleteStep(currentStep.matchedStep, transaction);
        }

        if (currentStep.failedStep !== null) {
          deleteFailedStepResult = await deleteStep(currentStep.failedStep, transaction);
        }

        deleteStepResult = deletedMatchedStepResult || deleteFailedStepResult;
      } else {
        // Delete the current Step => delete the corresponding Condition
        deleteStepResult = await stepDao.delete(currentStep.stepCommonData.id, transaction);
      }

      if (!deleteStepResult) {
        throw new Error("Exception when deleting Condition: " + JSON.stringify(currentStep));
      }

      return deleteStepResult;
  }
};

/**
 * Create a retrieving AutomationFlow regardless of Status process which includes:
 * - Retrieving AutomationFlow process which contains the first saved Step ID
 * - Retrieving all Steps processes
 * @param {string} ownerId ID of the Account to retrieve its owned Automation Flows
 * @param {string} automationFlowId ID of an AutomationFlow to be retrieved
 * @param {object} transaction A transaction instance
 * @returns An existed AutomationFlow object or null if not found
 */
const getAutomationFlow = async (ownerId, automationFlowId, transaction) => {
  const automationFlow = await AutomationFlow.findOne({
    attributes: ["id", ["last_modified_date", "lastModifiedDate"], "name"],
    include: [
      {
        model: Account,
        as: "owner",
        attributes: ["id", "email", "store_domain", "store_name"]
      },
      {
        model: AutomationFlowOperationStatus,
        as: "status",
        attributes: ["id", "name"]
      },
      {
        model: Step,
        as: "stepSequence",
        attributes: ["id"],
        include: [
          {
            model: StepType,
            as: "stepType",
            attributes: ["id", "name"]
          }
        ]
      }
    ],
    where: {
      id: automationFlowId,
      owner_id: ownerId
    },
    transaction: transaction
  });

  if (automationFlow) {
    if (automationFlow.stepSequence !== null) {
      // Recursive call to get all available Steps of this Automation Flow by using the root is the first Step
      const stepSequence = await getStep(automationFlow.stepSequence, transaction);

      Object.assign(automationFlow.stepSequence, stepSequence);
    }

    return automationFlow;
  } else {
    return null;
  }
};

/**
 * Recursive functions to retrieve all Steps, i.e. Action or Condition, belongs to a specific Step
 * by its ID
 * @param {object} currentStep A Step object which contains its ID and type to determine whether it's Action
 * or Condtion
 * @param {object} transaction A transaction instance
 * @returns {object} the Step with fully children Steps within it.
 */
const getStep = async (currentStep, transaction) => {
  switch (currentStep.stepType.id) {
    case ACTION.id:
      const action = await actionDao.find(currentStep.id, transaction);

      if (action) {
        if (action.nextStep !== null) {
          // Recursive retrieve the next Step
          const nextStep = await getStep(action.nextStep, transaction);

          Object.assign(action.nextStep, nextStep);
        }

        return action;
      }
    case CONDITION.id:
      const condition = await conditionDao.find(currentStep.id, transaction);

      if (condition) {
        if (condition.matchedStep !== null) {
          // Recursive call the next matched step
          const matchedStep = await getStep(condition.matchedStep, transaction);

          Object.assign(condition.matchedStep, matchedStep);
        }

        if (condition.failedStep !== null) {
          // Recursive call the next failed step
          const failedStep = await getStep(condition.failedStep, transaction);

          Object.assign(condition.failedStep, failedStep);
        }

        return condition;
      }
  }
};

/**
 * Create a saving AutomationFlow process which includes:
 * - Saving Steps processes
 * - Saving AutomationFlow process which contains the first saved Step ID
 * @param {string} ownerId ID of an account who's creating this AutomationFlow
 * @param {string} raw Raw data which to be converted into an AutomationFlow model data
 * @param {object} transaction A transaction instance
 * @returns A new created AutomationFlow object
 * @throws any exception if occurs
 */
const saveAutomationFlow = async (ownerId, raw, transaction) => {
  // Save Step sequence first to get its ID
  var firstStepId = null;
  if (raw.stepSequence !== null) {
    var firstStep = await saveStep(raw.stepSequence, transaction);
    firstStepId = firstStep.id;
  }

  var data = {
    id: uuid(),
    name: raw.name,
    owner_id: ownerId,
    status_id: AVAILABLE.id,
    first_step_id: firstStepId
  };

  const automationFlow = await AutomationFlow.create(data, {
    transaction: transaction
  });

  if (automationFlow) {
    return automationFlow;
  } else {
    throw new Error("Exception when saving AutomationFlow: " + JSON.stringify(data));
  }
};

/**
 * Recursive functions to save all Steps, i.e. Action or Condition.
 * These saving process will be performed in an transaction which is only commited when all of the
 * children saving processes is success, otherwise, nothing is saved.
 * @param {object} currentStep A Step object which contains all of its information, include Action information
 * and Condition information
 * @param {object} transaction A transaction instance
 * @returns {object} the Step with fully children Steps within it.
 * @throws any exception if occurs
 */
const saveStep = async (currentStep, transaction) => {
  var step = await stepDao.save(currentStep.stepCommonData, transaction);
  var data;

  // Save successfully
  if (step) {
    switch (step.type_id) {
      case ACTION.id:
        // Save next Step first to get its ID
        var nextStepId = null;
        if (currentStep.nextStep !== null) {
          var nextStep = await saveStep(currentStep.nextStep, transaction);
          nextStepId = nextStep.id;
        }

        data = {
          id: step.id,
          campaign_id: currentStep.newsletter.id,
          next_step_id: nextStepId
        };

        var action = await actionDao.save(data, transaction);

        if (action) {
          return action;
        } else {
          throw new Error("Exception when saving Action: " + JSON.stringify(data));
        }
      case CONDITION.id:
        // Save matched Step first to get its ID
        var matchedStepId = null;
        if (currentStep.matchedStep !== null) {
          var matchedStep = await saveStep(currentStep.matchedStep, transaction);
          matchedStepId = matchedStep.id;
        }

        // Save failed Step next to get its ID
        var failedStep = null;
        if (currentStep.failedStep !== null) {
          var failedStep = await saveStep(currentStep.failedStep, transaction);
          failedStepId = failedStep.id;
        }

        data = {
          id: step.id,
          condition_type_id: currentStep.conditionType.id,
          condition_match_step_id: matchedStepId,
          condition_failed_step_id: failedStepId
        };

        var condition = await conditionDao.save(data, transaction);

        if (condition) {
          return condition;
        } else {
          throw new Error("Exception when saving Condition: " + JSON.stringify(data));
        }
    }
  } else {
    throw new Error("Exception when saving Step: " + JSON.stringify(currentStep.stepCommonData));
  }
};

const startAutomationFlow = async (ownerId, automationFlow) => {
  if (automationFlow.stepSequence !== null) {
    // Current executed time
    var now = new Date();

    // Begin Start Automation Flow
    console.log(
      "> Begin Start AutomationFlow with params: ",
      JSON.stringify({
        ownerId: ownerId,
        automationFlow: automationFlow,
        now: now
      })
    );

    await stepDao.startStep(ownerId, automationFlow.id, null, automationFlow.stepSequence, now);
  }
};

const actionDao = require("./action.dao");
const conditionDao = require("./condition.dao");
const stepDao = require("./step.dao");
