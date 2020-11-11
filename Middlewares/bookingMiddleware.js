const pool = require('../dbConnect/index').pool;
const Joi = require('@hapi/Joi').extend(require('@hapi/joi-date'));
const {
    seatAvailabilityQuery,
    seatDetailsQuery,
    busDetailsQuery
} = require('../queries/bookingQuery');


// Validating bookkingData::::
exports.bookDataValidation = (data) => {
    const schema = Joi.object({
        trip_id: Joi.string().guid().required().error((errors) => new Error('Please provide the trip_id in order for the trip to be booked successfully')),
        seat_number: Joi.number().required().error((errors) => new Error('Please provide a seat number'))

    });
    return error = schema.validate(data)
};
// Validating changeSeatData::::
const changeSeatDataValidation = (data) => {
    const schema = Joi.object({
        booking_id: Joi.string().guid({ version: ['uuidv4', 'uuidv5'] }).required().error((errors) => new Error('Please provide a valid booking_id.')),
        newSeat: Joi.number().required().error((errors) => new Error('Please provide a valid number for your new seat number.'))

    });
    return error = schema.validate(data)
};


// Change seat Middleware::
exports.changeSeatMiddleware = async(req, res, next) => {
    try {
        // Getting the booking_id & new seat_number from the request params::
        const booking_id = req.params.booking_id;
        const newSeat = req.params.seat_number;

        // Getting the user_id from the isLoggedIn middleware::
        const {
            user_id
        } = req.user;
        const data = { booking_id, newSeat }
        const { error } = await changeSeatDataValidation(data)
        if (error) {
            const errMsg = error.toString().split('. ')[0].replace('Error: ', '');
            res.status(400).json({
                status: 'error',
                error: errMsg
            })
        } else {
            const seatDetails = await pool.query(seatDetailsQuery, [booking_id, user_id]);
            if (seatDetails.rowCount <= 0) {
                res.status(400).json({
                    status: 'error',
                    error: 'This booking is not valid or unavailable, Please make a new booking.'
                });
            } else {
                const tripId = seatDetails.rows[0].trip_id;
                const oldSeat = seatDetails.rows[0].seat_number;
                const busId = seatDetails.rows[0].bus_id;

                // Getting bus capacity::
                const bus = await pool.query(busDetailsQuery, [busId]);
                const busCapacity = bus.rows[0].capacity;

                // check if new seat is available::
                // use seatAvailabilityQuery
                const seatAvailability = await pool.query(seatAvailabilityQuery, [tripId, newSeat]);

                if (newSeat > busCapacity) { //checking if newSeat does not exceed the bus capacity
                    res.status(400).json({
                        status: 'error',
                        error: `Maximum number of seat exceeded, Please try another value less than or equal to: ${busCapacity}`
                    });
                } else if (newSeat <= 0) {
                    res.status(400).json({
                        status: 'error',
                        error: 'Seat number unavailable, Please try another seat number'
                    });
                } else if (newSeat == oldSeat) { // Checking if user already booked the seat before::
                    res.status(400).json({
                        status: 'error',
                        error: 'You already booked this seat, Please try another seat number'
                    });
                } else if (seatAvailability.rows[0].case === '1') { // Checking if seat_number is available (i.e not yet booked by another user)::
                    res.status(400).json({
                        status: 'error',
                        error: 'Seat number unavailable, Please try another seat number'
                    });
                } else {
                    // sending the tripId and seat_number into the next middleware::
                    req.data = {
                        tripId,
                        newSeat
                    };
                    // calling the next middleware::
                    next();
                }
            }


        };

    } catch (error) {
        // console.log(error.stack)
        res.status(400).json({
            status: 'error',
            error: 'Something went wrong',
            details: error.stack
        })
    }
}