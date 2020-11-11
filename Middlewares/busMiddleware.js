const pool = require('../dbConnect/index').pool;
const Joi = require('@hapi/Joi');
const { existingBusQuery } = require('../queries/busQuery');

// My tryCaatch block of code::
// try {} catch (error) {
//     res.status(400).json({
//         status: 'error',
//         error: 'Something went wrong',
//         details: error.stack
//     })
// }


// CREATING A BUS::::
// 1) Use joi to validate the data's required for creating the bus::


const busDataValidation = (data) => {
    const schema = Joi.object({
        number_plate: Joi.string().required().error((errors) => new Error('Bus number_plate must be provided!')),
        manufacturer: Joi.string().required().error((errors) => new Error('Bus manufacturer must be provided!')),
        model: Joi.string().required().error((errors) => new Error('Bus model must be provided!')),
        year: Joi.number().required().error((errors) => new Error('Bus manufacture year must be provided!')),
        capacity: Joi.number().required().error((errors) => new Error('Bus seat capacity must be provided!'))
    });

    return error = schema.validate(data)
};

// 2) create a middleware that will handle data validation and check if number_plate is yet to be assigned to another bus::
exports.createBusMiddleware = async(req, res, next) => {
    try {
        const {
            number_plate
        } = req.body;

        const data = req.body;
        // busDataValidation::
        const {
            error
        } = busDataValidation(data);
        if (error) {
            const errMsg = error.toString().split('at ')[0].replace('Error: ', '');

            res.status(400).json({
                status: 'error',
                error: errMsg
            })
        } else {
            // Check if no existing bus with the same number_plate::
            const busNumberCheck = await pool.query(existingBusQuery, [number_plate]);
            if (busNumberCheck.rowCount >= 1) {
                res.status(400).json({
                    status: 'error',
                    error: `There's already a bus with the same number_plate, Please try another number_plate.`
                })
            } else {
                req.data = data
                next();
            }
        }

    } catch (error) {

        res.status(400).json({
            status: 'error',
            error: 'Something went wrong',
            details: error.stack
        })
    }
}