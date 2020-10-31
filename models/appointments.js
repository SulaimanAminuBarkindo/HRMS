//import required modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema design
const AppointmentSchema = new Schema({
    to: {type: String},
    toId: {type: String},
    createdBy: {type: String},
    createdById: {type: String},
    cardNumber: {type: String},
    doctorSpecialization: {type: String},
    status1: {type: String, default: 'pending'},
    status2: {type: String, default: 'pending'},
    name: {type: String} 
}, { timestamps: true });

//connect the schema with user table
const Appoimtment = mongoose.model('appointment', AppointmentSchema);

//export the model 
module.exports = Appoimtment;