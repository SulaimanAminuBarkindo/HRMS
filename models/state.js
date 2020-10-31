const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StateSchema = new Schema({
    name: { type: String },
    id: { type: Number },
    locals: [{ name: { type: String }, id: { type: Number } }]
});

const STATE = mongoose.model('state', StateSchema);
module.exports = STATE;