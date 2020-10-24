const multer = require('multer');
const upload = multer();
const router = require('express').Router();
const controller = require('../controllers/receptionist');
const { isLoggedIn, searchPatient }= require('../lib/functions');
const credentials = require('../lib/credentials');

// route for displaying recdeptionist dashboard
router.get('/', isLoggedIn('receptionist'), controller.dashboard);

// start of routes for patient activities
// route for creating new patient
router.post('/patient', isLoggedIn('receptionist'), upload.none(), credentials.patientRegRules, controller.createNewPatient);
// route for printing handCard for new patient
router.get('/print', isLoggedIn('receptionist'), controller.printCard);
// route for fetching all existing patients
router.get('/patient', isLoggedIn('receptionist'), controller.showPatients);
// route for fetching patient to be updated
router.get('/patient/update', isLoggedIn('receptionist'), controller.displayPatientData);
// route for updating patient data
router.put('/patient/update', isLoggedIn('receptionist'), upload.none(), controller.updatePatient);
// route for deleting patient
router.delete('/patient/delete', isLoggedIn('receptionist'), controller.deletePatient);
// route for fetching serached patient
router.get('/patient/search', isLoggedIn('receptionist'), searchPatient);
// end of routes for patient activities

// start of routes for apponitemtns activities
// route for creating appointments
router.post('/appointment', isLoggedIn('receptionist'), upload.none(), controller.createAppointments);
// route for fetching appointments
router.get('/appointment', isLoggedIn('receptionist'), controller.fetchAppointments);
// end of routes for appointment activities

// start of routes for bed space activities
// route for fetching allocated bed space Data
router.get('/bed-space', controller.getAllocatedBedSpaces);
// route for fetching searched bed space Data
router.get('/bed-space/search', controller.getAllocatedBedSpace);
// end of routes for bed space activities

// route for receptionist profile
router.get('/profile', isLoggedIn('receptionist'), controller.displayReceptionistProfile);

module.exports = router;