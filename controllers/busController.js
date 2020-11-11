const pool = require('../dbConnect/index').pool;
const {
    createBusQuery,
    allBusQuery,
    existingBusQuery,
    busWithTripOriginDestination,
    scheduledBusQuery,
    unScheduledBusQuery,
    checkBusQuery,
    busScheduledForTripsQuery,
    deleteBusQuery
} = require('../queries/busQuery');
exports.createBus = async(req, res) => {
    try {
        const { number_plate, manufacturer, model, year, capacity } = req.data;
        const bus = await pool.query(createBusQuery, [number_plate, manufacturer, model, year, capacity]);
        res.status(201).json({
            status: 'success',
            message: 'Bus successfully created',
            data: (bus.rows[0])
        });

    } catch (error) {
        res.status(400).json({
            status: 'error',
            error: 'Something went wrong',
            details: error.stack
        })
    }

}

exports.getAllBus = async(req, res) => {
    try {
        const allBus = await pool.query(allBusQuery);
        res.status(200).json({
            status: 'success',
            data: allBus.rows
        });

    } catch (error) {
        res.status(400).json({
            status: 'error',
            error: 'Something went wrong',
            details: error.stack
        });
    };

};


exports.getBusWithNumberPlate = async(req, res) => {
    try {
        const number_plate = req.params.number_plate
        const existingBus = await pool.query(existingBusQuery, [number_plate]);
        if (existingBus.rowCount <= 0) {
            // If no bus was found with the number_plate::
            res.status(404).json({
                status: 'error',
                error: 'No bus with such number_plate, Please try another number_plate.'
            })
        } else {
            res.status(200).json({
                status: 'success',
                data: existingBus.rows[0]
            })
        };
    } catch (error) {
        res.status(400).json({
            status: 'error',
            error: 'Something went wrong',
            details: error.stack
        })
    }
}

exports.getBuswithTripOriginDestination = async(req, res) => {
    try {
        // Getting the bus assigned to the origin / destination specified in the request params::
        const { originDestination } = req.params;

        const busOriginDestination = await pool.query(busWithTripOriginDestination, [originDestination]);
        if (busOriginDestination.rowCount <= 0) {
            res.status(400).json({
                status: 'error',
                error: 'No bus assigned to that origin or destination, Please try another origin or destination.'
            })
        } else {
            res.status(200).json({
                status: 'success',
                message: 'These are the buses assigned to the trip origin or destination you provided',
                data: busOriginDestination.rows
            })
        };

    } catch (error) {
        res.status(400).json({
            status: 'error',
            error: 'Something went wrong',
            details: error.stack
        })
    }
}

exports.getScheduledBuses = async(req, res) => {
    try {
        const scheduledBuses = await pool.query(scheduledBusQuery);
        if (scheduledBuses.rowCount <= 0) {
            res.status(400).json({
                status: 'error',
                error: 'Buses are yet to be scheduled for trips'
            })
        } else {
            res.status(200).json({
                status: 'success',
                message: 'These are the buses already scheduled for a trip',
                No_of_scheduled_buses: scheduledBuses.rows.length,
                data: scheduledBuses.rows
            })
        };

    } catch (error) {
        res.status(400).json({
            status: 'error',
            error: 'Something went wrong',
            details: error.stack
        })
    }
}


//I want the endpoint below to return all buses not yet scheduled for a trip(I don't know how to write the SQL query)
exports.getUnscheduledBuses = async(req, res) => {
    try {
        const unscheduledBuses = await pool.query(unScheduledBusQuery);
        if (unscheduledBuses.rowCount <= 0) {
            res.status(400).json({
                status: 'error',
                error: 'All buses are scheduled for trips'
            })
        } else {
            res.status(200).json({
                status: 'success',
                message: 'These are the buses already scheduled for a trip',
                No_of_scheduled_buses: unscheduledBuses.rows.length,
                data: unscheduledBuses.rows
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

exports.deleteBus = async(req, res) => {
    try {
        const {
            numberPlate
        } = req.params;

        const checkBus = await pool.query(checkBusQuery, [`${numberPlate}`]);

        if (!checkBus.rows[0]) {
            res.status(404).json({
                status: 'error',
                error: 'No bus with the specified number_plate'
            })
        } else {
            const busId = checkBus.rows[0].bus_id
            const scheduledBus = await pool.query(busScheduledForTripsQuery, [numberPlate]);
            if (scheduledBus.rowCount >= 1) {
                res.status(400).json({
                    status: 'error',
                    error: 'The bus with the provided number plate has already been scheduled for a trip'
                });

            } else {
                const deleteBus = await pool.query(deleteBusQuery, [busId]);
                if (deleteBus.rowCount <= 0) {
                    res.status(400).json({
                        status: 'error',
                        error: 'Something went wrong'
                    })
                } else {
                    res.status(200).json({
                        status: 'error',
                        data: {
                            message: 'Bus deleted successfully'
                        }
                    })
                };

            };
        }

    } catch (error) {
        res.status(400).json({
            status: 'error',
            error: 'Something went wrong',
            details: error.stack
        })
    }
}