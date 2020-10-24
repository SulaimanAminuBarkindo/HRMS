const STATE = require('../models/state');

exports.getLocals = async (req, res) => {
    try{
        const state = await STATE.find({ name: req.params.name });
        res.json({ success: true, state });
    } catch { error => res.json({ success: false, msg: error.msg })}  
}

exports.addStates = async (req, res) => {
    try {
        const state = await STATE.create(req.body.states);
        res.json({ success: true, state});
    } catch (error) {
        res.json({ success: false, error });
    }
}