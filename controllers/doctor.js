const Patient = require('../models/patient');
const Appointment = require('../models/appointments');
const TreatmentHistory = require('../models/treatment-history');
const {check, validationResult} = require('express-validator');
const User = require('../models/auth');
const { updateMany } = require('../models/patient');


//controller for displaying dasboard
exports.dashboard = async (req, res) => {
    //will do this for three depts
    try{
    const fromReceptionist = await 
    Appointment
    .find({ toId: req.user._id, status1: 'pending' }).countDocuments();

    const fromNurse = await 
    NurseNotification
    .find({ to: req.user._id, status: 'pending' }).countDocuments();

    const fromPharmacy = await 
    PharmacyNotification
    .find({ to: req.user._id, status: 'pending' }).countDocuments();

    const fromLab = await 
    TreatmentHistory
    .find({ createdById: req.user._id, 'lab.labRequestStatus1': 'done', opened: false }).countDocuments();

    res.render('doctor/dashboard', {             
        fromReceptionist: fromReceptionist, 
        fromNurse: fromNurse, 
        fromPharmacy: fromPharmacy,
        fromLab: fromLab });
    } catch { error => console.log(error) };
}

// start of controllers for patient activites
exports.createNewPatient = async (req, res) => {   
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
exports.printCard = async (req, res) =>  {
    const patient = await 
    Patient.findById(req.query.id);
    res.render('doctor/print', { patient });
}
// controller for fetching all patients
exports.showPatients = async (req, res) =>  {

    try {

    const patients = await 
    Patient
    .find({ status: 'active' });

    const fromReceptionist = await 
    Appointment
    .find({ to: req.user._id, status1: 'pending' }).countDocuments();

    const fromNurse = await 
    NurseNotification
    .find({ to: req.user._id, status: 'pending' }).countDocuments();

    const fromPharmacy = await 
    PharmacyNotification
    .find({ to: req.user._id, status: 'pending' }).countDocuments();

    const fromLab = await 
    LabNotification
    .find({ to: req.user._id, status: 'pending' }).countDocuments();

    res.render('doctor/patient', { 
        patients,            
        fromReceptionist, 
        fromNurse, 
        fromPharmacy,
        fromLab });   
    } catch { error => console.log(error) }
};

// controller for displaying patient data to be updated
exports.displayPatientData = async (req, res) =>  {
    try {

        const patient = await Patient.findById(req.query.id);
        //should render page with this data
        // res.render('', { patient });
        res.json({ success: true, patient });

    } catch { error => res.json({ success: false, msg: error.msg }) }

};

exports.updatePatient = async (req, res) =>  {
    try {
// will work on this
        req.body.updatedBy = req.user.name;
        req.body.updatedById = req.user._id;
        const patient = await Patient.findByIdAndUpdate(req.body.id, req.body, 
            { useFindAndmodify: false, new: true });
        res.json({ success: true, patient });

    } catch { error => res.json({ success: false, msg: error.msg }) }

}

exports.deletePatient = async (req, res) =>  {
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

// start of notifications controllers 
exports.appointments = async (req, res) =>  {
    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const notifications = await 
        Appointment
        .find({ toId: req.user._id, createdAt: { $gte: today } });

        const fromReceptionist = await 
        Appointment
        .find({ to: req.user.name, status1: 'pending' }).countDocuments();
    
        const fromNurse = await 
        NurseNotification
        .find({ to: req.user.name, status: 'pending' }).countDocuments();
    
        const fromPharmacy = await 
        PharmacyNotification
        .find({ to: req.user.name, status: 'pending' }).countDocuments();
    
        const fromLab = await 
        LabNotification
        .find({ to: req.user.name, status: 'unread' }).countDocuments();
    
        res.render('doctor/receptionist-notifications', { 
            notifications,          
            fromReceptionist,
            fromNurse,
            fromPharmacy,
            fromLab
        });
        await Appointment
        .updateMany({ to: req.user.name }, { status1: 'read' }, { multi: true });
    } catch { error => res.send(error) };
  };

exports.nurseNotifications = (req, res) =>  {
    NurseNotification
    .find({ to: req.user._id, from: 'nurse', status: 'unread' })
    .then((docs) => {
        res.render('doctor/notifications', { 
            docs: docs });
    })
    .catch(error => console.log(error));
};

exports.labNotifications = async (req, res) =>  {
    try {
        const notifications = await
        TreatmentHistory
        .find({ createdById: req.user._id, 'lab.labRequestStatus1': 'done' });
        res.render('doctor/lab-notifications', { notifications })
    } catch (error) {
        res.json({ success: false, error})
    }
};

exports.pharmacyNotifications = (req, res) =>  {
    PharmacyNotification
    .find({ to: req.user._id, from: 'pharmacy', status: 'unread' })
    .then((docs) => {
          res.render('doctor/notifications', { 
            docs: docs });
    })
    .catch(error => console.log(error));
};
// end of notifications controllers 

//controller for displaying patient profile
exports.patientProfile = async (req, res) =>  {

     try {
        const patient = await 
        Patient
        .find({ cardNumber: req.query.cardNumber });

        const treatmentHistory = await 
        TreatmentHistory
        .find({ cardNumber: req.query.cardNumber }).sort( { _id: -1 } ).limit(1);
console.log(treatmentHistory)
        res.render('doctor/patient-profile',{ 
                    patient, 
                    treatmentHistory });

    } catch { error => console.log(error)}
};

exports.newTreatmentHistory = async (req, res) =>  {
    req.body.createdBy = req.user.name;
    req.body.createdById = req.user._id;
    try {
        treatmentHistory = await 
        TreatmentHistory
        .create(req.body);
        res.json({ success: true, treatmentHistory });
    } catch(error) {
        console.log(error);
    }
    
};

exports.displayDoctorProfile = async (req, res) =>  {
    try {
        res.render('doctor/profile', {
            user: req.user
        });
    } catch { error => console.log(error); }
};


