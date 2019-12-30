module.exports = {
  CANCELLED_ORDER_TIMES: {
    id: "676c95b0-7780-4085-b56f-a312fc57cd6d",
    name: "CancelledOrderTimes",
    criterionTypes: [
      { id: "fee67a7c-cbf5-4deb-abd3-33add96c35f7", name: "E-Commerce" }
    ],
    filterExpressions: [
      { id: "b2fe175b-2598-43da-9999-96fb0ce82aca", value: "equals" },
      { id: "3b7e2232-3a44-4564-bb3a-e2c3d9c2a8ec", value: "greater than" },
      { id: "4a2649da-8246-434a-b536-8a86887a64ad", value: "less than" }
    ]
  },
  EMAIL_ADDRESS: {
    id: "g174714c-2bba-44c1-a5d5-55e99f2r5593",
    name: "EmailAddress",
    criterionTypes: [
      { id: "fee67a7c-cbf5-4deb-abd3-33add96c35f8", name: "PersonalInformation" },
    ],
      filterExpressions: [
        { id: "y42649da-8246-434a-b536-8a86887a64rt", value: "contains" },
        { id: "b2fe175b-2598-43da-9999-96fb0ce82aca", value: "equals" },
        { id: "mm2649da-8246-434a-b536-8a86887a64rr", value: "not equals" }
      ]
  },
  FIRST_NAME: {
    id: "h174714c-2bba-44c1-a5d5-55e99f2r0594",
    name: "FirstName",
    criterionTypes: [
      { id: "fee67a7c-cbf5-4deb-abd3-33add96c35f8", name: "PersonalInformation" },
    ],
      filterExpressions: [
        { id: "y42649da-8246-434a-b536-8a86887a64rt", value: "contains" },
        { id: "b2fe175b-2598-43da-9999-96fb0ce82aca", value: "equals" },
        { id: "mm2649da-8246-434a-b536-8a86887a64rr", value: "not equals" }
      ]
  },
  LAST_NAME: {
    id: "9095cc78-3def-46b7-b6cd-1bc899df5c20",
    name: "LastName",
    criterionTypes: [
      { id: "fee67a7c-cbf5-4deb-abd3-33add96c35f8", name: "PersonalInformation" },
    ],
      filterExpressions: [
        { id: "y42649da-8246-434a-b536-8a86887a64rt", value: "contains" },
        { id: "b2fe175b-2598-43da-9999-96fb0ce82aca", value: "equals" },
        { id: "mm2649da-8246-434a-b536-8a86887a64rr", value: "not equals" }
      ]
  },
  TOTAL_ORDERS: {
    id: "3508a904-ee3d-4823-b392-7c04a1085294",
    name: "TotalOrder",
    criterionTypes: [
      { id: "fee67a7c-cbf5-4deb-abd3-33add96c35f7", name: "E-Commerce" }
    ],
    filterExpressions: [
      { id: "b2fe175b-2598-43da-9999-96fb0ce82aca", value: "equals" },
      { id: "3b7e2232-3a44-4564-bb3a-e2c3d9c2a8ec", value: "greater than" },
      { id: "4a2649da-8246-434a-b536-8a86887a64ad", value: "less than" }
    ]
  },
  TOTAL_SPENT: {
    id: "f174714c-2bba-46c1-a5d5-55e99f2f5583",
    name: "TotalSpent",
    criterionTypes: [
      { id: "fee67a7c-cbf5-4deb-abd3-33add96c35f7", name: "E-Commerce" }
    ],
    filterExpressions: [
      { id: "b2fe175b-2598-43da-9999-96fb0ce82aca", value: "equals" },
      { id: "3b7e2232-3a44-4564-bb3a-e2c3d9c2a8ec", value: "greater than" },
      { id: "4a2649da-8246-434a-b536-8a86887a64ad", value: "less than" }
    ]
  },
  TOTAL_JOINED_DAYS: {
    id: "f174714c-2bba-46c1-a5d5-55e99f2f5997",
    name: "TotalJoinedDays",
    criterionTypes: [
      { id: "fee67a7c-cbf5-4deb-abd3-33add96c35f7", name: "E-Commerce" }
    ],
    filterExpressions: [
      { id: "b2fe175b-2598-43da-9999-96fb0ce82aca", value: "equals" },
      { id: "3b7e2232-3a44-4564-bb3a-e2c3d9c2a8ec", value: "greater than" },
      { id: "4a2649da-8246-434a-b536-8a86887a64ad", value: "less than" }
    ]
  }
};
