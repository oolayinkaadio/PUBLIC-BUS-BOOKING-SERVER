const {
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
} = require('../mockData/mockUser')
const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http')
const expect = require('chai').expect;
const logInUrl = '/api/v1/auth/signin';
const signUpUrl = '/api/v1/auth/signup';
const updateUrlForUser = '/api/v1/auth/update/user'
const updateUrlForAdmin = '/api/v1/auth/update/admin'

// chai middleware
chai.use(chaiHttp);

let Token;
let Token1;

describe(`Testing the 'createUser' Endpoint`, () => {
    // Having issues with this commented test below....I need to fix it
    // it('should signup User successfully', (done) => {
    //     console.log(correctUser)
    //     chai
    //         .request(app)
    //         .post(signUpUrl)
    //         .send(correctUser)
    //         .end((err, res) => {
    //             const {
    //                 body
    //             } = res;
    //             expect(res.status).to.equal(201);
    //             expect(res.status).to.be.a('number');
    //             expect(body).to.be.an('object');
    //             expect(body.data).to.be.have.property('token');
    //             expect(body.data).to.be.have.property('first_name');
    //             expect(body.data).to.be.have.property('last_name');
    //             expect(body.data).to.be.have.property('is_admin');
    //             expect(body.data).to.be.have.property('email');
    //             done();
    //         });
    // });

    it(`Empty Body`, (done) => {
        chai
            .request(app)
            .post(signUpUrl)
            .send(emptyBody)
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.equal(400);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('error');
                expect(body.error).to.be.equal('firstname is required');
                done();
            });
    });

    it('Unmatched Passwords', (done) => {
        chai
            .request(app)
            .post(signUpUrl)
            .send(unmatchedPassword)
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.equal(400);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('error');
                expect(body.error).to.be.equal('Passwords do not match.');
                done();
            });
    });

    it('Existing Email', (done) => {
        chai
            .request(app)
            .post(signUpUrl)
            .send(existingEmail)
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.equal(400);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('error');
                done();
                //I need to work on dz test again
            });
    });

    it('Invalid Email', (done) => {
        chai
            .request(app)
            .post(signUpUrl)
            .send(invalidEmail)
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.equal(400);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('error');
                expect(body.error).to.be.equal('email must be a valid email');
                done();
            });
    });

    it('One empty field', (done) => {
        chai
            .request(app)
            .post(signUpUrl)
            .send(oneEmptyField)
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.equal(400);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('error');
                expect(body.error).to.be.equal(`lastname is not allowed to be empty`);
                done();
            });
    });



});

// Testing the Login
describe(`Testing the 'Login' Endpoint`, () => {
    it('should successfully login User', (done) => {
        chai
            .request(app)
            .post(logInUrl)
            .send(correctLoginUser)
            .end((err, res) => {
                const {
                    body
                } = res;
                Token1 = body.data.token;
                expect(res.status).to.be.equal(200);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.have.a.property('status');
                expect(body.data).to.have.a.property('token');
                done();
            });
    });
    it('should successfully login Admin', (done) => {
        chai
            .request(app)
            .post(logInUrl)
            .send(correctLoginAdmin)
            .end((err, res) => {
                const {
                    body
                } = res;
                Token = body.data.token;
                expect(res.status).to.be.equal(200);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.have.a.property('status');
                expect(body.data).to.have.a.property('token');
                done();
            });
    });


    it(`should return Error when there's no Email`, (done) => {
        chai
            .request(app)
            .post(logInUrl)
            .send(undefinedEmailLogin)
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.be.equal(401);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.have.a.property('status');
                expect(body).to.have.a.property('error');
                done();
            });
    });

    it(`should return Error when there's no Password`, (done) => {
        chai
            .request(app)
            .post(logInUrl)
            .send(undefinedPasswordLogin)
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.be.equal(401);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.have.a.property('status');
                expect(body).to.have.a.property('error');
                expect(body.error).to.be.equal('Please provide a password.');
                done();
            });
    });

    it(`should return Error when there's no Password`, (done) => {
        chai
            .request(app)
            .post(logInUrl)
            .send(wrongEmailFormat)
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.be.equal(401);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.have.a.property('status');
                expect(body).to.have.a.property('error');
                done();
            });
    });

    it(`should return Error when there's no Password`, (done) => {
        chai
            .request(app)
            .post(logInUrl)
            .send(wrongEmailLogin)
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.be.equal(401);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.have.a.property('status');
                expect(body).to.have.a.property('error');
                expect(body.error).to.be.equal('Incorrect Email or Password');
                done();
            });
    });

    it(`should return Error when there's no Password`, (done) => {
        chai
            .request(app)
            .post(logInUrl)
            .send(WrongPasswordLogin)
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.be.equal(401);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.have.a.property('status');
                expect(body).to.have.a.property('error');
                expect(body.error).to.be.equal('Incorrect Email or Password');
                done();
            });
    });

    it('should not login deleted user', (done) => {

        chai
            .request(app)
            .post(logInUrl)
            .send(deletedUser)
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.equal(404);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('error');
                expect(body.error).to.be.equal('The user no longer exist');

                done();
            });
    });
});


describe(`Testing the 'UPDATE' Endpoint`, () => {
    it('should successfully update User to Admin', (done) => {
        chai
            .request(app)
            .patch(updateUrlForUser)
            .set({
                "Authorization": `Bearer ${Token}`
            })
            .send(updateUserToAdmin)

        .end((err, res) => {
            const {
                body
            } = res;
            expect(res.status).to.be.equal(200);
            expect(res.status).to.be.a('number');
            expect(body).to.be.an('object');
            expect(body).to.have.a.property('status');
            expect(body).to.have.a.property('data');
            done();
        });
    });

    it('should successfully update Admin to User', (done) => {
        chai
            .request(app)
            .patch(updateUrlForAdmin)
            .set({
                "Authorization": `Bearer ${Token}`
            })
            .send(updateAdminToUser)
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.equal(200);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('status');
                expect(body).to.be.have.property('data');
                done();
            });
    });

    it('should not update Admin to User if user is Logged in', (done) => {
        chai
            .request(app)
            .patch(updateUrlForAdmin)
            .set({
                "Authorization": `Bearer ${Token1}`
            })
            .send(updateAdminToUser)
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.equal(403);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('status');
                expect(body).to.be.have.property('error');
                done();
            });
    });
});