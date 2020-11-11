const pool = require('../dbConnect/index').pool;
const Joi = require('@hapi/Joi').extend(require('@hapi/joi-date'));
const {
    busCheckQuery,
    scheduledTripQuery
} = require('../queries/tripQuery');
const tripDataValidation = (data) => {
    const schema = Joi.object({
        origin: Joi.string().required().error((errors) => new Error('Trip origin must be provided!')),
        destination: Joi.string().required().error((errors) => new Error('Trip destination must be provided!')),
        bus_stops: Joi.array().items(Joi.string(), Joi.string(), Joi.string()).required().error((errors) => new Error('A minimum of three bus stops must be provided!')),
        trip_date: Joi.date().format('YYYY-MM-DD').required().error((errors) => new Error('Please specify the date for this trip!')),
        fare: Joi.number().integer().min(2).required().error((errors) => new Error('Please provide the fare for this trip')),
        bus_id: Joi.number().required().error((errors) => new Error('Please provide the id of bus allocated for this trip')),
    });
    return error = schema.validate(data);
};

exports.tripMiddleware = async(req, res, next) => {
    try {
        // emptyBodyValidation::
        if (!req.body) {
            res.status(400).json({
                status: 'error',
                error: 'Please fill all the required fields.'
            })
        } else {
            const data = req.body;
            // tripDataValidation::
            const {
                error
            } = await tripDataValidation(data);
            if (error) {
                const errMsg = error.toString().split('at ')[0].replace('Error: ', '');
                res.status(400).json({
                    status: 'error',
                    error: errMsg
                })
            } else {
                let bus_id = req.body.bus_id;
                // checking if the bus exists in the database::
                const busCheck = await pool.query(busCheckQuery, [bus_id]);

                const scheduledTrip = await pool.query(scheduledTripQuery, [bus_id]);

                if (busCheck.rows.length <= 0) {
                    res.status(400).json({
                        status: 'error',
                        error: 'No such bus available in the bus database,Please check the list of available bus that has not yet been scheduled for a trip.'
                    })
                } else if (scheduledTrip.rows.length >= 1) {
                    res.status(400).json({
                        status: 'error',
                        error: 'Bus id has already been scheduled for another trip,Please check the list of available bus that has not yet been scheduled for a trip.'
                    })
                } else {
                    return next();
                }
            }
        }

    } catch (err) {
        res.status(500).json({
            error: 'error',
            message: err.stack
        });
    }
};