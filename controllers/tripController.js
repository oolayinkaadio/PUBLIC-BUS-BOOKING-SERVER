const pool = require('../dbConnect/index').pool;
const {
    createTripQuery,
    allTripQuery,
    allActiveTripQuery,
    allInactiveTripQuery,
    originDestinationQuery,
    getTripBusstopQuery,
    tripCheckQuery,
    activateTripBookingsQuery,
    activateTripQuery,
    deactivateTripBookingsQuery,
    cancelTripQuery
} = require('../queries/tripQuery');
// My tryCaatch block of code::
// try {} catch (error) {
//     res.status(400).json({
//         status: 'error',
//         error: 'Something went wrong',
//         details: error.stack
//     })
// }

exports.createTrip = async(req, res) => {
    try {
        let {
            origin,
            destination,
            bus_stops,
            trip_date,
            fare,
            bus_id
        } = req.body;
        const trip = await pool.query(createTripQuery, [origin, destination, bus_stops, trip_date, fare, bus_id]);
        res.status(201).json({
            status: "success",
            message: 'Trip created',
            data: (trip.rows[0])
        });

    } catch (err) {
        res.status(500).json({
            error: 'error',
            message: err.stack
        });
    }

};

exports.getAllTrip = async(req, res) => {

    // This query will only be accessible to the Admin alone as the Admin is the only person allowed to view all the trips regardless of the status of the trip
    try {
        const allTrip = await pool.query(allTripQuery);
        res.status(200).json({
            status: 'success',
            message: 'These are all the trips created',
            'Total No of Trips': allTrip.rows.length,
            data: allTrip.rows
        })

    } catch (error) {
        res.status(400).json({
            status: 'error',
            error: 'Something went wrong',
            details: error.stack
        })
    };

};

exports.getAllActiveTrip = async(req, res) => {
    // This endpoint is accessible to the user and Admin
    try {
        const activeTrips = await pool.query(allActiveTripQuery);
        res.status(200).json({
            status: 'success',
            message: 'These are all the active trips',
            'Total No of Trips': activeTrips.rows.length,
            data: activeTrips.rows
        });

    } catch (error) {
        res.status(400).json({
            status: 'error',
            error: 'Something went wrong Admin, Please contact your developers',
            err: error.stack
        });
    };

};

exports.getAllInactiveTrip = async(req, res) => {
    // This endpoint is only accessible to the Admin
    try {
        const inactiveTrips = await pool.query(allInactiveTripQuery);
        if (inactiveTrips.rows.length <= 0) {
            res.status(404).json({
                status: 'error',
                error: 'No inactive trips found.'
            })
        } else {
            res.status(200).json({
                status: 'success',
                message: 'These are all the cancelled / inactive trips',
                'Total No of Trips': inactiveTrips.rows.length,
                data: inactiveTrips.rows
            });
        };

    } catch (error) {
        res.status(400).json({
            status: 'error',
            error: 'Something went wrong',
            details: error.stack
        })
    };

};

exports.getTripOriginDestination = async(req, res) => {
    try {
        const { originDestination } = req.params;
        const trip = await pool.query(originDestinationQuery, [originDestination]);
        if (trip.rows.length === 0) {
            res.status(404).json({
                status: 'error',
                error: `There's no trip with such origin or destination, Please try entering another origin or destination`
            })
        } else {
            res.status(200).json({
                status: 'success',
                message: 'These are trips that matches your origin or destination',
                data: (trip.rows)
            })
        };

    } catch (error) {
        res.status(400).json({
            status: 'error',
            error: 'Something went wrong',
            details: error.stack
        });
    };

};


exports.getTripBusstop = async(req, res, next) => {
    try {
        const { busstop } = req.params;
        const busStop = await pool.query(getTripBusstopQuery, [`{${busstop}}`]);
        if (busStop.rows.length === 0) {
            res.status(404).json({
                status: 'error',
                error: `There's no trip with such bus stop, Please try entering another bus stop`
            })
        } else {
            res.status(200).json({
                status: 'success',
                message: 'These are trips whose bus stops matched your specified bus stop',
                data: busStop.rows
            })
        };

    } catch (error) {
        res.status(400).json({
            status: 'error',
            error: 'Something went wrong',
            details: error.stack
        });
    };

}

exports.cancelTrip = async(req, res, next) => {
    try {
        const tripId = (req.params.id);
        // 1) Check if the trip with the specified id exists::
        const tripCheck = await pool.query(tripCheckQuery, [tripId]);

        if (tripCheck.rowCount >= 1) {
            // 2) Deactivating all bookings associated with the tripId::
            await pool.query(deactivateTripBookingsQuery, [tripId]);

            // 3) Cancelling the trip by altering the status column(i.e change the value from 'active to 'inactive') in the trip table::
            await pool.query(cancelTripQuery, [tripId]);
            return res.status(200).json({
                status: 'success',
                data: {
                    message: 'Trip cancelled successfully'
                }
            });
        } else {
            res.status(404).json({
                status: 'error',
                error: 'No trip found with such Id'
            })
        }

    } catch (err) {
        res.status(400).json({
            status: 'Unsuccessful',
            error: 'Unable to cancel the trip',
            detail: (err.stack)
        });
    }
}

exports.activateTrip = async(req, res, next) => {
    // Activating the cancelled trip and also activating all bookings associated with it:::
    try {
        const tripId = (req.params.id);
        // 1) Check if the trip with the specified id exists::
        const tripCheck = await pool.query(tripCheckQuery, [tripId]);

        if (tripCheck.rowCount >= 1) {
            // 2) Activating all bookings associated with the tripId::
            await pool.query(activateTripBookingsQuery, [tripId]);

            // 3) Activating the trip by altering the status column(i.e change the value from 'inactive to 'active') in the trip table::
            const activatedTrip = await pool.query(activateTripQuery, [tripId]);
            return res.status(200).json({
                status: 'success',
                data: 'Trip activated successfully'
            });
        } else {
            res.status(404).json({
                status: 'error',
                error: 'No trip found with such Id'
            })
        };

    } catch (err) {
        res.status(400).json({
            status: 'Unsuccessful',
            error: 'Unable to activate the trip',
            detail: (err.stack)
        });
    };
}