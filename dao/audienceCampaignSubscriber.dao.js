const Audience_Campaign_Subscriber = require("../models/Audience_Campaign_Subscriber");
const Subscriber = require("../models/Subscriber");

module.exports = {
  /**
   * Perform querying to retrieve a list of recipients of a Campaign by its ID.
   * Recipient is an object which contains ID and email of the Subscriber who will receive email from the Campaign.
   * If a transaction is passed as second argument, this will perform a transaction query process instead of an independent query.
   * @param {string} campaignId ID of the Campaign to be get its recipients
   * @param {object} transaction A transaction instance
   * @returns {Promise<Array>} A list of recipients or null if not found
   */
  getCampaignRecipients: async (campaignId, transaction = null) => {
    var queryOptions = {
      attributes: ["subscriber_id"],
      include: [
        {
          model: Subscriber,
          attributes: ["email"]
        }
      ],
      where: {
        campaign_id: campaignId
      },
      group: ["subscriber_id"]
    };

    if (transaction !== null) {
      queryOptions["transaction"] = transaction;
    }

    const recipients = await Audience_Campaign_Subscriber.findAll(queryOptions).map(s => {
      return { id: s.subscriber_id, email: s.Subscriber.email };
    });

    return recipients ? recipients : null;
  }
};
