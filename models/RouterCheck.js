const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RouterCheckSchema = new Schema({
    Url: { type: String, required: true },
    NameUrl: { type: String, required: true },
    userId: [{ type: Schema.ObjectId, ref: 'User'}],    
});

module.exports = mongoose.model('RouterCheck', RouterCheckSchema);