const uuid = require("uuid/v4");

const Step = require("../models/Step");

const { ACTION, CONDITION } = require("../constants/automation-flow/step/StepType.constant");

module.exports = {
  /**
   * Perform querying to delete a specific Step by its ID.
   * By default, delete a Step will also cascade a corresponding Action or Condition to be deleted.
   * If a transaction is passed as second argument, this will perform a transaction query process instead of an independent query.
   * @param {string} stepId ID of the Step to be delete
   * @param {object} transaction A transaction instance (optional)
   * @returns {boolean} true if delete successfully; otherwise, false
   */
  delete: async (stepId, transaction = null) => {
    var queryOptions = {
      where: {
        id: stepId
      }
    };

    if (transaction !== null) {
      queryOptions["transaction"] = transaction;
    }

    const result = await Step.destroy(queryOptions);

    return result ? result > 0 : false;
  },

  /**
   * Perform querying to save a Step.
   * If a transaction is passed as second argument, this will perform a transaction query process instead of an independent query.
   * @param {object} raw Raw data of the Step information
   * @param {object} transaction A transaction instance (optional)
   * @returns {object} A new created Step or null if any exception occurs
   */
  save: async (raw, transaction = null) => {
    var data = {
      id: uuid(),
      start_duration: parseInt(raw.startDuration),
      type_id: raw.stepType.id
    };
    var queryOptions = {};

    if (transaction !== null) {
      queryOptions["transaction"] = transaction;
    }

    const step = await Step.create(data, queryOptions);

    return step ? step : null;
  },

  startStep: async (ownerId, automationFlowId, currentAction, currentStep, now) => {
    // Increase the start time by the amount of hours which defined by Store Owner
    now.setSeconds(now.getSeconds() + currentStep.stepCommonData.dataValues.startDuration);

    // Begin Start Step
    console.log("> Begin Start Step with params: ", {
      ownerId: ownerId,
      automationFlowId: automationFlowId,
      currentAction: currentAction,
      currentStep: currentStep,
      now: now
    });

    switch (currentStep.stepCommonData.stepType.id) {
      case ACTION.id:
        // Start the Action job
        await actionDao.startAction(ownerId, automationFlowId, currentStep.dataValues, now);
        break;
      case CONDITION.id:
        // Start the Condition job
        await conditionDao.startCondition(ownerId, automationFlowId, currentAction, currentStep.dataValues, now);
        break;
    }
  }
};

const actionDao = require("./action.dao");
const conditionDao = require("./condition.dao");
