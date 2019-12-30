const express = require("express");
const Campaign = require("../models/Campaign");
const sequelize = require("sequelize");
const CampaignStatus = require("../constants/campaign/CampaignOperationStatus.constant");
const { ABANDONED_CHECKOUT } = require("../constants/campaign/campaign-trigger/CampaignTriggerType.constant");
const CampaignTrigger = require("../models/CampaignTrigger");
const CampaignTriggerType = require("../models/CampaignTriggerType");
const Email = require("../models/Email");
const Subscriber = require("../models/Subscriber");
const CampaignOperationStatus = require('../models/CampaignOperationStatus')
const campaignTriggerStatus = require('../constants/campaign/campaign-trigger/CampaignTriggerOperationStatus.constant')
const campaignTriggerType = require('../constants/campaign/campaign-trigger/CampaignTriggerType.constant')
const Audience_Campaign_Subscriber = require('../models/Audience_Campaign_Subscriber.js')
const Audience_Subscriber = require('../models/Audience_Subscriber')
const Audience = require('../models/Audience')
// const CampaignStatus = require("../constants/campaign/CampaignOperationStatus.constant");
const uuidv1 = require("uuid/v1");
const schedule = require("node-schedule");
const Op = sequelize.Op
const email_dao = require("../dao/email.dao");


module.exports = {
  // trigger when hooks call
  callCampaignByHooks: async (data) => {
    try {
      // data input to call sendMail(email)
      const email = {
        to: "",
        subject: "",
        html: ""
      }

      var listMail = []
      // end
      // get email customer by id from hooks
      var emailTO = "";
      await Subscriber.findOne({
        attributes: ['email'],
        where: {
          shopify_id: data.customer.id
        }
      }).then((data) => {
        emailTO = data.email
      })
      console.log(emailTO)
      // end
      //get trigger information
      if (data.type) {
        return await CampaignTrigger.findAll({
          include: [{
            model: Campaign,
            where: {
              owner_id: [sequelize.literal(`(select id from Account where store_domain = "${data.domain}")`)]
            }
          },
          {
            model: Email,
            where: {
              status_id: "bb150c47-c95a-4d0f-853a-e090ea917852"
            }
          }
          ],
          attributes: ['id', 'email_id', 'type_id', 'campaign_id', 'status_id'],
          where: {
            type_id: data.type
          }
        }).then(async trigger => {
          trigger.map(async item => {
            email.to = emailTO
            email.subject = `${item.Email.subject}`
            email.html = item.Email.body
            listMail.push(email)
          })
          return listMail
        })
      }
    } catch (error) {
      console.log(error);
    }
    //end
  },

  getAllCampaigns: async accountId => {
    try {
      const getCampaign = await Campaign.findAll({
        attributes: ['id', 'name', ['last_modified_date', 'lastModified'], ['status_id', 'statusId']],
        where: {
          is_news_letter: 0,
          owner_id: accountId,
          status_id: { [Op.ne]: CampaignStatus.DELETED.id }
        },
        order: [
          ['last_modified_date', 'DESC']
        ],
      }).then(async result => {
        return result;
      })
        .catch(error => {
          console.log("* DAO GET CAMPAIGN ERROR");
          console.log(error);
          return error;
        });

      return getCampaign;
    } catch (error) {
      console.log("* DAO GET NEWSLETTERS ERROR");
      console.log(error);
      return null;
    }
  },

  getAllCampaignsTriggerType: async () => {
    try {
      const getCampaignTriggerType = await CampaignTriggerType.findAll();
      return await getCampaignTriggerType;
    } catch (error) {
      console.log("* DAO GET NEWSLETTERS ERROR");
      console.log(error);
      return null;
    }
  },

  deleteCampaign: async (body, accountId) => {
    try {
      body.selectedRowKeys.forEach(element => {
        Campaign.update({
          status_id: CampaignStatus.DELETED.id
        },
          {
            where: {
              id: element
            }
          })
      });
      return true
    } catch (error) {
      console.log("* DELETE CAMPAIGN ERROR");
      console.log(error);
      return error;
    }
  },



  createCampaign: async (data, accountId) => {
    try {
      const campaignId = data.id
      // const campaignName = data.campaignName
      if (campaignId) {
        let listCampaignTrigger = [data.newSubscription, data.paidOrder, data.cancelledOrder, data.abandonedCheckout]
        // for (var i = 0; i < listCampaignTrigger.length; i += 1) {
        await listCampaignTrigger.map(async item => {
          const CampaignTriggerObj = item
          const typeId = CampaignTriggerObj.triggerTypeId
          const deleted = await CampaignTrigger.destroy({ where: { type_id: typeId, campaign_id: campaignId } })
          if (CampaignTriggerObj.key !== 'null') {
            const campaignTrigger = new CampaignTrigger(CampaignTriggerObj)
            campaignTrigger.id = uuidv1()
            campaignTrigger.scheduled_expression = null
            campaignTrigger.email_id = CampaignTriggerObj.key
            campaignTrigger.status_id = campaignTriggerStatus.ACTIVATED.id
            campaignTrigger.campaign_id = campaignId
            campaignTrigger.type_id = CampaignTriggerObj.triggerTypeId
            return await campaignTrigger.save().then(resData => {
              return true
            })
          }
        })
      }
      else {
        data.id = uuidv1()
        data.is_news_letter = 0
        data.name = data.campaignName
        // data.email_id = '33dae990-1c1f-11ea-915e-b5192716ca77'
        data.owner_id = accountId
        data.status_id = CampaignStatus.AVAILABLE.id
        const campaign = new Campaign(data)
        return await campaign.save().then(async res => {
          return await Campaign.findOne({
            include: [{
              model: CampaignOperationStatus,
              as: 'status'
            }],
            where: {
              id: data.id
            }
          }).then(res => {
            return res
          })
          // return res
        })
      }
      return true
    } catch (error) {
      console.log("* DAO GET NEWSLETTERS ERROR");
      console.log(error);
      return error;
    }
  },

  getAutomatedCampaign: async (accountId) => {
    let campaignObj = {
      id: uuidv1(),
      name: 'Automated Campaign',
      is_news_letter: 2,
      status_id: 'c0316ed0-5fb4-491c-a581-62a251b1be8d',
      owner_id: accountId,
      CampaignTriggers: [
        Campaigns = []
      ],

    }
    return await Campaign.findOne({
      include: [{
        model: CampaignTrigger,
        include: [{
          model: Email,
          include:
          {
            model: Campaign
          }

        }]
      }],
      attributes: ['id', 'name', 'last_modified_date', 'status_id', 'owner_id', 'email_id', 'is_news_letter'],
      where: {
        owner_id: accountId,
        is_news_letter: 2,
        status_id: { [Op.ne]: 'a6ee5994-1e42-467e-8cf7-e9132f08e292' }
      }
    }).then(async res => {
      if (!res) {
        let campaign = new Campaign(campaignObj)
        return await campaign.save().then(async res => {
          if (res._options.isNewRecord) {
            return campaignObj
          } else {
            return false
          }
        })
      }
      else {
        return res
      }
    })
  },

  changeOperationStatusAutomatedCampaign: async (status, accountId) => {
    const campaignId = status.campaignId
    const statusId = status.id
    return await Campaign.update(
      { status_id: statusId },
      {
        where: {
          id: campaignId,
          owner_id: accountId
        }
      }).then(async () => {
        return true
      }).catch(() => {
        return false
      })
  },

  getAutomatedById: async (accountId, campaignId) => {
    return await Campaign.findOne({
      include: [
        {
          model: Email
        },
        {
          model: CampaignTrigger
        },
        {
          model: Audience_Campaign_Subscriber,
          attributes: ['audience_id', 'campaign_id'],
          as: 'AudienceCampaignSubscriber',
          where: {
            campaign_id: campaignId
          }
        }
      ],
      where: {
        id: campaignId,
        owner_id: accountId,
        status_id: { [Op.ne]: CampaignStatus.DELETED.id }
      }
    }).then(res => {
      return res
    })
  },

  updateCampaign: async (campaign, accountId) => {
    const {
      SelectedAudience,
      SelectedNewsletter,
      campaignName,
      campaignId,
      sendTime,
      sendMonthFirstLast,
      sendType,
      sendWeekChooseDays
      // sendMonthChooseDays
    } = campaign
    const time = new Date(sendTime)
    // const date = new Date(sendDate)
    var mins = time.getMinutes()
    var hours = time.getHours()
    var dayOfMonth = '*'
    var month = '*'
    var dayOfWeek = '*'
    var schedulerExpression = ' '
    if (sendType) {
      switch (sendType) {
        case 'Daily':
          schedulerExpression = `${mins} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`
          break;
        case 'Weekly':
          dayOfWeek = await convertDayToNumber(sendWeekChooseDays)
          dayOfMonth = '*'
          schedulerExpression = `${mins} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`
          break;
        case 'Monthly':
          // if (sendMonthFirstLast !== null) {
          dayOfMonth = sendMonthFirstLast.key
          // }
          // if (sendMonthFirstLast === 'last') {
          //   dayOfMonth = '28-31'
          // }
          schedulerExpression = `${mins} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`
          break;
      }
    }


    if (SelectedAudience !== null) {
      const listSubscriber = await Audience_Subscriber.findAll({
        attributes: ['subscriber_id'],
        where: {
          audience_id: SelectedAudience.key
        }
      }).then(async res => {

        const deleted = await Audience_Campaign_Subscriber.destroy({ where: { campaign_id: campaignId } })
          .then(count => {
            if (count != 0) {
              return true;
            }
            return false;
          });
        await res.forEach(async item => {
          var ACSObj = {
            id: uuidv1(),
            audience_id: SelectedAudience.key,
            subscriber_id: item.subscriber_id,
            campaign_id: campaignId
          }
          const ACS = new Audience_Campaign_Subscriber(ACSObj)
          await ACS.save().then(res => {
            console.log(`list sub ${res}`)
            // return res
          })
          // return res
        })

      })
    }
    //updateCampaign
    await Campaign.update({
      name: campaignName,
    }, {
      where: {
        id: campaignId,
        owner_id: accountId
      }
    }
    ).then(res => {
      console.log(`Create campaign`)
    })
    var email = {}
    if (SelectedNewsletter !== null) {
      email = await Campaign.findOne({
        attributes: ['email_id'],
        where: {
          id: SelectedNewsletter.key
        }
      })
    }

    //createCampaignTrigger
    var emailId = email.email_id
    var ct = {
      // id: uuidv1(),
      scheduled_expression: schedulerExpression,
      // email_id: email.email_id,
      type_id: campaignTriggerType.DATE_TIME.id,
      campaign_id: campaignId,
      status_id: campaignTriggerStatus.ACTIVATED.id
    }
    if (emailId) {
      ct.email_id = emailId
    }
    return await CampaignTrigger.update(
      ct
      , {
        where: {
          campaign_id: campaignId
        }
      }).then(async res => {
        // await campaignTrigger.save().then(res => {
        console.log(`Update campaign trigger`)
        // })
        return true
      })
  },

  getCampaignById: async (accountId, campaignId) => {
    var audienceId = ''
    console.log(accountId)
    return await CampaignTrigger.findOne({
      include: [
        {
          model: Campaign,
          include: [{
            model: CampaignOperationStatus,
            as: 'status'
          }],
          where: {
            owner_id: accountId
          }
        },
        {
          attributes: [['id', 'emailId']],
          model: Email
        },
      ],
      where: {
        campaign_id: campaignId
      }
    }).then(async res => {
      if (res !== null) {
        const emailId = res.Email.dataValues.emailId
        const status = res.Campaign.status.dataValues
        const Audiences = await Audience_Campaign_Subscriber.findOne({
          attributes: [['audience_id', 'audienceId']],
          include: [
            {
              model: Audience
            }
          ],
          where: {
            campaign_id: campaignId,
          }
        }).then(res => {
          audience = res.Audience
        })
        const campaign = await Campaign.findOne({
          attributes: ['id', 'name'],
          where: {
            email_id: emailId
          }
        })

        var schedulerExpressionObj = parseSchedulerExpresstionToObj(res.scheduled_expression)
        // const auId = Audience.dataValues.audienceId
        schedulerExpressionObj.audienceObj = audience
        schedulerExpressionObj.status = status
        // schedulerExpressionObj.campaign = campaign
        schedulerExpressionObj.res = res
        console.log(JSON.stringify(schedulerExpressionObj))
        if (emailId) {
          schedulerExpressionObj.newsLetter = campaign
        }
        return schedulerExpressionObj
      }
      else {
        return await Campaign.findOne({
          where: {
            owner_id: accountId,
            id: campaignId
          }
        }).then(res => {
          return res
        })

      }
    })
  },

  createCampaignCurrent: async (campaign, accountId) => {
    const {
      SelectedAudience,
      SelectedNewsletter,
      campaignName,
      campaignId,
      sendTime,
      sendMonthFirstLast,
      sendType,
      sendWeekChooseDays
      // sendMonthChooseDays
    } = campaign
    const time = new Date(sendTime)
    // const date = new Date(sendDate)
    var mins = time.getMinutes()
    var hours = time.getHours()
    var dayOfMonth = '*'
    var month = '*'
    var dayOfWeek = '*'
    var schedulerExpression = ' '
    if (sendType) {
      switch (sendType) {
        case 'Daily':
          schedulerExpression = `${mins} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`
          break;
        case 'Weekly':
          dayOfWeek = await convertDayToNumber(sendWeekChooseDays)
          dayOfMonth = '*'
          schedulerExpression = `${mins} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`
          break;
        case 'Monthly':
          dayOfMonth = sendMonthFirstLast
          schedulerExpression = `${mins} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`
          break;
      }
    }
    const email = await Campaign.findOne({
      attributes: ['email_id'],
      where: {
        id: SelectedNewsletter.key
      }
    })

    return await Audience_Subscriber.findAll({
      attributes: ['subscriber_id'],
      where: {
        audience_id: SelectedAudience.key
      }
    }).then(async res => {

      const deleted = await Audience_Campaign_Subscriber.destroy({ where: { campaign_id: campaignId } })
        .then(count => {
          if (count != 0) {
            return true;
          }
          return false;
        });
      await res.forEach(async item => {
        var ACSObj = {
          id: uuidv1(),
          audience_id: SelectedAudience.key,
          subscriber_id: item.subscriber_id,
          campaign_id: campaignId
        }
        const ACS = new Audience_Campaign_Subscriber(ACSObj)
        await ACS.save().then(res => {
          console.log(`list sub ${res}`)
          // return res
        })
        // return res
      })

      //updateCampaign
      await Campaign.update({
        name: campaignName,
      }, {
        where: {
          id: campaignId,
          owner_id: accountId
        }
      }
      ).then(res => {
        console.log(`Create campaign`)
      })
      //createCampaignTrigger
      var ct = {
        id: uuidv1(),
        scheduled_expression: schedulerExpression,
        email_id: email.email_id,
        type_id: campaignTriggerType.DATE_TIME.id,
        campaign_id: campaignId,
        status_id: campaignTriggerStatus.ACTIVATED.id
      }
      var campaignTrigger = new CampaignTrigger(ct)
      return await CampaignTrigger.destroy({
        where: {
          campaign_id: campaignId
        }
      }).then(async res => {
        return await campaignTrigger.save().then(res => {

          console.log(`Create campaign trigger ${res._options.isNewRecord}`)
          return res._options.isNewRecord
        })
      })
    })
  },

  changeOperationStatusCampaign: async (status, accountId) => {
    const campaignId = status.campaignId
    const statusId = status.id

    return await Campaign.update(
      { status_id: statusId },
      {
        where: {
          id: campaignId,
          owner_id: accountId
        }
      }).then(async res => {
        return await CampaignOperationStatus.findOne({
          where: {
            id: statusId
          }
        }).then(async res => {
          if (statusId === '4cece002-1ae6-4bad-9633-ab30dc55b4e5') {
            const campaignTrigger = await CampaignTrigger.findOne({
              attributes: ['id', 'scheduled_expression'],
              where: {
                campaign_id: campaignId
              }
            })
            schedule.scheduleJob(campaignTrigger.id, campaignTrigger.scheduled_expression, function () {
              sendCampaign(campaignId, accountId);
            });
          }
          return res
        })
      }).catch(() => {
        return false
      })
  },

  //   sendCampaign: async (campaignId, accountId) => {
  //     try {
  //       const email = {
  //         to: [],
  //         subject: "",
  //         html: ""
  //       }

  //       var listMail = []
  //       var emailTO = "";

  //       await Audience_Campaign_Subscriber.findAll({
  //         include: [{
  //           attributes: ['id', 'email'],
  //           model: Subscriber
  //         }],
  //         attributes: ['campaign_id', 'subscriber_id', 'audience_id'],
  //         where: {
  //           campaign_id: campaignId
  //         }
  //       }).then((data) => {
  //         listMail = data
  //       })
  //       // end
  //       await CampaignTrigger.findOne({
  //         include: [{
  //           model: Campaign,
  //           where: {
  //             owner_id: accountId
  //           }
  //         },
  //         {
  //           model: Email,
  //           where: {
  //             status_id: "bb150c47-c95a-4d0f-853a-e090ea917852"
  //           }
  //         }
  //         ],
  //         attributes: ['id', 'scheduled_expression', 'email_id', 'type_id', 'campaign_id', 'status_id'],
  //         where: {
  //           type_id: campaignTriggerType.DATE_TIME.id,
  //           campaign_id: campaignId
  //         }
  //       }).then(async trigger => {
  //         email.to = listMail
  //         email.subject = `${trigger.Email.subject}`
  //         email.html = trigger.Email.body

  //       })
  //       return email
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },
};

function parseSchedulerExpresstionToObj(expression) {
  const Obj = {
    mins: expression.split(' ')[0],
    hours: expression.split(' ')[1],
    days: expression.split(' ')[2],
    month: expression.split(' ')[3],
    dayOfWeek: expression.split(' ')[4],
    dayOfWeeks: [],
    sendType: ''
  }
  if (Obj.mins === '0') {
    Obj.mins = 00
  }
  if (Obj.hours === '0') {
    Obj.hours = 00
  }
  if (Obj.dayOfWeek === '*' && Obj.days === '*' && Obj.month === '*') {
    Obj.sendType = 'Daily'
  }
  if (Obj.dayOfWeek === "*" && Obj.days !== '*' && Obj.month === '*') {
    Obj.sendType = 'Monthly'
  }
  if (Obj.dayOfWeek !== "*" && Obj.days === '*' && Obj.month === '*') {
    Obj.sendType = 'Weekly'
    //chuyen string thanh mang sau do convert (batbuoc)
    Obj.dayOfWeek = JSON.parse("[" + Obj.dayOfWeek + "]")
    Obj.dayOfWeek = convertNumberToDay(Obj.dayOfWeek)

    Obj.dayOfWeek = Obj.dayOfWeek.split(', ')
    console.log(Obj.dayOfWeek)
    console.log(JSON.stringify(Obj))
    console.log(Obj.dayOfWeek)
  }
  return Obj
}

function convertDayToNumber(list) {
  var listDay = ''
  list.forEach(item => {
    switch (item.toString().toLowerCase()) {
      case 'monday': listDay += `1 `
        break;
      case 'tuesday': listDay += `2 `
        break;
      case 'wednesday': listDay += `3 `
        break;
      case 'thursday': listDay += `4 `
        break;
      case 'saturday': listDay += `5 `
        break;
      case 'friday': listDay += `6 `
        break;
      case 'sunday': listDay += `0 `
        break;
    }
  })
  console.log(listDay)
  var str = listDay.replace(/ $/, "")
  var dayOfWeek = str.split(" ").join(',');
  console.log(dayOfWeek)
  return dayOfWeek
}

function convertNumberToDay(list) {
  var listDay = ''
  list.forEach(item => {
    switch (item.toString().toLowerCase()) {
      case '1': listDay += `Monday `
        break;
      case '2': listDay += `Tuesday `
        break;
      case '3': listDay += `Wednesday `
        break;
      case '4': listDay += `Thursday `
        break;
      case '5': listDay += `Saturday `
        break;
      case '6': listDay += `Friday `
        break;
      case '0': listDay += `Sunday `
        break;
    }
  })
  console.log(listDay)
  var str = listDay.replace(/ $/, "")
  var dayOfWeek = str.split(" ").join(', ');
  console.log(dayOfWeek)
  return dayOfWeek
}


async function sendCampaign(campaignId, accountId) {
  try {
    const email = {
      to: [],
      subject: "",
      html: ""
    }

    var listMail = []
    var emailTO = "";

    await Audience_Campaign_Subscriber.findAll({
      include: [{
        attributes: ['id', 'email'],
        model: Subscriber
      }],
      attributes: ['campaign_id', 'subscriber_id', 'audience_id'],
      where: {
        campaign_id: campaignId
      }
    }).then((data) => {
      listMail = data
    })
    // end
    await CampaignTrigger.findOne({
      include: [{
        model: Campaign,
        where: {
          owner_id: accountId
        }
      },
      {
        model: Email,
        where: {
          status_id: "bb150c47-c95a-4d0f-853a-e090ea917852"
        }
      }
      ],
      attributes: ['id', 'scheduled_expression', 'email_id', 'type_id', 'campaign_id', 'status_id'],
      where: {
        type_id: campaignTriggerType.DATE_TIME.id,
        campaign_id: campaignId
      }
    }).then(async trigger => {
      email.to = listMail
      email.subject = `${trigger.Email.subject}`
      email.html = trigger.Email.body

      // try {
      // const emailContent = sendCampaign(campaignId, accountId);
      // res.json(emailContent)
      // Add the below constant in the declaration part
      const TrackingType = require("../constants/email/tracking/trackingCondition.constant");

      // Handling unsubscribe
      const testUrl = `http://localhost:3001/#/subscriber/unsubscribe`;
      const url = `http://emm-api-client.herokuapp.com/#/subscriber/unsubscribe`;


      email.to.map(async item => {
        // const audienceId = "abc";
        const campaignId = item.campaign_id;
        const subscriberId = item.subscriber_id;
        const audienceId = item.audience_id;
        newEmailContent = email.html.replace(
          TrackingType.UNSUBSCRIBE.searchStr1,
          `<a href="${testUrl}?sid=${subscriberId}&aid=${audienceId}&cid=${campaignId}">Unsubscribe me</a> now!`
        );

        newEmailContent = newEmailContent.replace(
          TrackingType.OPEN.searchStr,
          `<img src="https://emm-api-server.herokuapp.com/api/emails/tracking/${TrackingType.OPEN.id}/?sid=${subscriberId}&eid=${trigger.Email.id}" style="display:none" />`
        );

        var Obj = {
          to: item.Subscriber.email,
          subject: email.subject,
          html: newEmailContent
        }
        await email_dao.sendMail(Obj);
      })
      // } catch (error) {
      //   console.log("** ROUTE GET CAMPAIGNS ERROR");
      //   console.log(error.message);
      //   res.status(200).send({
      //     success: false,
      //     error: error.message
      //   });
      // }
    })
    // return email
  } catch (error) {
    console.log(error);
  }
}

