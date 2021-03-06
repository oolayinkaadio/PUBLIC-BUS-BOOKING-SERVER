const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/Joi').extend(require('@hapi/joi-date'));

exports.signUpDataValidation = (data) => {
    const schema = Joi.object({
        // Note: I am sending the default error message generated by Joi module when d validation fails which is why I am not attaching the error() as done for tripDataValidation
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().min(4).required(),
        password: Joi.string().min(4).max(10).required(),
        // Making sure that the passwordConfirm field matches the password field:
        passwordConfirm: Joi.string().min(4).max(10).required().valid(Joi.ref('password'))
    });
    return error = schema.validate(data)

};

exports.signInDataValidation = (data) => {
    const schema = Joi.object({
        // Note: I am sending the default error message generated by Joi module when d validation fails which is why I am not attaching the error() as done for tripDataValidation
        email: Joi.string().email().min(4).required(),
        password: Joi.string().required()
    });
    return error = schema.validate(data)
};


// Hashing password::::
exports.passwordHash = (password) => {
    return bcrypt.hash(password, 12)
}

// Compare password::::
exports.passwordCompare = (password, dbPassword) => {
    return bcrypt.compareSync(password, dbPassword);
}

// Sign Token::::
exports.signToken = (id) => {
    return jwt.sign({
            id,
        },
        process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        }
    );
};

// Create cookie options::::::::
exports.cookieOptions = {
    expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, //dz means d cookie cannot be accessed or modified by the browser, as d browser can only receive, store and send the cookie with all future requests
};
const signToken = (id) => {
    return jwt.sign({
            id,
        },
        process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        }
    );
};

// Confirm email::::
exports.isEmailValid = (email) => {
    const confirm = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return confirm.test(String(email).toLowerCase());
};