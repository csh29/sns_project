const dotenv = require('dotenv');

dotenv.config();
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

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
        host:process.env.DB_HOST,
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