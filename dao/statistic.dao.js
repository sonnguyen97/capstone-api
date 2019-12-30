const Email_Subscriber = require("../models/Email_Subscriber.js");
const Subscriber = require("../models/Subscriber");
const SubscriberType = require("../constants/subscriber/SubscriberType.constant");
module.exports = {
  count: async accountId => {
    return await Subscriber.findAll({
      include: [
        {
          model: Email_Subscriber
        }
      ],
      where: {
        account_id: accountId
      }
    }).then(async res => {
      var list = [];
      var statistic = {
        isOpened: 0,
        isNotOpened: 0,
        isNotClicked: 0,
        isClicked: 0,
        isBounced: 0,
        isSent: 0,
        totalSubscriber: 0,
        totalCustomer: 0,
        notSendYet: 0
      };
      if (res.length === 0) {
        statistic = null;
      } else {
        const subs = await Subscriber.count({
          where: {
            account_id: accountId,
            type_id: SubscriberType.SUBSCRIBER.id
          }
        }).then(res => {
          statistic.totalSubscriber = res;
        });
        const cuss = await Subscriber.count({
          where: {
            account_id: accountId,
            type_id: SubscriberType.CUSTOMER.id
          }
        }).then(res => {
          statistic.totalCustomer = res;
        });
        await res.map(async item => {
          if (item.Email_Subscribers.length > 0) {
            list = [...list, ...item.Email_Subscribers];
            await item.Email_Subscribers.map(item => {
              if (item.is_sent === 1 && item.is_bounced === 0) {
                if (item.has_opened_email === 1) {
                  statistic.isOpened += 1;
                }
                if (item.has_opened_email === 0) {
                  statistic.isNotOpened += 1;
                }
                if (item.has_clicked_url === 1) {
                  statistic.isClicked += 1;
                }
                if (item.has_clicked_url === 0) {
                  statistic.isNotClicked += 1;
                }
                if (item.is_sent === 1) {
                  statistic.isSent += 1;
                }
              }

              if (item.is_bounced === 1 && item.is_sent === 1) {
                statistic.isBounced += 1;
              }
              //   if (item.is_bounced === 1 && item.is_sent === 0) {
              //     statistic.isBounced += 1;
              //   }
              //   if (item.is_bounced === 0 && item.is_sent === 0) {
              //     statistic.notSendYet += 1;
              //   }
            });
          }
        });
      }
      return statistic;
    });
  }
};
