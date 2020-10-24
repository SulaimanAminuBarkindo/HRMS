const express = require('express');
const app = express();
const http = require('http').createServer(app);
const mongoose = require('mongoose');
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const passport = require('passport');
const expressSession = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(expressSession);
const redisClient = redis.createClient();
const User = require('./models/auth');
const Appointment = require('./models/appointments');
const credentials = require('./lib/credentials');
const authRouter = require('./routes/auth');
const receptionistRouter = require('./routes/receptionist');
const doctorRouter = require('./routes/doctor');
const nurseRouter = require('./routes/nurse');
const labRouter = require('./routes/lab');
const stateRouter = require('./routes/state');
const sessionMiddleware = expressSession({ 
    secret: [credentials.secret], 
    store: new redisStore({ host: 'localhost', port: 6379, client: redisClient }),
    saveUninitialized: false,
    resave: true
    
});

// //connect to db
mongoose.connect('mongodb://localhost/hrms', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true});
mongoose.Promise = global.Promise;

// //test DB connection
mongoose.connection.once('open', function(){
    console.log('mongodb started');

     //connect the server if DB is UP
        http.listen(process.env.PORT || 3000, function(){
        console.log('server started at port 3000');
    });

}).on('error', function(error){
    console.log('error occured:', error);
});



app.set('view engine', 'ejs');

// set middlewares for static files and parsing data from forms or API
app.use(express.static('public'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next)
});

// passport setup
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// specifying middlewres for routes
app.use('/auth', authRouter);
app.use('/receptionist', receptionistRouter);
app.use('/doctor', doctorRouter);
app.use('/nurse', nurseRouter);
app.use('/lab', labRouter);
app.use('/state', stateRouter);

// socket configurations and events
let clients = {};

io.on('connection', (socket) => {
    clients[socket.request.session.user._id] = socket.id;

    socket.on('new-appointment', (data) => {
        // check if the doctor is loggedIn
        if(clients[data.to]) {
            io.to(clients[data.to]).emit('new-appointment', 'hello');
        }else{
            console.log('doctor is not online');
        }
        
    });

    socket.on('appointment-approved', async data => {
        //change the status of the appointment in DB to approved 
        const id = data.split('&')[0];
        await Appointment
        .findByIdAndUpdate( id, { status2: 'approved' }, { new: true, useFindAndModify: false } );

        // notify receptionist of the approval
        socket.broadcast.emit('appointment-approved', id);
    });

    socket.on('lab-request', async data => {
        console.log('lab request made');
        socket.broadcast.emit('lab-request', data);
    });

    socket.on('lab-result', async data => {
        if(clients[data.treatmentHistory.createdById]) {
            io.to(clients[data.treatmentHistory.createdById]).emit('lab-result', data);
        }else{
            console.log('doctor is not online', clients);
        }
    });

    socket.on('disconnect', () => {
        delete clients[socket.request.session.user._id];
    });

});


