const pool = require('../dbConnect/index').pool;
const bookMiddleware = require('../Middlewares/bookingMiddleware');
const {
    tripAvailabilityQuery,
    seatAvailabilityQuery,
    createBookingQuery,
    getAllBookingsQuery,
    bookingBasedOnStatusQuery,
    myBookingsQuery,
    userNewSeatQuery,
    confirmBookingAvailabilityQuery,
    cancelBookingQuery
} = require('../queries/bookingQuery')

// My tryCaatch block of code::
// try {} catch (error) {
//     res.status(400).json({
//         status: 'error',
//         error: 'Something went wrong',
//         details: error.stack
//     })
// }

exports.createBookingMiddleware = async(req, res, next) => {
    try {
        // Getting the trip_id && seat_number from the req.body::
        const {
            trip_id,
            seat_number
        } = req.body;
        const data = req.body;
        const { error } = await bookMiddleware.bookDataValidation(data);
        if (error) {
            const errMsg = error.toString().split('number ')[0].replace('Error: ', '');
            res.status(400).json({
                status: 'error',
                error: errMsg
            })
        } else {
            // checking if the trip is still active or the tripId is correct
            const trip = await pool.query(tripAvailabilityQuery, [trip_id])

            if (trip.rows.length <= 0) {
                res.status(404).json({
                    status: 'error',
                    error: 'Trip not available at the moment'
                });
            } else {
                const seatCapacity = trip.rows[0].capacity
                const seatAvailability = await pool.query(seatAvailabilityQuery, [trip_id, seat_number])

                if (seat_number > seatCapacity) {
                    // Checking if seat_number is not greater than the seat capacity of the bus
                    res.status(400).json({
                        status: 'error',
                        error: `Maximum number of seat exceeded, Please try another value less than: ${seat_number}`
                    });

                } else if (seatAvailability.rows[0].case === '1') { // checking if seat_number is available
                    res.status(404).json({
                        status: 'error',
                        error: 'Seat number unavailable, Please try another seat number'
                    });

                } else {
                    // sending the trip into the next middleware::
                    req.trip = trip;
                    // calling the next middleware::
                    next();
                }
            };
        };

    } catch (error) {
        res.status(400).json({
            status: 'error',
            error: 'Something went wrong',
            details: error.stack
        })
    };

};

exports.createBooking = async(req, res) => {
    try {
        const {
            trip_id,
            seat_number
        } = req.body;

        // Getting the trip variable from the createBookingMiddleware middleware::
        const trip = req.trip;

        // Getting the bus_id and trip_id from the trip variable received from the createBookingMiddleware which runs before this middleware::
        const { bus_id, trip_date } = trip.rows[0];

        // Getting the user data from the isLoggedIn middleware::
        const {
            user_id,
            first_name,
            last_name,
            email
        } = req.user;
        // Creating the booking::
        const newBooking = await pool.query(createBookingQuery, [user_id, trip_id, bus_id, trip_date, seat_number, first_name, last_name, email]);

        res.status(201).json({
            status: 'success',
            message: 'Trip booked successfully',
            data: (newBooking.rows[0])
        });

    } catch (error) {
        res.status(400).json({
            status: 'error',
            error: 'Something went wrong',
            details: error.stack
        })
    }


};

exports.getAllBooking = async(req, res) => {
    try {
        const allBookings = await pool.query(getAllBookingsQuery);
        res.status(200).json({
            status: 'Success',
            No_of_bookings: allBookings.rows.length,
            data: (allBookings.rows)
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: 'error',
            error: 'Something went wrong',
            details: error.stack
        })
    }
}

exports.getBookingStatus = async(req, res, next) => {
    // This is only accessible by the admin
    try {
        // the admin would provide either 'active' / 'inactive' into the request params in order to either display active or inactive bookings
        const status = req.params.status
        const booking = await pool.query(bookingBasedOnStatusQuery, [status]);
        if (status === 'active' && booking.rows.length <= 0) {
            res.status(200).json({
                status: 'Success',
                data: 'No active bookings found'
            })
        } else if (status === 'inactive' && booking.rows.length <= 0) {
            res.status(200).json({
                status: 'Success',
                data: 'No inactive bookings found'
            })
        } else {
            res.status(200).json({
                status: 'Success',
                No_of_bookings: booking.rows.length,
                data: (booking.rows)
            })
        };

    } catch (err) {
        res.status(404).json({
            status: 'error',
            message: 'Something went wrong',
            error: err.stack
        })

    };
}

exports.getMyBooking = async(req, res) => {
    try {
        const user = req.user;
        const myBooking = await pool.query(myBookingsQuery, [user.user_id]);
        if (myBooking.rowCount <= 0) {
            res.status(400).json({
                status: 'error',
                error: 'You are yet to book a trip'
            })
        } else {
            res.status(200).json({
                status: 'Success',
                message: 'These are your trip bookings',
                'No of bookings': myBooking.rows.length,
                data: (myBooking.rows)

            })
        };

    } catch (err) {
        res.status(404).json({
            status: 'error',
            message: 'Something went wrong',
            error: err.stack
        })

    };
}



exports.changeSeat = async(req, res) => {
    // The user have to specify the booking_id and new seat_number in order to change their old seat_number::::
    try {
        // Getting the tripId, newSeat and user_id from the isLoggedIn and changeSeatMiddleware in 'bookingMiddleware.js'::
        const { tripId, newSeat } = req.data
        const { user_id } = req.user
        const booking = await pool.query(userNewSeatQuery, [newSeat, tripId, user_id]);
        if (booking.rowCount > 0) {
            res.status(200).json({
                status: 'success',
                message: 'Seat number changed successfully',
                data: (booking.rows[0])
            });
        } else {
            throw err;
        };

    } catch (err) {
        res.status(404).json({
            status: 'error',
            message: 'Something went wrong, Please contact the Admin.'
        })
    };
};

exports.cancelBookings = async(req, res, next) => {
    // This allows the user to cancel a specific booking
    // the user provides the booking id and the status is changed to inactive, thereby any request to get such booking returns booking not found
    try {
        const bookingId = (req.params.id);
        const user = req.user;
        // checking if the user has such booking before::
        const bookingConfirm = await pool.query(confirmBookingAvailabilityQuery, [bookingId, user.user_id])

        if (bookingConfirm.rows.length <= 0) {
            res.status(400).json({
                status: 'error',
                error: 'You are yet to make a booking'
            })

        } else if (bookingConfirm.rows[0].status === 'inactive') {
            res.status(400).json({
                status: 'error',
                error: 'Booking already cancelled'
            })
        } else {
            // Altering the status column(i.e change the value from 'active to 'inactive')
            const bookings = await pool.query(cancelBookingQuery, [bookingId, user.user_id]);

            if (bookings.rowCount <= 0) {
                res.status(400).json({
                    status: 'error',
                    error: 'Something went wrong, Please try again'
                })
            }
            res.status(200).json({
                status: 'Success',
                data: {
                    message: 'Booking cancelled successfully'
                }
            })
        };

    } catch (err) {
        res.status(404).json({
            status: 'error',
            message: 'You are yet to book this trip  '
        })
    };
}