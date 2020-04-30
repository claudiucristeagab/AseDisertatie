const winston = require('winston');
const expressWinston = require('express-winston');
const MongoDbTransport = require('./mongoDbTransport');

const consoleLog = new winston.transports.Console();
const fileLog = new winston.transports.File({ filename: 'combined.log' })
const mongoDbLog = new MongoDbTransport();

const transports = [consoleLog, fileLog, mongoDbLog];

const createExpressLogger = (transports) => {
    return expressWinston.logger({
        transports: transports,
        format: winston.format.combine(
            winston.format.json()
          )
    })
}

const createExpressErrorLogger = (transports) =>{
    return expressWinston.logger({
        level: 'error',
        transports: transports,
        format: winston.format.combine(
            winston.format.json()
          )
    })
}

module.exports = {
    expressLogger: createExpressLogger(transports),
    expressErrorLogger: createExpressErrorLogger(transports)
}