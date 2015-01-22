// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	id: String,
	pwd: String,
	score: Number
});

// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('user', UserSchema);
