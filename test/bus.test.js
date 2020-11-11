const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http')
const expect = require('chai').expect;

// chai middleware
chai.use(chaiHttp);

// URL's::
const signInUrl = '/api/v1/auth/signin';

// Data's:::
const {
    correctLoginAdmin,
    correctLoginUser,
    correctBusDetails,
    emptyBusDetails,
    oneEmtpyBusField,
    existingBusNumberPlate,
    createBusUrl,
    allBus,
    correctBusNumberPlate,
    incorrectBusNumberPlate,
    correctBusOriginDestination,
    incorrectBusOriginDestination,
    getScheduledBuses,
    getUnscheduledBuses,
    deleteUnscheduledBus,
    deleteScheduledBus
} = require('../mockData/mockBus')

let Token;
let Token1;

describe('Logging User and Admin', () => {
    it('successfully Logged in Admin', (done) => {
        chai
            .request(app)
            .post(signInUrl)
            .send(correctLoginAdmin)
            .end((err, res) => {
                const {
                    body
                } = res;
                Token = body.data.token;
                done();
            });
    });

    it('successfully Logged in User', (done) => {
        chai
            .request(app)
            .post(signInUrl)
            .send(correctLoginUser)
            .end((err, res) => {
                const {
                    body
                } = res;
                Token1 = body.data.token;
                done();
            });
    });

})


describe('Testing the create bus requests', () => {

    it('should create a bus successfully if Admin Logged in', (done) => {
        chai
            .request(app)
            .post(createBusUrl)
            .set({
                "Authorization": `Bearer ${Token}`
            })
            .send(correctBusDetails)
            .end((err, res) => {
                const {
                    body
                } = res;
                console.log(body);
                expect(res.status).to.equal(201);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('status');
                expect(body).to.be.have.property('data');
                done()
            });
    });

    it('should not create a bus if bus data is incomplete', (done) => {
        chai
            .request(app)
            .post(createBusUrl)
            .set({
                "Authorization": `Bearer ${Token}`
            })
            .send(emptyBusDetails)
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.equal(400);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('status');
                expect(body).to.be.have.property('error');
                done()
            });
    });
    it('should not create a bus if one of bus data is missing', (done) => {
        chai
            .request(app)
            .post(createBusUrl)
            .set({
                "Authorization": `Bearer ${Token}`
            })
            .send(oneEmtpyBusField)
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.equal(400);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('status');
                expect(body).to.be.have.property('error');
                done()
            });
    });
    it('should not create a bus if bus number_plate is part of an existing bus data', (done) => {
        chai
            .request(app)
            .post(createBusUrl)
            .set({
                "Authorization": `Bearer ${Token}`
            })
            .send(existingBusNumberPlate)
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.equal(400);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('status');
                expect(body).to.be.have.property('error');
                done()
            });
    });
    it('should not create a bus if a User is Logged in', (done) => {
        chai
            .request(app)
            .post(createBusUrl)
            .set({
                "Authorization": `Bearer ${Token1}`
            })
            .send(correctBusDetails)
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.equal(403);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('status');
                expect(body).to.be.have.property('error');
                done()
            });
    });
})


describe('Testing the get bus requests', () => {
    // getAllBookingUrl accessible to Admin alone
    it('should get all bus if Admin Logged in', (done) => {
        chai
            .request(app)
            .get(allBus)
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
                done()
            });
    });

    it('should not get all bus if a User is Logged in', (done) => {
        chai
            .request(app)
            .get(allBus)
            .set({
                "Authorization": `Bearer ${Token1}`
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
                done()
            });
    });
    it(`should get a bus with it's number_plate if Admin is Logged in and it's number_plate is correct`, (done) => {
        chai
            .request(app)
            .get(correctBusNumberPlate)
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
                done()
            });
    });
    it(`should not get a bus with it's number_plate if Admin is Logged in and it's number_plate is incorrect`, (done) => {
        chai
            .request(app)
            .get(incorrectBusNumberPlate)
            .set({
                "Authorization": `Bearer ${Token}`
            })
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.equal(404);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('status');
                expect(body).to.be.have.property('error');
                done()
            });
    });
    it(`should not get a bus with it's number_plate if a User is Logged in`, (done) => {
        chai
            .request(app)
            .get(correctBusNumberPlate)
            .set({
                "Authorization": `Bearer ${Token1}`
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
                done()
            });
    });
    it(`should get a bus with it's origin or destination if Admin is Logged in and it's origin or destination is correct`, (done) => {
        chai
            .request(app)
            .get(correctBusOriginDestination)
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
                done()
            });
    });
    it(`should not get a bus with it's origin or destination if Admin is Logged in and it's origin or destination is incorrect`, (done) => {
        chai
            .request(app)
            .get(incorrectBusOriginDestination)
            .set({
                "Authorization": `Bearer ${Token}`
            })
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.equal(400);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('status');
                expect(body).to.be.have.property('error');
                done()
            });
    });
    it(`should not get a bus with it's origin or destination if a User is Logged in`, (done) => {
        chai
            .request(app)
            .get(correctBusOriginDestination)
            .set({
                "Authorization": `Bearer ${Token1}`
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
                done()
            });
    });


    it(`should get a scheduled bus if Admin Logged in`, (done) => {
        chai
            .request(app)
            .get(getScheduledBuses)
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
                done()
            });
    });

    it(`should not get a scheduled bus if a is User Logged in`, (done) => {
        chai
            .request(app)
            .get(getScheduledBuses)
            .set({
                "Authorization": `Bearer ${Token1}`
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
                done()
            });
    });

    it(`should get an unscheduled bus if Admin is Logged in`, (done) => {
        chai
            .request(app)
            .get(getUnscheduledBuses)
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
                done()
            });
    });

    it(`should not get an unscheduled bus if a User is Logged in`, (done) => {
        chai
            .request(app)
            .get(getUnscheduledBuses)
            .set({
                "Authorization": `Bearer ${Token1}`
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
                done()
            });
    });

});

describe('Testing the delete bus requests', () => {
    // getAllBookingUrl accessible to Admin alone
    it('should delete an unscheduled bus if Admin is Logged in', (done) => {
        chai
            .request(app)
            .delete(deleteUnscheduledBus)
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
                done()
            });
    });
    it('should not delete an unscheduled bus if a User is Logged in', (done) => {
        chai
            .request(app)
            .delete(deleteUnscheduledBus)
            .set({
                "Authorization": `Bearer ${Token1}`
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
                done()
            });
    });

    it('should not delete a scheduled bus if Admin is Logged in', (done) => {
        chai
            .request(app)
            .delete(deleteScheduledBus)
            .set({
                "Authorization": `Bearer ${Token}`
            })
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.equal(400);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('status');
                expect(body).to.be.have.property('error');
                done()
            });
    });

    it('should not delete a scheduled bus if a User is Logged in', (done) => {
        chai
            .request(app)
            .delete(deleteScheduledBus)
            .set({
                "Authorization": `Bearer ${Token1}`
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
                done()
            });
    });
})