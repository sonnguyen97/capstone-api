const express = require("express");
const router = express.Router();
// const db = require("../../config/db");
const Audience = require("../../../models/Audience");
const Criterion = require("../../../models/Criterion");
const Filter = require("../../../models/Filter");
const Audience_Subscriber = require("../../../models/Audience_Subscriber");
const audience_dao = require("../../../dao/audience.dao");
const auth = require("../../../middleware/auth.middleware");
const uuidv1 = require("uuid/v1");
const { AND } = require("../../../constants/audience/audience-definition/criterion/CriterionFollowerExpression.constant");
const { ACTIVATED } = require("../../../constants/audience/AudienceActivationStatus.constant");

router.get("/", auth, async (req, res) => {
    const accountId = req.account.id
    try {
        const audience = await audience_dao.getAudienceByAccountId(accountId);
        res.json(audience)
    } catch (error) {
        console.log(error)
        res.status(500).send("server error" + error)
    }
});

router.post("/", auth, async (req, res) => {
    const audience = req.body
    const accountId = req.account.id
    try {
        var listDefinitions = []
        var listDefinition = []
        var Definition = {}
        for (let i = 0; i < audience.criterionType.length; i += 1) {
            if (audience.criterionType[i] !== null) {
                if (audience.criterionType[i] === 'fee67a7c-cbf5-4deb-abd3-33add96c35f7') {
                    Definition.type = audience.criterionType[i]
                    Definition.filterField = audience.filterfield[i]
                    Definition.filterExpression = audience.filterexpression[i]
                    Definition.amount = audience.amount[i]
                    listDefinition.push(Definition)
                    listDefinitions = [...listDefinitions, ...listDefinition]
                }
                if (audience.criterionType[i] === 'fee67a7c-cbf5-4deb-abd3-33add96c35f8') {
                    Definition.type = audience.criterionType[i]
                    Definition.filterField = audience.filterfield[i]
                    Definition.filterExpression = audience.filterexpression[i]
                    Definition.amount = audience.amount[i]
                    listDefinition.push(Definition)
                    
                    listDefinitions = [...listDefinitions, ...listDefinition]
                }
                // listDefinitions = [...listDefinitions, ...listDefinition]
            }
        }

        var audienceId = ""
        var criterionItem = {
            id: "",
            type_id: "",
            filter_id: "",
            has_follower: 0,
            follower_id: "",
            follower_expression_id: "",
        }

        var filterModel = {
            id: "",
            value: "",
            filter_field_id: "",
            filter_expression_id: ""
        }

        var AudienceModel = {
            id: "",
            name: "",
            description: "",
            status_id: ACTIVATED.id,
            criterion_id: "",
            owner_id: ""
        };
        var followerId = ""

        var crType, ffield, fexpression = "";

        for (let i = 0; i < audience.keys.length; i += 1) {
            crType = audience.criterionType[i]
            ffield = audience.filterfield[i]
            fexpression = audience.filterexpression[i]
            var am = audience.amount[i]
            // add filter table
            filterModel = {}
            filterModel.id = uuidv1()
            filterModel.value = am
            filterModel.filter_field_id = ffield
            filterModel.filter_expression_id = fexpression
            var filter = new Filter(filterModel)
            await filter.save().then(() => {
                console.log("Added filter with id : " + filterModel.id)
            })
            // add criterion table
            criterionItem = {}
            criterionItem.id = uuidv1()
            if (i === 0) {
                followerId = criterionItem.id
            }
            criterionItem.type_id = crType
            criterionItem.filter_id = filterModel.id
            if (audience.keys.length > 1) {
                if (audience.keys.length === 2) {
                    if (i === 0) {
                        criterionItem.has_follower = 1
                    }
                    if (i === 1) {
                        criterionItem.has_follower = 0
                    }
                }
                if (audience.keys.length === 3) {
                    if (i === 0) {
                        criterionItem.has_follower = 1
                    }
                }
            }
            if (i > 0) {
                criterionItem.follower_id = followerId
            }

            criterionItem.follower_expression_id = AND.id
            var criterions = new Criterion(criterionItem)
            await criterions.save().then(async () => {
                console.log("Added criterion by id : " + criterions.id)
                if (i === 0) {
                    AudienceModel.id = uuidv1()
                    audienceId = AudienceModel.id
                    AudienceModel.name = audience.audienceName
                    AudienceModel.description = ""
                    AudienceModel.criterion_id = criterionItem.id
                    AudienceModel.owner_id = accountId
                    var o = new Audience(AudienceModel)
                    return await o.save().then(async () => {
                        console.log("Added audience name: " + audience.audienceName)
                        await audience_dao.getAudienceById(audienceId, accountId).then(async (data) => {
                            k = data.subscribers
                            var obj = {
                                audience_id: "",
                                subscriber_id: ""
                            }
                            await k.map(async (item) => {
                                obj.audience_id = audienceId
                                obj.subscriber_id = item.id
                                await Audience_Subscriber.create(obj)
                                obj = {}
                            })
                            return await res.json(data)
                        })
                    })
                }
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).send("server error" + error)
    }
});

router.get("/:audienceId", auth, async (req, res) => {
    const audienceId = req.params.audienceId
    const accountId = req.account.id
    try {
        const criterion = await audience_dao.getAudienceById(audienceId, accountId);
        res.json(criterion)
    } catch (error) {
        console.log(error)
        res.status(500).send("server error" + error)
    }
});

router.put("/delete", auth, async (req, res) => {
    var selectedRowKeys = req.body;
    console.log(selectedRowKeys);
    var accountId = req.account.id;
    console.log(accountId + JSON.stringify(selectedRowKeys));
    try {
        const status = await audience_dao.deleteAudience(selectedRowKeys, accountId);
        await res.status(200).json(status);
    } catch (err) {
        console.log(err.message);
        res.status(200).send("Server error " + err);
    }
});

router.get("/subscribers/:audienceId", auth, async (req, res) => {
    var audienceId = req.params.audienceId;
    try {
        const data = await audience_dao.getSubscribersByAudienceId(audienceId);
        await res.status(200).json(data);
    } catch (err) {
        console.log(err);
    }
});

router.put("/removeSubscribers", auth, async (req, res) => {
    var body = req.body;
    try {
        await audience_dao.removeSubscriberOutOfAudience(body);
        await res.status(200).json(true);
    } catch (err) {
        console.log(err);
    }
});

// router.post("/post", auth, async (req, res) => {
//     const definition = req.body


// });

module.exports = router;
