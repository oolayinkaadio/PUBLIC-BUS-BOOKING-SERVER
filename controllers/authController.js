const pool = require('../dbConnect/index').pool;
const authenticate = require('../Middlewares/authMiddleware');
const jwt = require('jsonwebtoken');
const {
    promisify
} = require('util');

const {
    createUserQuery,
    updateUserAndAdminQuery,
    loginQuery,
    currentUserQuery
} = require('../queries/authQuery');
exports.createUser = async(req, res, next) => {
    let {
        first_name,
        last_name,
        email,
        password,
        passwordConfirm
    } = req.body;
    try {
        const data = req.body;
        const { error } = authenticate.signUpDataValidation(data);

        if (error) {
            //The regular exp used below is to eliminate any special character that might be part of the errMsg thereby ensuring that the data type is string
            const errMsg = error.details[0].message.toString('').replace(/[^a-zA-Z ]/g, "");

            if (errMsg.startsWith('passwordConfirm')) {
                res.status(400).json({
                    status: 'error',
                    error: 'Passwords do not match.'
                });
            } else {
                res.status(400).json({
                    status: 'error',
                    error: errMsg
                })
            }

        } else if (!error) {
            const is_admin = false;
            password = await authenticate.passwordHash(req.body.password);
            const newUser = await pool.query(createUserQuery, [first_name, last_name, email, password, is_admin]);
            // Getting the user's id:
            const {
                user_id
            } = newUser.rows[0];

            // signtoken and assign it to variable token:
            const token = authenticate.signToken(user_id);
            // Creating cookie options:
            const cookieOptions = authenticate.cookieOptions;
            // Sending cookies::
            res.cookie('jwt', token, cookieOptions);
            // Sending response::
            // In order to get d token and save as variable 'jwt' in postman, use dz script in Test window: pm.environment.set("jwt", pm.response.json().data.token);
            res.status(201).json({
                status: 'success',
                message: 'Account successfully created',
                data: {
                    token,
                    user_id,
                    email,
                    first_name,
                    last_name,
                    is_admin
                }
            });
        };

    } catch (err) {
        res.status(400).json({
            // This would catch and send any error/exception dt might not have been caught in d try block above::
            status: 'error',
            error: 'Something went wrong'
        });
    };

};


exports.updateUserToAdminorAdminToUser = async(req, res) => {
    try {
        const { user_id } = req.body;
        const { type } = req.params;
        const confirmUser = await pool.query(currentUserQuery, [user_id])
            // console.log(confirmUser)
        let value;
        if (type === 'admin') {
            value = true;
        } else { value = false };
        console.log(value)
        const update = await pool.query(updateUserAndAdminQuery, [value, user_id]);
        // console.log(update)
        if (!confirmUser.rows[0] && !update.rows[0]) {
            res.status(400).json({
                status: 'Error',
                error: 'Something went wrong, Please contact your I.T support',
                details: (err.stack)
            })
        } else {
            res.status(200).json({
                status: 'success',
                data: 'Account successfully updated.'
            });
        }

    } catch (err) {
        res.status(401).json({
            status: 'Error',
            error: 'You are not authorized to perform this action.',
            details: (err.stack)
        })
    }
}

exports.login = async(req, res, next) => {
    try {
        const data = req.body;
        const { error } = authenticate.signInDataValidation(data);
        if (error) {
            //The regular exp used below is to eliminate any special character that might be part of the errMsg thereby ensuring that the data type is string
            const errMsg = error.details[0].message.toString('').replace(/[^a-zA-Z ]/g, "");
            if (errMsg.startsWith('password')) {
                res.status(401).json({
                    status: 'error',
                    error: 'Please provide a password.'
                });
            } else {
                res.status(401).json({
                    status: 'error',
                    error: errMsg
                })
            }

        } else if (!error) {
            const {
                email,
                password
            } = req.body;
            const query = await pool.query(loginQuery, [email])
                // console.log((!authenticate.passwordCompare(password, query.rows[0].password)));

            if (query.rowCount === 0 || !query) {
                res.status(401).json({
                    status: 'error',
                    error: 'Incorrect Email or Password'
                });

            } else if (!authenticate.passwordCompare(password, query.rows[0].password)) {
                res.status(401).json({
                    status: 'error',
                    error: 'Incorrect Email or Password'
                });

            } else if (query.rows[0].status === null || query.rows[0].status === 'inactive') {
                res.status(404).json({
                    status: 'error',
                    error: 'The user no longer exist'
                });
            } else {
                const {
                    user_id,
                    first_name,
                    last_name,
                } = query.rows[0];

                // signtoken and assign it to variable token
                const token = authenticate.signToken(user_id);
                // Creating cookie options::
                const cookieOptions = authenticate.cookieOptions;
                // Sending cookies::
                res.cookie('jwt', token, cookieOptions);
                // Sending response::
                res.status(200).json({
                    status: 'success',
                    data: {
                        token,
                        user_id,
                        email,
                        first_name,
                        last_name
                    }
                });
            }

        }

    } catch (err) {
        console.log(err)
        res.status(401).json({

            // This would catch and send any error/exception dt might not have been caught in d try block above::
            status: 'error',
            error: 'Something went wrong'
        });

    }
};


// Middleware to be used for admin verification:::::
exports.protect = async(req, res, next) => {

    try {
        // 1) Getting the token sent to the client::
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            res.status(401).json({
                status: 'error from token',
                error: 'You are not logged in'
            });
        } else {
            // 2) Verification of token(i.e checking if the token is valid"not manipulated" && to know if the token has already expired)::
            const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
            // console.log('Today:::', decoded)
            if (!decoded) {
                res.status(401).json({
                    status: 'error from id',
                    error: 'You are not logged in'
                })
            } else {
                // 3) Checking if the user still exit on the Database(i.e if the user has been deleted from the database and a hacker lay his hands on the token or maybe the user changed their password, then the token with which they login with before changing their password should no longer be valid)::
                const currentUser = await pool.query(currentUserQuery, [decoded.id]);
                req.user = currentUser.rows[0]; // postman
                if (!currentUser) {
                    res.status(401).json({
                        status: 'error',
                        error: 'The user belonging to this token no longer exist'
                    });
                } else {
                    const data = currentUser.rows[0].is_admin;
                    if (data === true) {
                        return next();
                    } else {
                        res.status(403).json({
                            status: 'error',
                            error: 'You are not authorized to access this route/endpoint'
                        });
                    };
                }
            }
        }

    } catch (err) {
        console.log(err)
        res.status(400).json({
            status: 'error',
            error: err
        });
    }

};


// Middleware to be used for Logged in user verification::::
exports.isLoggedIn = async(req, res, next) => {
    try {
        // console.log('Hello Yinka')
        // 1) Getting the token sent to the client::
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
            // console.log('isLoggedIn:::', token)
        };
        if (!token) {
            console.log('Fatal error')
            res.status(401).json({
                status: 'error',
                error: 'You are not logged in, Please log in to get access.'
            })
        } else {
            // console.log(':::::::')
            // 2) Verification of token(i.e checking if the token is valid"not manipulated" && to know if the token has not expired)::
            const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
            // console.log('Today:::', decoded)
            if (!decoded) {
                res.status(401).json({
                    status: 'error from id',
                    error: 'You are not logged in'
                })
            } else {
                // 3) Checking if the user still exist on the Database)::
                const currentUser = await pool.query(currentUserQuery, [decoded.id]);
                // console.log(currentUser.rows[0])
                if (currentUser.rows[0].status === 'inactive' || currentUser.rows[0].status === null) {
                    res.status(404).json({
                        status: 'error',
                        error: 'The user no longer exist'
                    });
                } else {
                    // A 'user' variable is being created and passed into the 'req' in order 4 it to be used in the next middleware):::
                    req.user = currentUser.rows[0];
                    // console.log('1', req.user)
                    return next()
                }
            }

        }

    } catch (err) {
        console.log(err)
        res.status(400).json({
            status: 'error',
            error: err
        });
    }

};