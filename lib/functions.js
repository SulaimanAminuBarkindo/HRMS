const Patient = require('../models/patient');

exports.countPropOcurrence = (array, property) => {
    array.reduce((acc, cur) => cur.from === property ? ++acc : acc, 0);
};

//check if user is logged in && the user is not trying to access unauthorised data
exports.isLoggedIn = function(role) {
    return (req, res, next) => {
    if(req.isAuthenticated() && req.user.role === role) return next();
    res.redirect('/auth/login');
}
};

exports.searchPatient = async (req, res) => {
        try {
            const data = await
            Patient.find({  
                $or: [
                  { cardNumber: req.query.searchParam },
                  { phoneNumber: req.query.searchParam } ]});
            if(data.length) {
                res.json({ success: 'true', data });
            }
            res.json({ success: 'false', 'msg': 'invalid Card Number' });
            
            } catch { error => console.log(error) }
    }  

