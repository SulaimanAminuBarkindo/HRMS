const passport = require('passport');
const User = require('../models/auth');
const connectEnsureLogin = require('connect-ensure-login');
const {check, validationResult} = require('express-validator');

exports.register = async function(req, res, next){
    try {
        //validate and sanitize the data first
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json(errors.array());
    }
        //then create the user instance
        user = new User({
            username: req.body.username, role: req.body.role, name: req.body.name
        });

        //save the user to the DB
        User.register(user, req.body.password, function(error, user){
            if(error) res.json({ success: false, message: 'something went wrong' });
            res.json({ success: true, message: 'Registration successful'});
        });

    } catch (error) {
        res.json({ success: false, error })
    }
    
};

exports.displayLogin = function(req , res) {
    res.render('auth/login');
}

exports.login = function(req, res, next){
    //validate data
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
  }
  // perform authentication
    passport.authenticate('local', function(error, user, info){
        if(error) return res.json({success: false, msg: error});
        if(!user) return res.json({success: false, msg: 'username or password is incorrect'});
        req.login(user, function(error){
           if(error) res.json({success: false, msg: 'something went wrong pls try again'});  
           req.session.user = user;
           switch(user.role) {
                case 'doctor':
                    res.send({success: true, user});
                break;
                case 'nurse':
                    res.send({success: true, user}); 
                break;
                case 'lab':
                    res.send({success: true, user}); 
                break;
                case 'pharmacist':
                    res.send({success: true, user}); 
                break;
                case 'receptionist':
                    res.send({success: true, user}); 
                break;
                default:
                    res.send({success: false, msg: 'unKnown Role'}); 
            }           
        });
    })(req, res, next)
};

exports.logout = function(req, res, next){
    req.logout();
    //redirect to login page
    res.send({message: 'you are logged out'});
};

exports.editProfile = async function(req, res) {

try {
    let profile;
    if(req.file===undefined && req.body.newPassword===''){
        profile = await 
        User.findByIdAndUpdate(req.body.id, {
            email: req.body.email,
            name: req.body.name
        }, { new: true });
        res.json({ success: true, msg: 'profile updated successfully', profile });
    
}  
    else if(req.body.newPassword==='') {
        profile = await 
        User.findByIdAndUpdate(req.body.id, {
            name: req.body.name,
            email: req.body.email,
            image: req.file.filename
        }, { new: true });
        res.json({ success: true, msg: 'profile updated successfully', profile });
    
}
    else if(req.file===undefined) {
        if(req.body.confPassword === req.body.newPassword) {
            profile = await 
            User.findByIdAndUpdate(req.body.id, {
                name: req.body.name,
                email: req.body.email,
            }, { new: true });
             await profile.changePassword(req.body.oldPassword, req.body.newPassword);
             await profile.save();
             res.json({ success: true, msg: 'profile updated successfully', profile });
        }
        res.json({success: false, msg: 'password does not match'});      
}  
     else {
        if(req.body.confPassword === req.body.newPassword) {
            profile = await 
            User.findByIdAndUpdate(req.body.id, {
                name: req.body.name,
                email: req.body.email,
                image: req.file.filename
            }, { new: true });
            await profile.changePassword(req.body.oldPassword, req.body.newPassword);
            await profile.save();
            res.json({ success: true, msg: 'profile updated successfully', profile });
        }
        res.json({success: false, msg: 'password does not match'});       
}
} catch { error => console.log(error)};
} 