//import required modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

//Schema design
const UserSchema = new Schema({
    username: { type: String, required: true, unique: [ true, 'username already exist' ] },
    role: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String },
    image: { type: String, default: '1.jpg' },
    status: { type: String, default: 'offline' }
});

//plugin passport-local-mongoose to enable password hashing and salting and other things
UserSchema.plugin(passportLocalMongoose);

//connect the schema with user table
const User = mongoose.model('user', UserSchema);

//export the model 
module.exports = User;