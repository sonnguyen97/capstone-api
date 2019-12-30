const Email_Subscriber = require("../models/Email_Subscriber");

module.exports = {
  /**
   * Perform querying to retrieve an Email_Subscriber.
   * If a transaction is passed as second argument, this will perform a transaction query process instead of an independent query.
   * @param {string} emailId ID of an Email
   * @param {string} subscriberId ID of a Subscriber
   * @param {object} transaction A transaction instance (optional)
   * @returns {Promise<object>} A retrieved Email_Subscrbier or null if any exception occurs
   */
  find: async (emailId, subscriberId, transaction = null) => {
    var queryOptions = {
      attributes: [
        ["email_id", "emailId"],
        ["subscriber_id", "subscriberId"],
        ["has_clicked_url", "hasClickedUrl"],
        ["has_opened_email", "hasOpenedEmail"],
        ["is_bounced", "isBounced"],
        ["is_sent", "isSent"],
        ["is_tracking_click", "isTrackingClick"],
        ["is_tracking_open", "isTrackingOpen"]
      ],
      where: {
        email_id: emailId,
        subscriber_id: subscriberId
      }
    };

    if (transaction !== null) {
      queryOptions["transaction"] = transaction;
    }

    const emailSubscriber = await Email_Subscriber.findOne(queryOptions)
      .then(result => (result !== null ? result.dataValues : result))
      .catch(error => console.log(error.message));

    return emailSubscriber ? emailSubscriber : null;
  },

  /**
   * Perform querying to save an Email_Subscriber. An Email_Subscriber is an Email has been sent, whether it's bounce or not.
   * If a transaction is passed as second argument, this will perform a transaction query process instead of an independent query.
   * @param {string} emailId ID of an Email
   * @param {string} subscriberId ID of a Subscriber
   * @param {boolean} bounced Only true when the Subsriber's email is not exist (need to verify first)
   * @param {object} transaction A transaction instance (optional)
   * @returns {Promise<object>} A new created Email_Subscrbier or null if any exception occurs
   */
  save: async (emailId, subscriberId, bounced, transaction = null) => {
    const data = {
      subscriber_id: subscriberId,
      email_id: emailId,
      is_sent: 1,
      is_bounced: bounced ? 1 : 0
    };

    var queryOptions = {};

    if (transaction) {
      queryOptions["transaction"] = transaction;
    }

    const emailSubscriber = await Email_Subscriber.create(data, queryOptions).catch(error => console.log(error.message));

    return emailSubscriber ? emailSubscriber : null;
  },

  /**
   * Perform querying to update an Email_Subscriber is_sent and is_bounced field.
   * If a transaction is passed as second argument, this will perform a transaction query process instead of an independent query.
   * @param {string} emailId ID of an Email
   * @param {string} subscriberId ID of a Subscriber
   * @param {boolean} bounced Only true when the Subsriber's email is not exist (need to verify first)
   * @param {object} transaction A transaction instance (optional)
   * @returns {Promise<boolean>} true if the Email_Subscriber has been updated, otherwise false
   */
  updateSentStatus: async (emailId, subscriberId, bounced, transaction = null) => {
    const data = {
      is_sent: 1,
      is_bounced: bounced ? 1 : 0
    };

    var queryOptions = {
      where: {
        subscriber_id: subscriberId,
        email_id: emailId
      }
    };

    if (transaction) {
      queryOptions["transaction"] = transaction;
    }

    const emailSubscriber = await Email_Subscriber.update(data, queryOptions)
      .then(result => result)
      .catch(error => console.log(error.message));

    return emailSubscriber ? emailSubscriber.length > 0 : false;
  }
};
