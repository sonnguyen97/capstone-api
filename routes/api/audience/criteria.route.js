const express = require("express");
const router = express.Router();
// const db = require("../../config/db");
const Criterion = require("../../../models/Criterion");
const CriterionType = require("../../../models/CriterionType");
const criterionType_dao = require("../../../dao/criteria.dao");
const auth = require("../../../middleware/auth.middleware");
const { E_COMMERCE } = require("../../../constants/audience/audience-definition/criterion/CriterionType.constant");
const { AND } = require("../../../constants/audience/audience-definition/criterion/CriterionFollowerExpression.constant");

router.get("/", auth, async (req, res) => {
    let Criterion = {
        id: E_COMMERCE.id,
        name: E_COMMERCE.name,
        criterionFollowerExprestion: [AND],
        filterfield: []
    };

    let Filter_Expression =
    {
        id: "",
        name: "",
        filterExpressions: []
    }

    try {
        const criterionType = await criterionType_dao.getCriterionType();
        
        const filterExpression = await criterionType_dao.getFilterExpression();
        const filterfields = await criterionType_dao.getFilterField();
        let Filter_ExpressionModel = []
        filterfields.forEach(ff => {
            Filter_Expression = {
                id: "",
                name: "",
                filterExpressions: []
            },
                Filter_Expression.id = ff.id,
                Filter_Expression.name = ff.name,
                filterExpression.forEach(fe => {
                    if (ff.id === fe.field_id) {
                        Filter_Expression.filterExpressions.push(fe.FilterExpression)
                    }
                })
            Filter_ExpressionModel.push(Filter_Expression)

        })
        Criterion.filterfield = Filter_ExpressionModel
        res.json(Criterion)
    } catch (error) {
        console.log(error)
        res.status(500).send("server error" + error)
    }
});

router.get("/definition", async (req, res) => {
    try {
        const re = await criterionType_dao.getDefinitionCriteria()
        res.json(re)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;
