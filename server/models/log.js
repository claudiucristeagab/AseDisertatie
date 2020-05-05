const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
    message: { type: String },
    level: { type: String },
    meta: { type: Object },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('_Log', logSchema);