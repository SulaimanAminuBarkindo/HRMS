const {check, validationResult} = require('express-validator');
const credentials = {
    
    secret: 'secret',

    //rules for validating and sanitizing new patient data for registration
    patientRegRules: [
    // username must be an email
    check('firstName', 'please provide the firstname').not().isEmpty(),
    // password must be at least 5 chars long
    check('lastName', 'lastname must be greater than 5').isLength({ min: 5 }),
],
    regRules: [
        // username must be an email
        check('username', 'username cannot be empty').not().isEmpty().escape(),
        // password must be at least 5 chars long
        check('password', 'password is must be greater than 5 karas').isLength({ min: 5 }).not().isEmpty(),
        check('role', 'account role cannot be empty').not().isEmpty().escape(),
],
    loginRules: [
        // username must be an email
        check('username', 'username cannot be empty').not().isEmpty().escape(),
        // password must be at least 5 chars long
        check('password', 'password cannot be empty').not().isEmpty(),
],

};

module.exports = credentials;