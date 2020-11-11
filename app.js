const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

dotenv.config({
    path: './config.env'
});

const app = express();
// Development Logging:
app.use(morgan('dev'));

const userRoutes = require('./routes/userRoutes.js')
const tripRoutes = require('./routes/tripRoutes.js')
const bookingRoutes = require('./routes/bookingRoutes.js')
const busRoutes = require('./routes/busRoutes.js')
const authRoutes = require('./routes/authRoutes.js')



// Limit requests from a specific IP:
// Creating a rate-limit with the "express-rate-limit"package that protects our App from crashing due to Attack such as "Brute Force Attack"
const limiter = rateLimit({
    //setting d Maximum number of request to be allowed in an hour to 100
    max: 100, //no of request
    windowMs: 60 * 60 * 1000, //The time(i.e 1hr)
    message: 'Too many request from this IP, Please try again in an hour', //Error msg to be received by the client once the no of request is exceeded within the 1hr time frame
});
// Applying the limiter() above to all the routes that includes '/api' in there URL
app.use('/', limiter);

// Body parser(i.e reading data from the body into "req.body")::
// *************oseun somefun said bodyParser& express.json() are the same**********
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
// The "express.json()" is a method inbuilt in express used to recognize the incoming Request Object as a JSON
app.use(
    express.json({
        limit: '10kb', //Limiting the size of the data to be sent in the body to 10kb
    })
);

// Parsing data from the cookie
app.use(cookieParser());

// Data sanitization against XSS attacks:
app.use(xss());



app.all('*', (err, req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on this Server!`, 404));

});

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/trips', tripRoutes)
app.use('/api/v1/bookings', bookingRoutes)
app.use('/api/v1/bus', busRoutes)
app.use('/api/v1/auth', authRoutes)

//(4) START UP SERVER
const port = 4000;
const server = app.listen(port, () => {
    console.log(`
        App listening on port ${port}!`);
});

process.on('unhandledRejection', (err) => {
    //dz is done to handle all promises error dt were not catched in any area of the codes
    console.log('UNHANDLED REJECTION.......Shutting down');
    console.log({ err });
    // console.log(err.stack);

    server.close(() => {
        process.exit(1);
    });
});


module.exports = app;