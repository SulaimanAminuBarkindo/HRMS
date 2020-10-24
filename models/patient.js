const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PatientSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'Firstname is required']
    },
    lastName: {
        type: String,
        required: [true, 'Firstname is required']
    },
    middleName: {
        type: String
    },
    dob: {
        type: String
        // required: [true, 'birthday is required']
    },
    age: {
        type: Number
        // required: [true, 'Age is required']
    },
    accountType: {
        type: String
        // required: [true, 'account Type is required']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone Number is required']
    },
    address: {
        type: String,
        required: [true, 'Adress is required']
    },
    state: {
        type: String,
        required: [true, 'State is required']
    },
    lga: {
        type: String
        // required: [true, 'LGA is required']
    },
    gender: {
        type: String
        // required: [true, 'gender is required']
    },
    cardNumber: {
            type: String
            // required: true 
    },
    createdBy: {
        type: String
    },
    createdById: {
        type: String
    },
    updatedBy: {
        type: String
    },
    updatedById: {
        type: String
    },
    deletedBy: {
        type: String
    },
    deletedById: {
        type: String
    },
    status: {
        type: String, default: 'active'
    }

}, { timestamps: true });

const Patient = mongoose.model('patient', PatientSchema);

module.exports = Patient;