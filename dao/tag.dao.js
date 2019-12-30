// const express = require('express');
const Tag = require("../models/Tag");
// const Account = require('../models/Account');
// const router = express.Router();
const uuidv1 = require("uuid/v1");
const sequelize = require("sequelize");

module.exports = {
  getAllTag: async (id) => {
    // console.log("account Object: " + account.store_name);
    var res = await Tag.findAll({
      where: {
        owner_id: id
      }
    });
    console.log(res+"d"+id);
    return res;
  },

  addTag: async (tag, accountId) => {
    try {
      var newTag = new Tag(tag);
      newTag.id = uuidv1()
      // newTag.name = tag
      newTag.owner_id = accountId
      await newTag.save().then(() => {
        console.log(newTag);
      });
    } catch (err) {
      console.log(err.message);
    }
  },

  updateTag: async tag => {
    await tag.update(tag, { where: { id: tag.id } });
  },

  deleteTag: async idtag => {
    console.log("id tag: " + idtag);
    await Tag.update(
      {
        status: "false"
      },
      {
        where: {
          id: idtag
        }
      }
    ).then(() => {
      console.log("Removed successfully");
    });
    // res.json({ message: 'Tag removed' })
  }
};
