// const express = require('express');
const Subscriber = require("../models/Subscriber");
const SubscriberType = require("../models/SubscriberType");
// const Account = require('../models/Account');
// const router = express.Router();
const uuidv1 = require("uuid/v1");
const sequelize = require("sequelize");
const { ACTIVATED } = require("../constants/account/visitor/VisitorActivationStatus.constant");
const { CUSTOMER, SUBSCRIBER, VISITOR } = require("../constants/account/visitor/VisitorType.constant");

module.exports = {
  // Consumed by EMM Shopify Extension
  createSubscriber: async data => {
    var subscriber = {};

    subscriber.id = uuidv1();
    subscriber.email = data.email;
    subscriber.first_name = data.first_name || "";
    subscriber.last_name = data.last_name || "";
    subscriber.shopify_id = data.shopify_id;
    if (data.total_spent === 0) {
      subscriber.type_id = VISITOR.id;
    } else if (data.accept_marketing) {
      subscriber.type_id = SUBSCRIBER.id;
    } else {
      subscriber.type_id = CUSTOMER.id;
    }
    subscriber.account_id = data.account_id;
    subscriber.status_id = ACTIVATED.id;
    subscriber.total_spent = data.total_spent;
    subscriber.orders_count = data.orders_count;
    subscriber.cancelled_order_times = data.cancelled_order_times;

    try {
      return Subscriber.create(subscriber);
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
      if(subscriber.orderCount > 0){
        newSub.type_id = CUSTOMER.id
      } else {
        newSub.type_id = SUBSCRIBER.id
      }
      newSub.cancelled_order_times = subscriber.cancelOrderTimes;
      newSub.account_id = accountId;
      newSub.status_id = ACTIVATED.id;

      await newSub.save().then(() => {
        console.log(newSub);
      });
    } catch (err) {
      console.log(err.message);
    }
  },

  importExcel: async (subscriber, accountId) => {
    try {

        visitor.forEach(async item => {
        var newSub = new Subscriber(item)
          newSub.id = uuidv1()
          newSub.email = item.email
          newSub.first_name = item.first_name
          newSub.last_name = item.last_name
          if(item.orders_count > 0){
            newSub.type_id = CUSTOMER.id
          } else {
          newSub.type_id = SUBSCRIBER.id
          }
          newSub.account_id = accountId
          newSub.status_id = ACTIVATED.id
          newSub.total_spent = item.total_spent
          newSub.orders_count = item.orders_count
          newSub.cancelled_order_times = item.cancelled_order_times
        await newSub
          .save({
            where: { account_id: accountId }
          })
          .then((data) => {
            console.log("import list visitor successfully");
            return true;
          });
      });
      //  check = 
      return true;
    } catch (error) {
      return false
      console.log(error);
    }
  },

  getAllVisitor: async id => {
    const sql = `Select Visitor.id, VisitorType.name, 
    Visitor.first_name as firstName, Visitor.last_name as lastName, Visitor.email,
    Visitor.last_modified_date as lastModifiedDate,
    VisitorType.name as typeName 
    from Account, VisitorType, Visitor  
    where Visitor.type_id = VisitorType.id 
    and Visitor.account_id = '${id}' 
    and Visitor.status_id = '${ACTIVATED.id}' 
    group by Visitor.id
    order by Visitor.last_modified_date desc`;
    const visitor = await Visitor.sequelize.query(sql, { type: sequelize.QueryTypes.SELECT }).then(function (result) {
      return result;
    });
    return visitor;
  },

  updateVisitor: async (visitor, accountId) => {
    console.log(visitor.selectedRowKeys);
    visitor.selectedRowKeys.forEach(element => {
      Visitor.update(
        {
          attributes: ["id", "type_id", "account_id"],
          type_id: visitor.typeId
        },
        { where: { id: element, account_id: accountId } }
      );
    });
  },

  deleteVisitor: async (body, accountId) => {
    console.log(body);
    body.selectedRowKeys.forEach(element => {
      Visitor.destroy({ where: { id: element, account_id: accountId } });
    });
  },

  getAllVisitorTypes: async () => {
    try {
      return await VisitorType.findAll().then(result => {
        res = result;
        return res;
      });
    } catch (error) {
      console.log(err);
    }
    // return res;
  },

  getVisitorDetail: async (visitorId, accountId) => {
    try {
      return await Visitor.findOne({
        where: {
          id: visitorId,
          account_id: accountId
        }
      }).then(data => {
        return data
      })
    } catch (error) {
      console.log(error)
    }
  }
};
