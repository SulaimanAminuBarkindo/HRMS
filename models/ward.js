const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WardSchema = new Schema({
    number: { type: String },
    rooms: [{
            number: { type: String }, 
            bedSpace: [{ 
                number: { type: String }, 
                status: { type: String } }], 
            status: { type: String, default: 'not occupied' }
        }],
    status: { type: String, default: 'not occupied' }
}, { timestamps: true });

const Ward = mongoose.model('ward', WardSchema);

module.exports = Ward;