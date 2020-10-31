const TreatmentHistory = require("../models/treatment-history");

exports.dashboard = async function(req, res) {
    try {
        const fromDoctor = await 
        TreatmentHistory
        .find({ 'lab.labRequestStatus2': 'pending' }).countDocuments();
        res.render('lab/dashboard', { fromDoctor });
    } catch (error) {
        res.json({ success: false, error });
    }

}

// list of labrequest from Doctors
exports.displayNotifications = async function(req, res) {
    const notifications = await 
    TreatmentHistory
    .find({ 'lab': { $exists: true } }).limit(100);

    const fromDoctor = await 
    TreatmentHistory
    .find({ 'lab.labRequestStatus2': 'pending' }).countDocuments();

    res.render('lab/doctor-notifications', { fromDoctor, notifications });

    await TreatmentHistory
    .updateMany({ 'lab.labRequestStatus2': 'pending' }, { 'lab.labRequestStatus2': 'read' }, { multi: true });
}

// display the complete data of the patient to be tested 
exports.displayLabTest = async function(req, res) {
    // uncomment below code if other things partaining the treatment History
    // const patient = await 
    // TreatmentHistory
    // .findById(req.query.id);

    const treatmentId = req.query.id;

    const fromDoctor = await 
    TreatmentHistory
    .find({ 'lab.labRequestStatus2': 'pending' }).countDocuments();

    res.render('lab/lab-test', { fromDoctor, treatmentId });
}

// submit the lab result
exports.addLabResult = async function(req, res) {
    try {
        treatmentHistory = await 
        TreatmentHistory
        .findByIdAndUpdate(req.body.id, {
            'lab.labResult': ['fair', 'analysis'], 
            'lab.labRequestStatus1': 'done'
        }, { new: true });
        
        res.json({ success: true, treatmentHistory });
    } catch (error) {
        console.log(`error made ${error.msg}`)
    }
}