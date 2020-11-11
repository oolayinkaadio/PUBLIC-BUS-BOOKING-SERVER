// Mock Data for Creating User Account:::
const correctUser = {
    first_name: 'Kolawole',
    last_name: 'Doe',
    email: 'James@gmail.com',
    password: 'pass',
    passwordConfirm: 'pass',
};
const userData = {
    first_name: "Dolapo",
    last_name: "olaosebikan",
    email: "Dolapo@gmail.com",
    password: "pass",
    passwordConfirm: "pass"
}

const emptyBody = {

};

const unmatchedPassword = {
    first_name: 'Dapo',
    last_name: 'Dayo',
    email: 'dayo@gmail.com',
    password: 'pass',
    passwordConfirm: 'passed',
};

const existingEmail = {
    first_name: "Laide",
    last_name: "dad",
    email: "Yinka@gmail.com",
    password: "pass",
    passwordConfirm: "pass"
}

const invalidEmail = {
    first_name: 'Unico',
    last_name: 'Developer',
    email: 'UniProsper',
    password: 'pass',
    passwordConfirm: 'pass',
};

const oneEmptyField = {
    first_name: 'Subomi',
    last_name: '',
    email: 'subomi@gmail.com',
    password: 'pass',
    passwordConfirm: 'pass',
};


// Mock Data for different Login cases:::
const correctLoginAdmin = {
    email: 'Yinka@gmail.com',
    password: 'pass'
};
const correctLoginUser = {
    email: 'Shola@gmail.com',
    password: 'pass'
};

const undefinedEmailLogin = {
    password: 'pass',
};

const undefinedPasswordLogin = {
    email: 'Yinka@gmail.com',
};

const wrongEmailFormat = {
    email: 'Yinkagmail.com',
    password: 'pass'
};

const wrongEmailLogin = {
    email: 'wrong@gmail.com',
    password: 'pass',
};

const WrongPasswordLogin = {
    email: 'Yinka@gmail.com',
    password: 'wrong',
};

const deletedUser = {
    email: 'Tola@gmail.com',
    password: 'pass'
}

const updateUserToAdmin = { "user_id": "842b964a-d10f-4135-9d32-a1bbaadabf96" };
const updateAdminToUser = { "user_id": "842b964a-d10f-4135-9d32-a1bbaadabf96" };

module.exports = {
    userData,
    correctUser,
    emptyBody,
    unmatchedPassword,
    existingEmail,
    invalidEmail,
    oneEmptyField,
    correctLoginUser,
    correctLoginAdmin,
    undefinedPasswordLogin,
    undefinedEmailLogin,
    wrongEmailFormat,
    wrongEmailLogin,
    WrongPasswordLogin,
    deletedUser,
    updateUserToAdmin,
    updateAdminToUser
}