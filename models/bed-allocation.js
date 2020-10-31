const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BedAllocationSchema = new Schema({
    cardNumber: { type: String },
    patientName: { type: String },
    gender: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    wardNumber: { type: String },
    roomNumber: { type: String },
    bedNumber: { type: String },
    createdBy: { type: String },
    createdById: { type: String },
    updatedBy: { type: String }, 
    updatedById: { type: String },
    deActivatedBy: { type: String }, 
    deActivatedById: { type: String },
    status: { type: String, default: 'active' },
}, { timestamps: true });

const BedAllocation = mongoose.model('bedAllocation', BedAllocationSchema);

module.exports = BedAllocation;