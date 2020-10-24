const router = require('express').Router();
const controller = require('../controllers/doctor');
const multer = require('multer');
const upload = multer();
const { isLoggedIn, searchPatient } = require('../lib/functions');
const credentials = require('../lib/credentials');

router.get('/', isLoggedIn('doctor'), controller.dashboard);

// start of routes for patient activities
// route for creating new patient
router.post('/patient', isLoggedIn('doctor'), upload.none(), credentials.patientRegRules, controller.createNewPatient);
// route for printing handCard for new patient
router.get('/print', isLoggedIn('doctor'), controller.printCard);
// route for fetching all existing patients
router.get('/patient', isLoggedIn('doctor'), controller.showPatients);
// route for fetching patient to be updated
router.get('/patient/update', isLoggedIn('doctor'), controller.displayPatientData);
// route for updating patient data
router.put('/patient/update', isLoggedIn('doctor'), upload.none(), controller.updatePatient);
// route for deleting patient
router.delete('/patient/delete', isLoggedIn('doctor'), controller.deletePatient);
// route for fetching serached patient
router.get('/patient/search', isLoggedIn('doctor'), searchPatient);
// end of routes for patient activities

// start of notifications routes
router.get('/receptionist-notifications', isLoggedIn('doctor'), controller.appointments);
//router.get('/nurse-notifications', isLoggedIn('doctor'), controller.nurseNotifications);
router.get('/lab-notifications', isLoggedIn('doctor'), controller.labNotifications);
//router.get('/pharmacy-notifications', isLoggedIn('doctor'), controller.pharmacyNotifications);
//route for fetching searched patient
router.get('/patient-profile', isLoggedIn('doctor'), controller.patientProfile);
// end of notifications routes

//route for adding new treatment history for patient
router.post('/patient-profile', isLoggedIn('doctor'), upload.none(), controller.newTreatmentHistory);
router.get('/profile', isLoggedIn('doctor'), controller.displayDoctorProfile);
router.get('/print', isLoggedIn('doctor'), controller.printCard);
module.exports = router;