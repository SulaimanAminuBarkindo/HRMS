const router = require('express').Router();
const controller = require('../controllers/lab');
const multer = require('multer');
const upload = multer();
const functions = require('../lib/functions');

router.get('/', controller.dashboard);
router.get('/doctor-notifications', controller.displayNotifications);
router.get('/lab-test', controller.displayLabTest);
router.post('/lab-test', upload.none(), controller.addLabResult);

module.exports = router;