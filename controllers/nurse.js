const Appointment = require('../models/appointments');
const Patient = require('../models/patient'); 
const BedAllocation = require('../models/bed-allocation');
const Ward = require('../models/ward');
const { search } = require('../lib/functions');



exports.dashboard = async (req, res) =>{
    try{
        const numOfAllocatedBeds = await
        BedAllocation.find({ status: 'active' }).countDocuments();

        const fromReceptionist = await 
        Appointment
        .find({ to: 'nurse', status: 'pending' }).countDocuments();
    
        const fromDoctor = await 
        DoctorNotification
        .find({ to: 'nurse', status: 'pending' }).countDocuments();
    
        const fromPharmacy = await 
        PharmacyNotification
        .find({ to: 'nurse', status: 'pending' }).countDocuments();
    
        const fromLab = await 
        LabNotification
        .find({ to: 'nurse', status: 'pending' }).countDocuments();
    
        res.render('nurse/dashboard', {
            numOfAllocatedBeds,             
            fromReceptionist, 
            fromDoctor, 
            fromPharmacy,
            fromLab });
        } catch { error => console.log(error) };
};

// start of controllers for bed Allocation
exports.getBedAllocationPage = async (req, res) => {
    
    try{
        const wards = await 
        Ward
        .find({ status: 'not occupied' });

        const fromReceptionist = await 
        Appointment
        .find({ to: 'nurse', status: 'pending' }).countDocuments();
    
        const fromDoctor = await 
        DoctorNotification
        .find({ to: 'nurse', status: 'pending' }).countDocuments();
    
        const fromPharmacy = await 
        PharmacyNotification
        .find({ to: 'nurse', status: 'pending' }).countDocuments();
    
        const fromLab = await 
        LabNotification
        .find({ to: 'nurse', status: 'pending' }).countDocuments();

        const patient = await
        Patient
        .find({ cardNumber: req.query.cardNumber, 
                status: { $ne: 'deleted' } })
        .limit(1);

        res.render('nurse/bed-allocation', { 
            wards,            
            fromReceptionist, 
            fromDoctor, 
            fromPharmacy,
            fromLab,
            patient });
        } catch { error => console.log(error) };
};

exports.getRooms = async (req, res) => {
    try {
        const ward = await Ward.find({ number: req.query.number });
        res.json({ success: true, ward });
    } catch { error => res.json({ success: false, msg: error.msg })}
}

exports.allocateBed = async (req, res) =>{

    try{

    req.body.createdBy = req.user.name;
    req.body.createdById = req.user._id;
    const wardNumber = req.body.wardNumber;
    const roomNumber = req.body.roomNumber;
    const bedNumber = req.body.bedNumber;

    const allocatedBed = await 
    BedAllocation
    .create(req.body);

    // get room and bed index so as to enable updating of the room & bed array
    const room = await 
    Ward
    .aggregate([
        { $match: { 'number': wardNumber } },
        { $project: { 
            roomIndex: { $indexOfArray: ['$rooms.number', roomNumber] },
            rooms: '$rooms' }},
        { $project: { 
            room: { $arrayElemAt: ['$rooms', '$roomIndex'] },
            roomIndex: '$roomIndex' }},
         { $project: { 
            bedIndex: { $indexOfArray: [ '$room.bedSpace.number', bedNumber]},
            roomIndex: '$roomIndex' }
          } 
        ]);
        
    const roomIndex = room[0].roomIndex;
    const bedIndex = room[0].bedIndex;
    const updateBedStatus = `rooms.${roomIndex}.bedSpace.${bedIndex}.status`;
    const updateRoomStatus = `rooms.${roomIndex}.status`;

    // update selected bedspace status to occupied 
    await Ward.updateOne({ 'number': wardNumber },
                         { [updateBedStatus]: 'occupied' }, 
                         { new: true });

// check if there are unoccupied beds in the room by returning the first occurrence
   const dbBeds = await Ward.aggregate([
        { $match: { 
            'number': wardNumber }},
        { $project: {
            room: { $arrayElemAt: ['$rooms', roomIndex]} 
        }},
        { $project: { 
            unOccupiedBeds: { $indexOfArray: [ '$room.bedSpace.status', 'not occupied' ] }}},   
    ]);
    
    if (dbBeds[0].unOccupiedBeds === -1) {
        // update the room status to occupied
        await Ward
        .updateOne({ 
            'number': wardNumber },
            { [updateRoomStatus]: 'occupied' });
    } 
    // check if there are unoccupied rooms in the ward by returning the first occurrence
    const dbRooms = await Ward.aggregate([
        { $match: { 
            'number': wardNumber }},
        { $project: { 
            unOccupiedRooms: { $indexOfArray: [ '$rooms.status', 'not occupied' ] }}},   
    ]);
    if(dbRooms[0].unOccupiedRooms === -1) {
        await Ward
    .updateOne({ 
        'number': wardNumber },
        { status: 'occupied' });
    }
    console.log(bedIndex, roomIndex, dbRooms[0].unOccupiedRooms);
    res.json({ success: true, allocatedBed });

    } catch { error => console.log(error); }
};

exports.allocatedBedList = async (req, res) =>{

    try{
        const fromReceptionist = await 
        Appointment
        .find({ to: 'nurse', status: 'pending' }).countDocuments();
    
        const fromDoctor = await 
        DoctorNotification
        .find({ to: 'nurse', status: 'pending' }).countDocuments();
    
        const fromPharmacy = await 
        PharmacyNotification
        .find({ to: 'nurse', status: 'pending' }).countDocuments();
    
        const fromLab = await 
        LabNotification
        .find({ to: 'nurse', status: 'pending' }).countDocuments();

        const allocatedBedList = await 
        BedAllocation
        .find({  }).limit(2);
    
        res.render('nurse/allocated-bed-list', {             
            fromReceptionist, 
            fromDoctor, 
            fromPharmacy,
            fromLab,
            allocatedBedList });
        } catch { error => console.log(error) };
};

exports.fetchAllocatedBed =async (req, res) => {
    try {
        const data = await 
        BedAllocation.find({ $or: [
                        { cardNumber: req.query.searchParam},
                        { phoneNumber: req.query.searchParam }]});
        if(data.length) {
            res.json({ success: 'true', data });
        }
        res.json({ success: 'false', 'msg': 'invalid Card Number' });
        
        } catch { error => console.log(error) }
};

exports.updateBed = async (req, res) =>  {
    try {
// will work on this
        req.body.updatedBy = req.user.name;
        req.body.updatedById = req.user._id;
        const updatedBed = await BedAllocation.findByIdAndUpdate(req.body.id, req.body, 
            { useFindAndmodify: false, new: true });
        res.json({ success: true, updatedBed });

    } catch { error => res.json({ success: false, msg: error.msg }) }

}

exports.deActivateBed = async (req, res) =>  {
    try {
        req.body.deActivatedBy = req.user.name;
        req.body.deActivatedById = req.user._id;
        const wardNumber = req.body.wardNumber;
        const roomNumber = req.body.roomNumber;
        const bedNumber = req.body.bedNumber;

        await BedAllocation.findByIdAndUpdate(req.query.id, {
            status: 'deactivated'
        }, { useFindAndmodify: false });

    // get room and bed index so as to enable updating of the room & bed array
        const room = await 
        Ward
        .aggregate([
            { $match: { 'number': wardNumber } },
            { $project: { 
                roomIndex: { $indexOfArray: ['$rooms.number', roomNumber] },
                rooms: '$rooms' }},
            { $project: { 
                room: { $arrayElemAt: ['$rooms', '$roomIndex']},
                roomIndex: '$roomIndex' }},
            { $project: { 
                bedIndex: { $indexOfArray: [ '$room.bedSpace.number', bedNumber]},
                roomIndex: '$roomIndex' }
            } 
            ]);
            
        const roomIndex = room[0].roomIndex;
        const bedIndex = room[0].bedIndex;
        const updateBedStatus = `rooms.${roomIndex}.bedSpace.${bedIndex}.status`;
        const updateRoomStatus = `rooms.${roomIndex}.status`;

        await Ward.updateOne({ number: wardNumber },
                             {
                                 status: 'not occupied',
                                 [updateRoomStatus]: 'not occupied',
                                 [updateBedStatus]: 'not occupied'
                             });

        res.json({ success: true });

    } catch { error => res.json({ success: false, msg: error.msg }) }

}
// end of controllers for allocated beds list

// start of controllers for patient site
exports.showPatients = async (req, res) => {

    try{
        const fromReceptionist = await 
        Appointment
        .find({ to: 'nurse', status: 'pending' }).countDocuments();
    
        const fromDoctor = await 
        DoctorNotification
        .find({ to: 'nurse', status: 'pending' }).countDocuments();
    
        const fromPharmacy = await 
        PharmacyNotification
        .find({ to: 'nurse', status: 'pending' }).countDocuments();
    
        const fromLab = await 
        LabNotification
        .find({ to: 'nurse', status: 'pending' }).countDocuments();

        const patients = await
        Patient
        .find({});
    
        res.render('nurse/patient', {             
            fromReceptionist, 
            fromDoctor, 
            fromPharmacy,
            fromLab,
            patients });
        } catch { error => console.log(error) };
    
};

exports.fetchPatient = async (req, res) => {
    
    try {
    const patient = await
    Patient
    .find({
        $or: [{ patientId: req.params.searchParam }, { phoneNumber: req.params.searchParam }] 
          });
        res.send(patient);
    } catch { error => console.log(error)}
};
// end of controllers for patient

exports.fetchNotificationDetail = async (req, res) =>{
    try {
    // const notification = await 
    //DoctorNotification
    //.find( { cardId: req.query.cardId } ).sort( { timeStamps: -1 } ).limit(1);
    // res.render('/nurse/notification-detail', { notification });
    res.render('rec', {message: "ampicilin", inPatient: false});
    } catch { error=> console.log(error); }
};

// will be removed and added to super admin site
exports.addWard = async (req, res) => {
    try {
        const wards = await Ward.create(req.body.wards);
        res.json({ success: true, wards });
    } catch { (error) => res.json({ success: false, msg: error.msg })}
}