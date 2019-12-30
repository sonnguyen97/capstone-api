const Sequelize = require('sequelize');
// module.exports = new Sequelize('EMM', 'EMM', 'Z@123456', {
//     host: '198.71.225.61',
//     dialect: 'mysql',
//     port: 3306,
//     timestamps: false,
//     // insecureAuth: true,
//     // dialectOptions: { options: { encrypt: true } },

//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
// });
module.exports = new Sequelize('EMMv2', 'EMMv2', 'Z@123456', {
    host: '198.71.225.61',
    dialect: 'mysql',
    port: 3306,
    timestamps: false,
    // insecureAuth: true,
    // dialectOptions: { options: { encrypt: true } },

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});



