const dotenv = require('dotenv');

dotenv.config();
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

module.exports = {
    local: {
        username:process.env.DB_USER_NAME,
        password:process.env.DB_PASSWORD,
        database:process.env.DB_NAME,
        host:process.env.DB_HOST,
        dialect: 'mysql',
    }, 
    development: {
        username:process.env.DB_USER_NAME,
        password:process.env.DB_PASSWORD,
        database:process.env.DB_NAME,
        host:process.env.DB_HOST,
        dialect: 'mysql',
    },
    production: {
        username:process.env.DB_USER_NAME,
        password:process.env.DB_PASSWORD,
        database:process.env.DB_NAME,
        host:process.env.DB_HOST,
        dialect: 'mysql',
    }
};