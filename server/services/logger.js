const winston = require('winston');
const expressWinston = require('express-winston');
const MongoDbTransport = require('./mongoDbTransport');
const config = require('../config/config.development');

const customSimpleFormat = (info) => `[${info.timestamp}] ${info.level}: ${info.message} ${JSON.stringify(info.meta)}`;

const consoleLog = new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(info => customSimpleFormat(info))
    )
});
const fileLog = new winston.transports.File({ 
    filename: 'combined.log',
    format: winston.format.printf(info => customSimpleFormat(info))
})
const mongoDbLog = new MongoDbTransport({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    )
});
const asd = config.LOGGING
const transports = [consoleLog, mongoDbLog];

const createLogger = (transports) => {
    return winston.createLogger({
        transports: transports
    });
}

const createExpressLogger = (transports) => {
    return expressWinston.logger({
        transports: transports
    })
}

const createExpressErrorLogger = (transports) =>{
    return expressWinston.logger({
        level: 'error',
        transports: transports
    })
}

module.exports = {
    expressLogger: createExpressLogger(transports),
    expressErrorLogger: createExpressErrorLogger(transports)
}