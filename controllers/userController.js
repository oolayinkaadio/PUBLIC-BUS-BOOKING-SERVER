const pool = require('../dbConnect/index').pool;
const {
    allUser,
    allActiveUsers,
    allInActiveUsers
} = require('../queries/userQuery')

// My tryCaatch block of code::
// try {} catch (error) {
//     res.status(400).json({
//         status: 'error',
//         error: 'Something went wrong',
//         details: error.stack
//     })
// }
exports.getAllUser = async(req, res, next) => {
    try {
        // Admin only, Getting all users stored in database::
        const users = await pool.query(allUser);
        res.status(200).json({
            status: 'success',
            No_of_users: users.rows.length,
            data: (users.rows)
        });

    } catch (error) {
        res.status(400).json({
            status: 'error',
            error: 'Something went wrong',
            details: error.stack
        })
    }

};

exports.getAllActiveUsers = async(req, res) => {
    try {
        // Admin only, Getting all users stored in database::
        const activeUsers = await pool.query(allActiveUsers);
        if (activeUsers.rows.length <= 0) {
            res.status(404).json({
                status: 'error',
                error: 'No active users found'
            });
        } else {
            res.status(200).json({
                status: 'success',
                No_of_active_users: activeUsers.rows.length,
                data: (activeUsers.rows)
            });
        };

    } catch (error) {
        res.status(400).json({
            status: 'error',
            error: 'Something went wrong',
            details: error.stack
        })
    }
};
exports.getAllInActiveUsers = async(req, res) => {
    try {
        // Admin only, Getting all inactive users stored in the database::
        const inActiveUsers = await pool.query(allInActiveUsers);
        if (inActiveUsers.rows.length <= 0) {
            res.status(404).json({
                status: 'error',
                error: 'No inactive users found'
            });
        } else {
            res.status(200).json({
                status: 'success',
                No_of_active_users: activeUsers.rows.length,
                data: (inActiveUsers.rows)
            });
        };
    } catch (error) {
        res.status(400).json({
            status: 'error',
            error: 'Something went wrong',
            details: error.stack
        })
    }
}

exports.getUsersWithActiveTripBookings = async(req, res) => {
    // Getting all users with active trip bookings::
    try {

        const usersWithActiveBookings = await pool.query(`SELECT user_id FROM booking WHERE status = 'active'`);
        async function getFields(input, field) {
            var output = [];
            let b;
            for (var i = 0; i < input.length; i++) {
                b = await pool.query(`SELECT * FROM users WHERE user_id = ($1)`, [`${input[i][field]}`]);
                output.push(b.rows[0]);
            }
            return output;
        }

        var userData = await getFields(usersWithActiveBookings.rows, "user_id")

        res.status(200).json({
            status: 'success',
            data: userData
        })


    } catch (error) {
        res.status(400).json({
            status: 'error',
            error: 'Something went wrong',
            details: error.stack
        })
    }
};

exports.getUser = (req, res) => {
    //    Getting the user data from the isLoggedIn middleware which runs b4 dz middlewware ::
    try {
        const user = req.user;
        //  Sending the user data as a response::
        res.status(200).json({
            status: 'success',
            data: (user)
        });

    } catch (error) {
        res.status(400).json({
            status: 'error',
            error: 'Something went wrong',
            details: error.stack
        })
    }

}