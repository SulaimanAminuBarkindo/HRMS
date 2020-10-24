const Patient = require('../models/patient');
const Appointment = require('../models/appointments');
const BedAllocation = require('../models/bed-allocation');
const User = require('../models/auth');
const {check, validationResult} = require('express-validator');


// start of controller for displaying dasboard
exports.dashboard = async function(req, res){
    //will do this for three depts
    try{
    const patients = await 
    Patient
    .find({ status: 'active' }).countDocuments();
    
    const acceptedAppointments = await 
    Appointment
    .find({ status1: 'accepted', status2: 'pending' }).countDocuments();

    const openedLabResults = await 
    Appointment
    .find({ 'lab.labRequestStatus2': 'opened', status: 'pending' }).countDocuments();

    const loggedOut = await 
    User
    .find({ status: 'offline', role: 'doctor' }).countDocuments();

    res.render('receptionist/dashboard', {             
        acceptedAppointments, 
        openedLabResults,
        loggedOut,
        patients
    });
    
    } catch { error => console.log(error) };
}

// start of controllers for patient activites
exports.createNewPatient = async function(req, res){   
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
  }  
    try {
    const numPatients = await 
    Patient
    .find({ status: 'active' }).countDocuments();

    const d = new Date();
    const y = d.getFullYear();
    const m = (`0${d.getMonth() +1}`).slice(-2);
    const uniqueId = (`00000${numPatients +1}`).slice(-5);
    const cardNumber = `${y}/${m}/${uniqueId}`;

    req.body.cardNumber = cardNumber;
    req.body.createdBy = req.user.name;
    req.body.createdById = req.user._id;

        
    const patient = await 
    Patient
    .create(req.body);
    res.json({ success: true, patient });

    } catch { error => res.json({ success: false, error }) };
};

// controller for printing handCard to new patient
exports.printCard = async function(req, res) {
    const patient = await 
    Patient.findById(req.query.id);
    res.render('receptionist/print', { patient });
}

// controller for fetching all patients
exports.showPatients = async function(req, res) {

    try {

    const patients = await 
    Patient
    .find({ status: 'active' });

    const acceptedAppointments = await 
    Appointment
    .find({ status1: 'accepted', status2: 'pending' }).countDocuments();

    const openedLabResults = await 
    Appointment
    .find({ 'lab.labRequestStatus2': 'opened', status: 'pending' }).countDocuments();

    const loggedOut = await 
    User
    .find({ status: 'offline', role: 'doctor' }).countDocuments();

    res.render('receptionist/patient', { 
        patients,            
        acceptedAppointments,
        openedLabResults,
        loggedOut });
    
    } catch { error => console.log(error) };
};

// controller for displaying patient data to be updated
exports.displayPatientData = async function(req, res) {
    try {

        const patient = await Patient.findById(req.query.id);
        //should render page with this data
        // res.render('', { patient });
        res.json({ success: true, patient });

    } catch { error => res.json({ success: false, msg: error.msg }) }

};

exports.updatePatient = async function(req, res) {
    try {
// will work on this
        req.body.updatedBy = req.user.name;
        req.body.updatedById = req.user._id;
        const patient = await Patient.findByIdAndUpdate(req.body.id, req.body, 
            { useFindAndmodify: false, new: true });
        res.json({ success: true, patient });

    } catch { error => res.json({ success: false, msg: error.msg }) }

}

exports.deletePatient = async function(req, res) {
    try {
        req.body.deletedBy = req.user.name;
        req.body.deletedById = req.user._id;
        await Patient.findByIdAndUpdate(req.query.id, {
            status: 'deleted'
        }, { useFindAndmodify: false });
        const patients = await Patient.find({ status: 'active' });
        res.json({ success: true, patients });

    } catch { error => res.json({ success: false, msg: error.msg }) }

}
// end of controllers for patient activities

// start of controllers for appointments
exports.createAppointments = async function(req, res) {
    try {
    req.body.createdBy = req.user.name;
    req.body.createdById = req.user._id;
    const patient = await Patient.find({ cardNumber: req.body.cardNumber });
    if(patient.length) {
        const appointment = await 
        Appointment
        .create(req.body);
         res.json({ success: true, appointment });
    }
    res.json({ success: false, msg: 'invalid Card Number' });

    } catch { error => res.json({ success: false, msg: error })};
};

exports.fetchAppointments = async function(req, res) {
    //will change to doctor notifications
    try{
        const appointments = await Appointment.find({ });
        const doctors = await User.find({ role: 'doctor' });
        
        const acceptedAppointments = await 
        Appointment
        .find({ status1: 'accepted', status2: 'pending' }).countDocuments();
    
        const openedLabResults = await 
        Appointment
        .find({ 'lab.labRequestStatus2': 'opened', status: 'pending' }).countDocuments();
    
        const loggedOut = await 
        User
        .find({ status: 'offline', role: 'doctor' }).countDocuments();
        res.render('receptionist/appointment', { success: true,
                                                 appointments, 
                                                 doctors,
                                                 acceptedAppointments,
                                                 openedLabResults,
                                                 loggedOut });

    } catch { error => res.json({ success: false, error })}
};
// end of controllers for appointments

// start of bed space activitiess controller
// controller for fetching all allocated bed space Data
exports.getAllocatedBedSpaces = async function(req, res) {
    try{
        const bedSpaces = await 
        BedAllocation.find({ status: 'allocated' });
        res.json({ success: true, bedSpaces })
    } catch { error => res.json({ success: false, error })}

}

// controller for fetching searched bed space Data
exports.getAllocatedBedSpace = async function(req, res) {
    try{
        const bedSpaces = await 
        BedAllocation.find({ cardNumber: req.body.id });
        res.json({ success: true, bedSpaces })
    } catch { error => res.json({ success: false, error })}

}
// end of bed space activities controller

exports.displayReceptionistProfile = async function(req, res) {
    try {
        res.render('receptionist/profile', {
            user: req.user
        });
    } catch { error => res.send(error); }
};