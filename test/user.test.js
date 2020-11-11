const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http')
const expect = require('chai').expect;

// chai middleware
chai.use(chaiHttp);

// URL's::
const usersUrl = '/api/v1/users/';
const userProfileUrl = '/api/v1/users/me';
const logInUrl = '/api/v1/auth/signin';
const usersWithActiveBookingsUrl = '/api/v1/users/active-booking'
    // Data's:::
const {
    correctLoginUser,
    correctLoginAdmin,
} = require('../mockData/mockUser')

let Token;
let Token2;
let Token3 = 'badToken623bewq842j3kr';
let Token4 = 'badToken623bewq842j3kr';
let Token5;

describe(`Sign in Admin and get users if it's admin and token is correct`, () => {
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
                done();
            });
    });

    it('should successfully login User', (done) => {
        chai
            .request(app)
            .post(logInUrl)
            .send(correctLoginUser)
            .end((err, res) => {
                const {
                    body
                } = res;
                Token2 = body.data.token;
                done();
            });
    });
    it('should get all users', (done) => {
        chai
            .request(app)
            .get(usersUrl)
            .set({ "Authorization": `Bearer ${Token}` })
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


    it('should return 403 if not admin', (done) => {
        chai
            .request(app)
            .get(usersUrl)
            .set({ "Authorization": `Bearer ${Token2}` })
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.equal(403);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('status');
                expect(body).to.be.have.property('error');
                expect(body.error).to.be.equal('You are not authorized to access this route/endpoint');
                done();
            });
    });

    it('should return 401 if no token / not logged in', (done) => {
        chai
            .request(app)
            .get(usersUrl)
            .set({
                "Authorization": `Bearer ''`
            })
            .end((err, res) => {
                const {
                    body
                } = res;
                console.log(body);
                expect(res.status).to.equal(400);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('status');
                expect(body).to.be.have.property('error');
                done();
            });
    });

});

describe('should get profile of all users with active bookings', () => {
    it('should successfully get Users data if Admmin is logged in', (done) => {
        chai
            .request(app)
            .get(usersWithActiveBookingsUrl)
            .set({
                "Authorization": `Bearer ${Token}`
            })
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
    it('should not successfully get Users data if a User is logged in', (done) => {
        chai
            .request(app)
            .get(usersWithActiveBookingsUrl)
            .set({
                "Authorization": `Bearer ${Token2}`
            })
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

})
describe('should get the logged in user profile', () => {
    it('should successfully login User', (done) => {
        chai
            .request(app)
            .post(logInUrl)
            .send(correctLoginUser)
            .end((err, res) => {
                const {
                    body
                } = res;
                Token4 = body.data.token;
                done();
            });
    });
    it('should get users details', (done) => {
        chai
            .request(app)
            .get(userProfileUrl)
            .set({
                "Authorization": `Bearer ${Token4}`
            })
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

})