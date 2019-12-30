// const Audience = require("../models/Audience")
const CriterionType = require("../models/CriterionType");
// const Criterion = require("../models//Criterion")
const Filterfield = require("../models/FilterField");
const FilterExpression = require("../models/FilterExpression");
const Filterfield_CriterionType = require("../models/FilterField_CriterionType");
const FilterField_FilterExpression = require("../models/FilterField_FilterExpression");
// const AudienceActivationStatus = require("../models/AudienceActivationStatus")
// const uuid = require("uuid/v1");

module.exports = {
  getCriterionType: async () => {
    try {
      return await Filterfield_CriterionType.findAll({
        include: [
          {
            model: CriterionType
          },
          {
            model: Filterfield
          }
        ]
      }).then(data => {
        res = data
        return res;
      });
    } catch (error) {
      console.log(error);
    }
  },

  getFilterExpression: async () => {
    try {
      return await FilterField_FilterExpression.findAll({
        include: [
          {
            model: FilterExpression
          },
          {
            model: Filterfield
          }
        ]
      }).then(data => {
        res = data
        return res;
      });
    } catch (error) {
      console.log(error);
    }
  },

  getFilterField: async () => {
    try {
      return await Filterfield.findAll().then(data => {
        res = data
        return res;
      });
    } catch (error) {
      console.log(error);
    }
  },

  getDefinitionCriteria: async () => {
    try {
      // return await 
      const critrion = await CriterionType.findAll({
        include: [
          {
            model: Filterfield_CriterionType,
            attributes: {
              exclude: ['criterion_type_id']
            },
            include: [
              {
                model: Filterfield,
                include: [
                  {
                    model: FilterField_FilterExpression,
                    attributes: {
                      exclude: ['field_id']
                    },
                    include: [
                      {
                        model: FilterExpression
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      })
      return critrion
    } catch (error) {
      console.log(error)
    }
  }
};
