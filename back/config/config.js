const dotenv = require('dotenv');

dotenv.config();


module.exports = {
    local: {
        username:'root',
        password:process.env.DB_PASSWORD,
        database:'Mysql',
        host:'127.0.0.1',
        dialect: 'mysql',
    }, 
    development: {
        username:'root',
        password:process.env.DB_PASSWORD,
        database:'Mysql',
        host:'',
        dialect: 'mysql',
    },
    production: {
        username:'root',
        password:process.env.DB_PASSWORD,
        database:'Mysql',
        host:'adsads',
        dialect: 'mysql',
    }
};