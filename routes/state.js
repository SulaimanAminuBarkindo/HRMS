const router = require('express').Router();
const controller = require('../controllers/state');
const multer = require('multer');
const upload = multer();

router.get('/:name', controller.getLocals);

router.post('/', upload.none(), controller.addStates);

module.exports = router;