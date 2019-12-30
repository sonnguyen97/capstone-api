const SubscriberType = require("../models/SubscriberType");
const uuidv1 = require("uuid/v1");

module.exports = {
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
  }
};
