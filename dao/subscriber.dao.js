// const express = require('express');
const Subscriber = require("../models/Subscriber");
const SubscriberType = require("../models/SubscriberType");
// const Account = require('../models/Account');
// const router = express.Router();
const uuidv1 = require("uuid/v1");
const sequelize = require("sequelize");
const { ACTIVATED, DEACTIVATED } = require("../constants/subscriber/SubscriberActivationStatus.constant");
const { CUSTOMER, SUBSCRIBER } = require("../constants/subscriber/SubscriberType.constant");
const emailDao = require("./email.dao");
const CampaignTrigger = require("../models/CampaignTrigger");
const { NEW_SUBSCRIPTION } = require("../constants/campaign/campaign-trigger/CampaignTriggerType.constant");
const Audience_Subscriber = require("../models/Audience_Subscriber");
const Audience_Campaign_Subscriber = require("../models/Audience_Campaign_Subscriber");
const Campaign = require("../models/Campaign");
const Email = require("../models/Email");

module.exports = {
  // Consumed by EMM Shopify Extension
  createSubscriber: async data => {
    var subscriber = {
      id: uuidv1(),
      email: data.email,
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      shopify_id: data.shopify_id,
      type_id: data.total_spent === 0 ? SUBSCRIBER.id : CUSTOMER.id,
      created_date: data.created_date,
      account_id: data.account_id,
      status_id: ACTIVATED.id,
      total_spent: data.total_spent,
      orders_count: data.orders_count,
      cancelled_order_times: data.cancelled_order_times
    };

    try {
      return await Subscriber.create(subscriber).then(async data => {
        const triggers = await CampaignTrigger.findAll({
          include: [
            {
              model: Campaign,
              where: {
                owner_id: data.account_id
              }
            },
            {
              model: Email,
              where: {
                status_id: "bb150c47-c95a-4d0f-853a-e090ea917852"
              }
            }
          ],
          attributes: ["id", "email_id", "type_id", "campaign_id", "status_id"],
          where: {
            type_id: NEW_SUBSCRIPTION.id
          }
        });

        triggers.map(async trigger => {
          var email = {
            to: data.email,
            subject: `${trigger.Email.subject}`,
            html: trigger.Email.body
          };

          await emailDao.sendMail(email);
        });

        return data;
      });
    } catch (err) {
      console.log(err.message);
    }
  },

  // Consumed by EMM Client
  addSubscriber: async (subscriber, accountId) => {
    try {
      var newSub = new Subscriber(subscriber);
      console.log(JSON.stringify(subscriber));
      newSub.id = uuidv1();
      newSub.first_name = subscriber.firstName;
      newSub.last_name = subscriber.lastName;
      newSub.total_spent = subscriber.totalSpent;
      newSub.orders_count = subscriber.orderCount;
      if (subscriber.orderCount > 0) {
        newSub.type_id = CUSTOMER.id;
      } else {
        newSub.type_id = SUBSCRIBER.id;
      }
      newSub.cancelled_order_times = subscriber.cancelOrderTimes;
      newSub.account_id = accountId;
      newSub.status_id = ACTIVATED.id;

      return newSub.save().then(async data => {
        return await data._options.isNewRecord;
      });
    } catch (err) {
      console.log(err.message);
    }
  },

  importExcel: async (subscriber, accountId) => {
    try {
      await subscriber.forEach(async item => {
        var newSub = new Subscriber(item);
        newSub.id = uuidv1();
        newSub.email = item.email;
        newSub.first_name = item.first_name;
        newSub.last_name = item.last_name;
        if (item.orders_count > 0) {
          newSub.type_id = CUSTOMER.id;
        } else {
          newSub.type_id = SUBSCRIBER.id;
        }
        newSub.account_id = accountId;
        newSub.status_id = ACTIVATED.id;
        newSub.total_spent = item.total_spent;
        newSub.orders_count = item.orders_count;
        newSub.cancelled_order_times = item.cancelled_order_times;
        return await newSub
          .save({
            where: { account_id: accountId }
          })
          .catch(async re => {
            return false;
          })
          .then(async data => {
            console.log("import list subscriber successfully");
            return await data._options.isNewRecord;
          });
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  getAllSubscriber: async id => {
    const sql = `Select Subscriber.id, SubscriberType.name, 
    Subscriber.first_name as firstName, Subscriber.last_name as lastName, Subscriber.email,
    Subscriber.last_modified_date as lastModifiedDate,
    SubscriberType.name as typeName,
    Subscriber.total_spent, Subscriber.orders_count, Subscriber.cancelled_order_times 
    from Account, SubscriberType, Subscriber  
    where Subscriber.type_id = SubscriberType.id 
    and Subscriber.account_id = '${id}' 
    and Subscriber.status_id = '${ACTIVATED.id}' 
    group by Subscriber.id
    order by Subscriber.last_modified_date desc`;
    const subscriber = await Subscriber.sequelize.query(sql, { type: sequelize.QueryTypes.SELECT }).then(function(result) {
      return result;
    });
    return subscriber;
  },

  deleteSubscriber: async (body, accountId) => {
    console.log(body);
    body.selectedRowKeys.forEach(element => {
      Subscriber.update(
        {
          // attributes: ["id", "status_id", "account_id"],
          status_id: DEACTIVATED.id
        },
        { where: { id: element, account_id: accountId } }
      );
      Audience_Subscriber.destroy({
        where: {
          subscriber_id: element
        }
      });
    });
  },

  getAllSubscriberTypes: async () => {
    try {
      return await SubscriberType.findAll().then(result => {
        res = result;
        return res;
      });
    } catch (error) {
      console.log(err);
    }
    // return res;
  },

  AddingASubsctiberToAudience: async data => {
    const subscriberIds = data.selectedRowKeys;
    const audienceIds = data.selectedRowKeysAudience;
    var obj = {
      audience_id: "",
      subscriber_id: ""
    };
    await audienceIds.map(async audIds => {
      await subscriberIds.map(async subId => {
        obj.audience_id = audIds;
        obj.subscriber_id = subId;
        return await Audience_Subscriber.create(obj)
          .then(async re => {
            console.log(re);
            obj.audience_id = "";
            obj.subscriber_id = "";
            return re._options.isNewRecord;
          })
          .catch(async error => {
            console.log(error);
            if (error.original.code === "ER_DUP_ENTRY") return await false;
          });
      });
    });
    return true;
  },

  unsubscribe: async subscriber => {
    try {
      const unsubscribeResult = await Audience_Campaign_Subscriber.destroy({
        where: {
          subscriber_id: subscriber.id,
          campaign_id: subscriber.campaignId,
          audience_id: subscriber.audienceId
        }
      })
        .then(result => {
          console.log("* DAO SUBSCRIBER unsubscribeResult");
          console.log(result);
          return result;
        })
        .catch(error => {
          console.log("* DAO SUBSCRIBER UNSUBSCRIBE ERROR");
          console.log(error.message);
          return false;
        });

      return unsubscribeResult;
    } catch (error) {
      console.log("* DAO SUBSCRIBER UNSUBSCRIBE ERROR");
      console.log(error.message);
      return false;
    }
  },

  updateSubscriber: async (subscriber, accountId) => {
    try {
      var newSub = new Subscriber(subscriber);
      console.log(JSON.stringify(subscriber));
      var typeId = "";
      if (subscriber.orderCount > 0) {
        typeId = CUSTOMER.id;
      } else {
        typeId = SUBSCRIBER.id;
      }

      return await Subscriber.update(
        {
          first_name: subscriber.firstName,
          last_name: subscriber.lastName,
          total_spent: subscriber.totalSpent,
          orders_count: subscriber.orderCount,
          type_id: typeId,
          cancelled_order_times: subscriber.cancelOrderTimes,
          account_id: accountId,
          status_id: ACTIVATED.id
        },
        {
          where: {
            id: subscriber.id
          }
        }
      ).then(async data => {
        return await data._options.isNewRecord;
      });
    } catch (err) {
      console.log(err.message);
    }
  },

  // Consumed by EMM Shopify Extension
  update: async data => {
    var subscriber = {
      email: data.email,
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      last_modified_date: null,
      total_spent: data.total_spent,
      orders_count: data.orders_count,
      cancelled_order_times: data.cancelled_order_times
    };

    try {
      return await Subscriber.update(subscriber, {
        where: {
          account_id: data.account_id,
          shopify_id: data.shopify_id
        }
      }).then(async () => {
        return await Subscriber.findOne({
          attributes: [
            "email",
            "first_name",
            "last_name",
            "shopify_id",
            "orders_count",
            "cancelled_order_times",
            "total_spent"
          ],
          where: {
            account_id: data.account_id,
            shopify_id: data.shopify_id
          }
        });
      });
    } catch (err) {
      console.log(err.message);
    }
  }
};
