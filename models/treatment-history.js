const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const VitalSignsSchema = new Schema({
    temperature: { type: String },
    pulse: { type: String },
    resp: { type: String },
    bloodPressure: { type: String }
});

const ComplainSchema = new Schema({
    complainText: { type: String },
    symptoms: { type: Array }
});

const PrescriptionSchema = new Schema({
    injectionOrDrugName: { type: String },
    type: { type: String },
    unit: { type: String },
    prescriptions: { type: String }
});

const LabSchema = new Schema({
    labRequest: { type: Array },
    labResult: { type: Array },
    labAttendant: { type: String, default: 'Labtician' },
    labAttendantId: { type: String },
    labRequestStatus1: { type: String, default: 'not done' },
    labRequestStatus2: { type: String, default: 'pending' },
});

const TreatmentHistorySchema = new Schema({
    vitalSigns: VitalSignsSchema, 
    complain: ComplainSchema,
    prescriptions: [PrescriptionSchema],
    lab: LabSchema,
    diagnosis: { type: String },
    name: { type: String },
    cardNumber: { type: String },
    createdBy: { type: String },
    createdById: { type: String },
    Inpatient: { type: String },
    opened: { type: Boolean, default: false },
    status: { type: String }
}, { timestamps: true });

const TreatmentHistory = mongoose.model('treatmentHistory', TreatmentHistorySchema);

module.exports = TreatmentHistory;