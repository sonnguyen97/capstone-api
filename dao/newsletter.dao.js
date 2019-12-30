const express = require("express");
const router = express.Router();
const Account = require("../models/Account");
const Campaign = require("../models/Campaign");
const Email = require("../models/Email");
const email_dao = require("./email.dao");
const uuidv1 = require("uuid/v1");
const sequelize = require("sequelize");
const NewsletterStatus = require("../constants/campaign/CampaignOperationStatus.constant");
const Audience_Campaign_Subscriber = require("../models/Audience_Campaign_Subscriber");
const Audience = require("../models/Audience");
const Audience_Subscriber = require("../models/Audience_Subscriber");
const Subscriber = require("../models/Subscriber");

module.exports = {
  getAllNewsletters: async ownerId => {
    const sql = `Select
        Campaign.id,
        Campaign.name,
        Campaign.email_id,
        Campaign.last_modified_date,
        CampaignOperationStatus.name as 'status'
        from Campaign, CampaignOperationStatus
        where Campaign.status_id = CampaignOperationStatus.id
        and Campaign.owner_id = '${ownerId}'
        and Campaign.status_id != '${NewsletterStatus.DELETED.id}'
        and Campaign.is_news_letter = 1
        order by Campaign.last_modified_date desc`;

    try {
      const getNewslettersResult = await Campaign.sequelize
        .query(sql, {
          type: sequelize.QueryTypes.SELECT
        })
        .then(result => {
          return result;
        })
        .catch(error => {
          console.log("* DAO GET NEWSLETTERS ERROR");
          console.log(error);
          return null;
        });

      return getNewslettersResult;
    } catch (error) {
      console.log("* DAO GET NEWSLETTERS ERROR");
      console.log(error);
      return null;
    }
  },

  addNewsletter: async (newsletter, emailId, accountId) => {
    try {
      console.log("* DAO addNewsletter checkingParam newsletter");
      console.log(newsletter);
      const newNewsletter = new Campaign();

      newNewsletter.id = uuidv1();
      newNewsletter.name = newsletter.name;
      newNewsletter.start_date = null;
      newNewsletter.is_news_letter = 1;
      newNewsletter.status_id = NewsletterStatus.AVAILABLE.id;
      newNewsletter.owner_id = accountId;
      newNewsletter.email_id = emailId;
      newNewsletter.is_tracking_open = true;
      newNewsletter.is_tracking_click = false;

      const createResult = await newNewsletter
        .save({
          where: {
            id: accountId
          }
        })
        .then(result => {
          return result;
        })
        .catch(error => {
          console.log("* DAO ADD NEWSLETTER ERROR");
          console.log(error);
          return null;
        });

      return createResult;
    } catch (error) {
      console.log("* DAO ADD NEWSLETTER ERROR");
      console.log(error);
      return null;
    }
  },

  findNewsletterById: async (newsletterId, accountId) => {
    const sql = `Select 
      Campaign.id, 
      Campaign.name,
      Campaign.email_id, 
      Campaign.last_modified_date, 
      Campaign.is_tracking_open,
      Campaign.is_tracking_click,
      Campaign.tracking_url,
      CampaignOperationStatus.name as 'status' 
      from Campaign, CampaignOperationStatus 
      where Campaign.status_id = CampaignOperationStatus.id
      and Campaign.id = '${newsletterId}'
      and Campaign.is_news_letter = 1
      and Campaign.owner_id = '${accountId}'`;

    try {
      const newsletter = await Campaign.sequelize
        .query(sql, {
          type: sequelize.QueryTypes.SELECT
        })
        .then(result => {
          console.log("* DAO GET NEWSLETTER BY ID result");
          console.log(JSON.stringify(result));
          return result;
        })
        .catch(error => {
          console.log("* DAO GET NEWSLETTER BY ID ERROR");
          console.log(error);
          return null;
        });

      return newsletter;
    } catch (error) {
      console.log("* DAO GET NEWSLETTER BY ID ERROR");
      console.log(error);
      return null;
    }
  },

  deleteNewsletters: async (newsletterId, accountId) => {
    try {
      const result = await Campaign.update(
        { status_id: NewsletterStatus.DELETED.id },
        {
          where: {
            id: newsletterId,
            owner_id: accountId
          }
        }
      )
        .then(result => {
          console.log("* DAO DELETE NEWSLETTERS result");
          console.log(result);
          return result;
        })
        .catch(error => {
          console.log("* DAO DELETE NEWSLETTERS ERROR");
          console.log(error);
          return false;
        });

      return result;
    } catch (error) {
      console.log("* DAO DELETE NEWSLETTERS ERROR");
      console.log(error);
      return false;
    }
  },

  updateNewsletter: async (newsletter, SelectedAudiences) => {
    try {
      var obj = {};
      console.log("newsletter.trackingConfig.isCheckingOpenedEmail ", newsletter.trackingConfig.isCheckingOpenedEmail);
      await Campaign.update(
        {
          name: newsletter.name,
          is_tracking_open: newsletter.trackingConfig.isCheckingOpenedEmail === true ? 1 : 0,
          is_tracking_click: newsletter.trackingConfig.isCheckingClickedUrl === true ? 1 : 0,
          last_modified_date: null,
          tracking_url: newsletter.trackingUrl || ""
        },
        { where: { id: newsletter.id } }
      )
        .then(async result => {
          console.log("* DAO UPDATE NEWSLETTERS result");
          console.log(result);
          await Audience_Campaign_Subscriber.destroy({
            where: {
              campaign_id: newsletter.id
            }
          }).then(async res => {
            if (SelectedAudiences.length > 0) {
              await SelectedAudiences.map(async audience => {
                await Audience_Subscriber.findAll({
                  attributes: ["subscriber_id"],
                  group: ["subscriber_id"],
                  where: {
                    audience_id: audience.key
                  }
                }).then(async res => {
                  await res.map(async subscriber => {
                    var Obj = {
                      campaign_id: newsletter.id,
                      subscriber_id: subscriber.subscriber_id,
                      audience_id: audience.key
                    };
                    const AuSub = new Audience_Campaign_Subscriber(Obj);
                    await AuSub.save();
                  });
                });
              });
            }
          });
          return result;
        })
        .catch(error => {
          console.log("* DAO UPDATE NEWSLETTERS ERROR");
          console.log(error);
          return false;
        });
      return await Campaign.findOne({
        where: {
          id: newsletter.id
        }
      }).then(res => {
        return res;
      });

      // return updateResult;
    } catch (error) {
      console.log("* DAO UPDATE NEWSLETTERS ERROR");
      console.log(error);
      return false;
    }
  },

  getAudienceByNewsletterId: async newsletterId => {
    return await Audience_Campaign_Subscriber.findAll({
      include: [
        {
          attributes: ["id", "name"],
          // group: ["id"],s
          model: Audience
        }
      ],
      group: ["audience_id"],
      where: {
        campaign_id: newsletterId
      }
    }).then(async res => {
      var list = [];
      var audienceList = [];
      await res.map(item => {
        audienceList.push(item.Audience);
        // list = [...list, ...audienceList];
      });
      return audienceList;
    });
  },

  /**
   * Create a transaction process to retrieve an available Newsletter by its ID.
   * By default, a Newsletter is a Campaign whose field is_news_letter is 1
   * @param {string} ownerId ID of the Account who owned this Newsletter
   * @param {string} newsletterId ID of the Newsletter to be retrieved
   * @param {object} transaction A transaction instance
   * @returns {Promise<object>} A retrieved Newsletter or null if not found
   */
  find: async (ownerId, newsletterId, transaction = null) => {
    var queryOptions = {
      attributes: [
        "id",
        ["email_id", "emailId"],
        ["is_tracking_click", "isTrackingClick"],
        ["is_tracking_open", "isTrackingOpen"],
        ["tracking_url", "trackingUrl"]
      ],
      where: {
        id: newsletterId,
        owner_id: ownerId,
        is_news_letter: 1,
        status_id: NewsletterStatus.AVAILABLE.id
      }
    };

    if (transaction !== null) {
      queryOptions["transaction"] = transaction;
    }

    const newsletter = await Campaign.findOne(queryOptions).then(result => result.dataValues || null);

    return newsletter ? newsletter : null;
  },
  
  getAudienceByNewsletterId: async newsletterId => {
    return await Audience_Campaign_Subscriber.findAll({
      include: [
        {
          attributes: ["id", "name"],
          model: Audience
        }
      ],
      where: {
        campaign_id: newsletterId
      }
    }).then(async res => {
      var list = [];
      var audienceList = [];
      await res.map(item => {
        audienceList.push(item.Audience);
        list = [...list, ...audienceList];
      });
      return list;
    });
  }
};
