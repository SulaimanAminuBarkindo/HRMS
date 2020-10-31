const router = require('express').Router();
const controller = require('../controllers/nurse');
const multer = require('multer');
const upload = multer();
const functions = require('../lib/functions');


router.get('/', functions.isLoggedIn('nurse'), controller.dashboard);
// start of routes for bed allocation
router.get('/bed-allocation', controller.getBedAllocationPage);
router.get('/ward', controller.getRooms);
router.post('/bed-allocation', upload.none(), controller.allocateBed);
router.get('/allocated-bed-list', functions.isLoggedIn('nurse'), controller.allocatedBedList);
router.get('/allocated-bed-list/search', functions.isLoggedIn('nurse'), controller.fetchAllocatedBed);
router.put('/bed-allocation', upload.none(), controller.updateBed);
router.delete('/allocated-bed-list', upload.none(), controller.deActivateBed);
// end of routes for bed allocation
router.get('/notification-detail', functions.isLoggedIn('nurse'), controller.fetchNotificationDetail);
router.get('/patient', functions.isLoggedIn('nurse'), controller.showPatients);
router.get('/patient/:searchParam', functions.isLoggedIn('nurse'), controller.fetchPatient);
router.post('/add-wards', controller.addWard);


module.exports = router;