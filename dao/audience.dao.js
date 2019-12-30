// const Audience = require("../models/Audience")
const sequelize = require("sequelize");
const Criterion = require("../models/Criterion");
const Audience = require("../models/Audience");
const Filter = require("../models/Filter");
const Subscriber = require("../models/Subscriber");

const { CANCELLED_ORDER_TIMES, TOTAL_ORDERS, TOTAL_SPENT, EMAIL_ADDRESS, FIRST_NAME, LAST_NAME, TOTAL_JOINED_DAYS } = require("../constants/audience/audience-definition/filter/FilterField.constant");
const { EQUALS, LESS_THAN, GREATER_THAN, CONTAINS, NOT_EQUALS } = require("../constants/audience/audience-definition/filter/FilterExpression.constant");
const { ACTIVATED, DEACTIVATED } = require("../constants/audience/AudienceActivationStatus.constant");
// const AudienceActivationStatus = require("../models/AudienceActivationStatus")
// const uuid = require("uuid/v1");
const Audience_Subscriber = require("../models/Audience_Subscriber");
const Op = sequelize.Op

module.exports = {

  getAudienceByAccountId: async accountId => {
    try {
      return await Audience.findAll({
        attributes: ["id", "name", ["last_modified_date", "lastModifiedDate"]],
        where: {
          owner_id: accountId,
          status_id: ACTIVATED.id
        },
        order: [["last_modified_date", "DESC"]]
      }).then(data => {
        res = data;
        return res;
      });
    } catch (error) {
      console.log(error);
    }
  },

  getAudienceById: async (audienceId, accountId) => {
    try {
      var filterFinal = [];
      var filter = {
        filterfield: "",
        filterexpression: "",
        amount: 0
      };
      const filterfield = [CANCELLED_ORDER_TIMES, TOTAL_ORDERS, TOTAL_SPENT, TOTAL_JOINED_DAYS, LAST_NAME, FIRST_NAME, EMAIL_ADDRESS];
      const filterexpression = [EQUALS, LESS_THAN, GREATER_THAN, CONTAINS, NOT_EQUALS];

      const audience = await Audience.findOne({
        where: { id: audienceId, owner_id: accountId }
      });
      const audienceRes = await Criterion.findAll({
        include: [{ model: Filter }],
        where: {
          [Op.or]: [
            { id: [sequelize.literal(`(select criterion_id from Audience where id = '${audienceId}') `)] },
            { follower_id: [sequelize.literal(`(select criterion_id from Audience where id = '${audienceId}') `)] }
          ]
        }
      }).then(async res => {
        await res.map(item => {
          filterfield.map(i => {
            if (item.Filter.filter_field_id === i.id) {
              filter.filterfield = i.name;
            }
          });
          filter.amount = item.Filter.value

          filterexpression.forEach(e => {
            if (item.Filter.filter_expression_id === e.id) {
              filter.filterexpression = e.value;
            }
          });

          filterFinal.push(filter);
          // filter = {
          //   filterfield: "",
          //   filterexpression: "",
          //   amount: 0
          // };
        });
      })

      // var filterexpress = {}


      // E-commerce
      var cancel = [];
      var totalspent = [];
      var totalorder = [];
      //  personal information
      var totalJoineddays = [];
      var firstName = [];
      var lastName = [];
      var emailAddress = [];

      var response = {
        success: false,
        id: "",
        name: "",
        lastModifiedDate: "",
        subscribers: []
      }


      const ko = filterFinal
      await Promise.all(ko.map(async item => {
        var filter = item.filterfield
        if (filter.toLowerCase().includes("ancelledorder")) {
          if (item.filterexpression.includes("less")) {
            cancel = await Subscriber.findAll({
              where: {
                status_id: "265a7fbf-6c76-49fd-9491-67de8d589fc3",
                account_id: accountId,
                cancelled_order_times: {
                  [Op.lt]: item.amount
                }
              }
            });
          }
          if (item.filterexpression.toLowerCase().includes("greater")) {
            cancel = await Subscriber.findAll({
              where: {
                status_id: "265a7fbf-6c76-49fd-9491-67de8d589fc3",
                account_id: accountId,
                cancelled_order_times: {
                  [Op.gt]: item.amount,
                }
              }
            });
          }
          if (item.filterexpression.toLowerCase().includes("equals")) {
            cancel = await Subscriber.findAll({
              where: {
                status_id: "265a7fbf-6c76-49fd-9491-67de8d589fc3",
                account_id: accountId,
                cancelled_order_times: {
                  [Op.eq]: item.amount
                }
              }
            });
          }
        }

        if (filter.toLowerCase().includes("spent")) {
          if (item.filterexpression.toLowerCase().includes("less")) {
            totalspent = await Subscriber.findAll({
              where: {
                status_id: "265a7fbf-6c76-49fd-9491-67de8d589fc3",
                account_id: accountId,
                total_spent: {
                  [Op.lt]: item.amount
                }
              }
            });
          }
          if (item.filterexpression.toLowerCase().includes("greater")) {
            totalspent = await Subscriber.findAll({
              where: {
                status_id: "265a7fbf-6c76-49fd-9491-67de8d589fc3",
                account_id: accountId,
                total_spent: {
                  [Op.gt]: item.amount
                }
              }
            });
          }
          if (item.filterexpression.toLowerCase().includes("equals")) {
            totalspent = await Subscriber.findAll({
              where: {
                status_id: "265a7fbf-6c76-49fd-9491-67de8d589fc3",
                account_id: accountId,
                total_spent: {
                  [Op.eq]: item.amount
                }
              }
            });
          }
        }

        if (filter.toLowerCase().includes("totalorder")) {
          if (item.filterexpression.toLowerCase().includes("less")) {
            totalorder = await Subscriber.findAll({
              where: {
                status_id: "265a7fbf-6c76-49fd-9491-67de8d589fc3",
                account_id: accountId,
                orders_count: {
                  [Op.lt]: item.amount
                }
              }
            });
          }
          if (item.filterexpression.toLowerCase().includes("greater")) {
            totalorder = await Subscriber.findAll({
              where: {
                status_id: "265a7fbf-6c76-49fd-9491-67de8d589fc3",
                account_id: accountId,
                orders_count: {
                  [Op.gt]: item.amount
                }
              }
            });
          }
          if (item.filterexpression.toLowerCase().includes("equals")) {
            totalorder = await Subscriber.findAll({
              where: {
                status_id: "265a7fbf-6c76-49fd-9491-67de8d589fc3",
                account_id: accountId,
                orders_count: {
                  [Op.eq]: item.amount
                }
              }
            });
          }
        }
        if (filter.toLowerCase().includes("joinedday")) {
          var date = new Date();
          date.setDate(date.getDate() - item.amount);
          // return date;
          if (item.filterexpression.toLowerCase().includes("ess")) {
            totalJoineddays = await Subscriber.findAll({
              where: {
                status_id: "265a7fbf-6c76-49fd-9491-67de8d589fc3",
                account_id: accountId,
                created_date: {
                  [Op.gt]: date
                }
              }
            });
          }
          if (item.filterexpression.toLowerCase().includes("reater")) {
            totalJoineddays = await Subscriber.findAll({
              where: {
                status_id: "265a7fbf-6c76-49fd-9491-67de8d589fc3",
                account_id: accountId,
                created_date: {
                  [Op.lt]: date
                }
              }
            });
          }
        }
        if (filter.toLowerCase().includes("ailaddress")) {
          // return date;
          if (item.filterexpression.toLowerCase() === "not equals") {
            emailAddress = await Subscriber.findAll({
              where: {
                status_id: "265a7fbf-6c76-49fd-9491-67de8d589fc3",
                account_id: accountId,
                email: {
                  [Op.notLike]: `%${item.amount}%`
                }
              }
            });
          }

          if (item.filterexpression.toLowerCase() === "equals") {
            emailAddress = await Subscriber.findAll({
              where: {
                status_id: "265a7fbf-6c76-49fd-9491-67de8d589fc3",
                account_id: accountId,
                email: {
                  [Op.substring]: item.amount
                }
              }
            });
          }
          if (item.filterexpression.toLowerCase() === "contains") {
            emailAddress = await Subscriber.findAll({
              where: {
                status_id: "265a7fbf-6c76-49fd-9491-67de8d589fc3",
                account_id: accountId,
                email: {
                  [Op.substring]: item.amount
                }
              }
            });
          }

        }
        if (filter.toLowerCase().includes("firstna")) {
          // return date;
          if (item.filterexpression.toLowerCase() === "not equals") {
            firstName = await Subscriber.findAll({
              where: {
                status_id: "265a7fbf-6c76-49fd-9491-67de8d589fc3",
                account_id: accountId,
                first_name: {
                  [Op.ne]: item.amount
                }
              }
            });
          }

          if (item.filterexpression.toLowerCase() === "equals") {
            firstName = await Subscriber.findAll({
              where: {
                status_id: "265a7fbf-6c76-49fd-9491-67de8d589fc3",
                account_id: accountId,
                first_name: {
                  [Op.eq]: item.amount
                }
              }
            });
          }

        }
        if (filter.toLowerCase().includes("lastna")) {
          // return date;
          if (item.filterexpression.toLowerCase() === "not equals") {
            lastName = await Subscriber.findAll({
              where: {
                status_id: "265a7fbf-6c76-49fd-9491-67de8d589fc3",
                account_id: accountId,
                last_name: {
                  [Op.ne]: item.amount
                }
              }
            });
          }

          if (item.filterexpression.toLowerCase() === "equals") {
            lastName = await Subscriber.findAll({
              where: {
                status_id: "265a7fbf-6c76-49fd-9491-67de8d589fc3",
                account_id: accountId,
                last_name: {
                  [Op.eq]: item.amount
                }
              }
            });
          }

        }
      }))
      response.subscribers = [...cancel, ...totalspent, ...totalorder, ...totalJoineddays, ...firstName, ...lastName, ...emailAddress]
      if (response.subscribers) {
        response.success = true
      }
      response.id = audience.id
      response.name = audience.name
      response.lastModifiedDate = audience.last_modified_date
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  getDefinitionAudience: async (accountId, audienceId) => {
    try {
      return await Criterion.findAll({
        attributes: ['id', 'name', ['last_modified_date', 'lastModifiedDate']],
        where: {
          owner_id: accountId,
          status_id: ACTIVATED.id
        },
        order: [['last_modified_date', 'DESC']]
      }).then((data) => {
        res = data
        return res
      })
    } catch (error) {
      console.log(error)
    }
  },

  deleteAudience: async (body) => {
    await body.selectedRowKeys.map(async element => {
      return await Audience.update({
        status_id: DEACTIVATED.id
      },
        {
          where: {
            id: element
          }
        }
      ).then(re => {
        return true
      })
    })
    return true
  },

  getSubscribersByAudienceId: async (audienceId) => {
    const re = await Audience_Subscriber.findAll({
      include: [
        {
          model: Subscriber,
          // attributes: ['id','email','type_id','first_name', 'last_name', 'last_modified_date' ],
          where: {
            status_id: "265a7fbf-6c76-49fd-9491-67de8d589fc3"
          }
        },
        {
          model: Audience,
          where: {
            id: audienceId
          }
        }
      ],
      where: {
        audience_id: audienceId
      }
    })
    // var list = []
    var obj = {
      id: "",
      name: "",
      success: true,
      lastModifiedDate: "",
      subscribers: []
    }
    await re.map(async item => {
      obj.id = item.Audience.id
      obj.name = item.Audience.name
      obj.lastModifiedDate = item.Audience.last_modified_date
      var sub = item.Subscriber
      await obj.subscribers.push(sub)
      sub = {}
    })

    if (re.length < 1) {
      const au = await Audience.findOne({
        where: {
          id: audienceId
        }
      })
      obj.id = au.id
      obj.name = au.name
      obj.success = true
      obj.lastModifiedDate = au.last_modified_date
      obj.subscribers = []
    }

    return obj;

  },

  removeSubscriberOutOfAudience: async (body) => {
    console.log(body);
    // body.selectedRowKeys.forEach(async element =>
    body.selectedRowKeys.forEach(async item => {
      await Audience_Subscriber.destroy(
        {
          where: {
            audience_id: body.audienceId,
            subscriber_id: item
          }
        })
    });
  },

  getAudience: async accountId => {
    try {
      return await Audience.findAll({
        attributes: ["id", "name", ["last_modified_date", "lastModifiedDate"]],
        where: {
          owner_id: accountId,
          status_id: ACTIVATED.id
        },
        order: [["last_modified_date", "DESC"]]
      }).then(data => {
        res = data;
        return res;
      });
    } catch (error) {
      console.log(error);
    }
  },

  previewAudience: async (audienceId, accountId) => {
    try {
      const audience = await Audience.findOne({
        where: { id: audienceId, owner_id: accountId }
      });
      const audienceRes = await Criterion.findAll({
        include: [{ model: Filter }],
        where: {
          [Op.or]: [
            { id: [sequelize.literal(`(select criterion_id from Audience where id = '${audienceId}') `)] },
            { follower_id: [sequelize.literal(`(select criterion_id from Audience where id = '${audienceId}') `)] }
          ]
        }
      });
      const res = audienceRes;
      var filterFinal = [];
      var filter = {
        filterfield: "",
        filterexpression: "",
        amount: 3
      };
      // var filterexpress = {}
      const filterfield = [CANCELLED_ORDER_TIMES, TOTAL_ORDERS, TOTAL_SPENT];
      const filterexpression = [EQUALS, LESS_THAN, GREATER_THAN];

      res.forEach(item => {
        // if(item.Filter.filter_field_id === C)
        filterfield.forEach(i => {
          if (item.Filter.filter_field_id === i.id) {
            filter.filterfield = i.name;
          }
        });

        filterexpression.forEach(e => {
          if (item.Filter.filter_expression_id === e.id) {
            filter.filterexpression = e.value;
          }
        });

        filterFinal.push(filter);
        filter = {
          filterfield: "",
          filterexpression: "",
          amount: 3
        };

        // subscriberObj = []
        // subscriberObj = Subscriber.findAll({
        //   where: {
        //     account_id: accountId
        //   }
        // })

        // if (subscriberObj.length > 0) {
        //   subscriberObj.forEach(ko => {
        //     subscriber.push(ko)
        //   })
        // }
        // subscriberObj = []
      });
      var cancel = [];
      var totalspent = [];
      var totalorder = [];
      var response = {
        success: false,
        audience_subscriber: {
          id: "",
          name: "",
          lastModifiedDate: "",
          subscribers: []
        }
      };
      const ko = filterFinal;
      await Promise.all(
        ko.map(async item => {
          var filter = item.filterfield;
          // fil = []
          if (filter.toLowerCase().includes("ancelledorder")) {
            if (item.filterexpression.includes("less")) {
              cancel = await Subscriber.findAll({
                where: {
                  cancelled_order_times: {
                    [Op.lt]: item.amount,
                    account_id: accountId
                  }
                }
              });
            }
            if (item.filterexpression.toLowerCase().includes("greater")) {
              cancel = await Subscriber.findAll({
                where: {
                  cancelled_order_times: {
                    [Op.gt]: item.amount,
                    account_id: accountId
                  }
                }
              });
            }
            if (item.filterexpression.toLowerCase().includes("equals")) {
              cancel = await Subscriber.findAll({
                where: {
                  cancelled_order_times: {
                    [Op.eq]: item.amount,
                    account_id: accountId
                  }
                }
              });
            }
          }

          if (filter.toLowerCase().includes("spent")) {
            if (item.filterexpression.toLowerCase().includes("less")) {
              totalspent = await Subscriber.findAll({
                where: {
                  total_spent: {
                    [Op.lt]: item.amount,
                    account_id: accountId
                  }
                }
              });
            }
            if (item.filterexpression.toLowerCase().includes("greater")) {
              totalspent = await Subscriber.findAll({
                where: {
                  total_spent: {
                    [Op.gt]: item.amount,
                    account_id: accountId
                  }
                }
              });
            }
            if (item.filterexpression.toLowerCase().includes("equals")) {
              totalspent = await Subscriber.findAll({
                where: {
                  total_spent: {
                    [Op.eq]: item.amount,
                    account_id: accountId
                  }
                }
              });
            }
          }

          if (filter.toLowerCase().includes("totalorder")) {
            if (item.filterexpression.toLowerCase().includes("less")) {
              totalorder = await Subscriber.findAll({
                where: {
                  orders_count: {
                    [Op.lt]: item.amount,
                    account_id: accountId
                  }
                }
              });
            }
            if (item.filterexpression.toLowerCase().includes("greater")) {
              totalorder = await Subscriber.findAll({
                where: {
                  orders_count: {
                    [Op.gt]: item.amount,
                    account_id: accountId
                  }
                }
              });
            }
            if (item.filterexpression.toLowerCase().includes("equals")) {
              totalorder = await Subscriber.findAll({
                where: {
                  orders_count: {
                    [Op.eq]: item.amount,
                    account_id: accountId
                  }
                }
              });
            }
          }
        })
      );
      response.audience_subscriber.subscribers = [...cancel, ...totalspent, ...totalorder];
      if (response.audience_subscriber.subscribers) {
        response.success = true;
      }
      response.audience_subscriber.id = audience.id;
      response.audience_subscriber.name = audience.name;
      response.audience_subscriber.lastModifiedDate = audience.last_modified_date;
      return response;
    } catch (error) {
      console.log(error);
    }
  }

}
