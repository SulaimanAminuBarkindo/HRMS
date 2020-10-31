const router = require('express').Router();
const controller = require('../controllers/auth');
const functions = require('../lib/functions');
const credentials = require('../lib/credentials');
const multer = require('multer');
const storage = multer.diskStorage({ 
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`)
    }
 });
 const upload = multer({ storage: storage });

//register route
router.post('/register', upload.none(), credentials.regRules, controller.register);
router.get('/login', controller.displayLogin);
//login route
router.post('/login', upload.none(), credentials.loginRules, controller.login);
//logout route
router.post('/logout', functions.isLoggedIn, controller.logout);
//ensure login 
router.post('/edit-profile', upload.single('image'), controller.editProfile);

//export router 
module.exports = router;