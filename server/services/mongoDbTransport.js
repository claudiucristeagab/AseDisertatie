const Transport = require('winston-transport');
const util = require('util');
const LogModel = require('../models/log');

module.exports = class MongoDbTransport extends Transport {
    constructor(opts) {
        super(opts);
    }
   
    log(info, callback) {
        setImmediate(() => {
            this.emit('logged', info);
        });

        const logObj = new LogModel({
            level: info.level,
            message: info.message,
            meta: info.meta,
            timestamp: info.timestamp
        });
        logObj.save();

        callback();
    }
};