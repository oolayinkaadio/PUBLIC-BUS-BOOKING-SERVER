const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http')
const expect = require('chai').expect;

// chai middleware
chai.use(chaiHttp);

// Data's:::
const {
    correctAdminLogin,
    correctUserLogin,
    correctTripDetails,
    EmptyTripDetails,
    oneEmtpyTripField,
    incorrectBusId,
    scheduledBusId
} = require('../mockData/mockTrip')

let Token;
let Token1;
let Trip_id;
const tripUrl = '/api/v1/trips/';
const allTripUrl = '/api/v1/trips/getall';
const allActiveTripUrl = '/api/v1/trips/active';
const allInactiveTripUrl = '/api/v1/trips/inactive';
const correctOriginDestinationUrl = '/api/v1/trips/Yaba';
const wrongOriginDestinationUrl = '/api/v1/trips/Togo';
const correctbusstopUrl = '/api/v1/trips/bus-stop/Maryland';
const wrongbusstopUrl = '/api/v1/trips/bus-stop/ondo';
const cancelledTripUrl = '/api/v1/trips/cancel/53ccad52-e3ee-4140-ae67-392c37508bdf'
const activateTripUrl = '/api/v1/trips/activate/53ccad52-e3ee-4140-ae67-392c37508bdf'
const signinUrl = '/api/v1/auth/signin';


describe(`Test trip creation by Admin or User`, () => {
    it('should successfully login admin', (done) => {
        chai
            .request(app)
            .post(signinUrl)
            .send(correctAdminLogin)
            .end((err, res) => {
                const {
                    body
                } = res;
                Token = body.data.token;
                done();
            });
    });

    it('should successfully login user', (done) => {
        chai
            .request(app)
            .post(signinUrl)
            .send(correctUserLogin)
            .end((err, res) => {
                const {
                    body
                } = res;
                Token1 = body.data.token;
                done();
            });
    });

    // it('should create a trip successfully', (done) => {
    //     console.log('Here:', Token)
    //     chai
    //         .request(app)
    //         .post(tripUrl)
    //         .set({ "Authorization": `Bearer ${Token}` })
    //         .send(correctTripDetails)
    //         .end((err, res) => {
    //             const {
    //                 body
    //             } = res;
    //             console.log('Creating Trip', body);
    //             Trip_id = body.data.trip_id;
    //             expect(res.status).to.equal(201);
    //             expect(res.status).to.be.a('number');
    //             expect(body).to.be.an('object');
    //             expect(body.data).to.be.have.property('bus_id');
    //             expect(body.data).to.be.have.property('origin');
    //             expect(body.data).to.be.have.property('destination');
    //             expect(body.data).to.be.have.property('trip_date');
    //             expect(body.data).to.be.have.property('status');
    //             done();
    //         });
    // });

    it('should not create a trip successful', (done) => {
        chai
            .request(app)
            .post(tripUrl)
            .set({ "Authorization": `Bearer ${Token}` })
            .send(EmptyTripDetails)
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.equal(400);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('status');
                expect(body).to.be.have.property('error');
                done();
            });
    });

    it('should return 403 if not admin', (done) => {
        chai
            .request(app)
            .post(tripUrl)
            .set({ "Authorization": `Bearer ${Token1}` })
            .send(correctTripDetails)
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

    it('should return 400 error with one emtpy trip field', (done) => {
        chai
            .request(app)
            .post(tripUrl)
            .set({ "Authorization": `Bearer ${Token}` })
            .send(oneEmtpyTripField)
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.equal(400);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('error');
                done();
            });
    });

    it('Should return 400 if bus id is incorrect / does not exist', (done) => {
        chai
            .request(app)
            .post(tripUrl)
            .set({ "Authorization": `Bearer ${Token}` })
            .send(incorrectBusId)
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.equal(400);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('status');
                expect(body).to.be.have.property('error');
                expect(body.error).to.be.equal('No such bus available in the bus database,Please check the list of available bus that has not yet been scheduled for a trip.');
                done();
            });
    });

    it('Should return 400 if bus id has already been scheduled', (done) => {
        chai
            .request(app)
            .post(tripUrl)
            .set({ "Authorization": `Bearer ${Token}` })
            .send(scheduledBusId)
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.equal(400);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('status');
                expect(body).to.be.have.property('error');
                expect(body.error).to.be.equal('Bus id has already been scheduled for another trip,Please check the list of available bus that has not yet been scheduled for a trip.');
                done();
            });
    });

});

describe('Testing the get endpoints', () => {
    it('should get all trips if Admin Login', (done) => {
        chai
            .request(app)
            .get(allTripUrl)
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
    })
    it('should not get all trips if User Login', (done) => {
        chai
            .request(app)
            .get(allTripUrl)
            .set({ "Authorization": `Bearer ${Token1}` })
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
    })

    it('should get all active trips if Admin Login', (done) => {
        chai
            .request(app)
            .get(allActiveTripUrl)
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

    it('should get all active trips if User Login', (done) => {
        chai
            .request(app)
            .get(allActiveTripUrl)
            .set({
                "Authorization": `Bearer ${Token1}`
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

    it('should get all inactive / cancelled trips if Admin Login', (done) => {
        chai
            .request(app)
            .get(allInactiveTripUrl)
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

    it('should not get all inactive / cancelled trips if User Login', (done) => {
        chai
            .request(app)
            .get(allInactiveTripUrl)
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
                done();
            });
    });

    it('should get all active trips based on origin / destination if Admin Login', (done) => {
        chai
            .request(app)
            .get(correctOriginDestinationUrl)
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

    it('should get all active trips based on origin / destination if Admin / User Login', (done) => {
        chai
            .request(app)
            .get(correctOriginDestinationUrl)
            .set({
                "Authorization": `Bearer ${Token1}`
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

    it('should not get all active trips based on origin / destination if origin/ destination is wrong', (done) => {
        chai
            .request(app)
            .get(wrongOriginDestinationUrl)
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
                done();
            });
    });

    it('should get all active trips based on bus stop if Admin / User Login', (done) => {
        chai
            .request(app)
            .get(correctbusstopUrl)
            .set({
                "Authorization": `Bearer ${Token1}`
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

    it('should not get all active trips based on bus stop if origin/ destination is wrong', (done) => {
        chai
            .request(app)
            .get(wrongbusstopUrl)
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
                done();
            });
    });

    // write test for cancelling trip
    it('should cancel trip if Admin Login', (done) => {
        chai
            .request(app)
            .patch(cancelledTripUrl)
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

    it('should not cancel trip if User Login', (done) => {
        chai
            .request(app)
            .patch(cancelledTripUrl)
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
                done();
            });
    });
    it('should activate trip if Admin Login', (done) => {
        chai
            .request(app)
            .patch(activateTripUrl)
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

    it('should not activate trip if User Login', (done) => {
        chai
            .request(app)
            .patch(activateTripUrl)
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
                done();
            });
    });
})