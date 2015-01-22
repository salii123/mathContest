// Connect to MongoDB using Mongoose
var mongoose = require('mongoose');
var db;
if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    db = mongoose.createConnection(env['mongodb-2.2'][0].credentials.url);
} else {
    db = mongoose.createConnection('localhost', 'mathBattleApp');
}

// Get Record schema and model
var RecordSchema = require('../models/record.js').recordSchema;
var Records = db.model('MathRecord', RecordSchema);

//