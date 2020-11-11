const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http')
const expect = require('chai').expect;

// chai middleware
chai.use(chaiHttp);

// Data's:::
const {
    correctLoginAdmin,
    correctLoginUser,
    emptyBookingDetails,
    oneEmtpyBookingField,
    incorrectUUIDFormatForTripId,
    incorrectTripId,
    unavailableSeatNumber,
    seatNumberExceeded,
    alreadyBookedSeatNumber,
    exceedSeatNumber,
    nonNumericSeatNumber,
    wrongBookingId,
    seatNumberLessthanZero,
    correctNewSeat

} = require('../mockData/mockBooking')

const userWithNoBooking = {
    email: 'James@gmail.com',
    password: 'pass'
}

// Testing data's::
let Token;
let Token1;
let Token2;
const getAllBookingUrl = '/api/v1/bookings/all';
const bookingUrl = '/api/v1/bookings/createbooking';
const myBookingUrl = '/api/v1/bookings/';
const allActiveBookingUrl = '/api/v1/bookings/active';
const allInactiveBookingUrl = '/api/v1/bookings/inactive';
const changeSeatUrl = 'api/v1/bookings/change-seat';
const cancelBookingUrl = 'api/v1/bookings/cancel/f3f46a9b-c116-4fbc-8b2d-59edd5a4a75c';
const signinUrl = '/api/v1/auth/signin';

// Test book creation

describe('Logging User and Admin', () => {
    it('successfully Logged in Admin', (done) => {
        chai
            .request(app)
            .post(signinUrl)
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
            .post(signinUrl)
            .send(correctLoginUser)
            .end((err, res) => {
                const {
                    body
                } = res;
                Token1 = body.data.token;
                done();
            });
    });

    it('successfully Log in User with no bookings', (done) => {
        chai
            .request(app)
            .post(signinUrl)
            .send(userWithNoBooking)
            .end((err, res) => {
                const {
                    body
                } = res;
                Token2 = body.data.token;
                // console.log('3::', Token2)
                done();
            });
    });
})

describe(`Testing the book creation endpoint`, () => {
    // it('Admin/User should create a booking successfully', (done) => {
    //     chai
    //         .request(app)
    //         .post(bookingUrl)
    //         .set({ "Authorization": `Bearer ${Token1}` })
    //         .send(correctBookingDetails)
    //         .end((err, res) => {
    //             const {
    //                 body
    //             } = res;
    //             expect(res.status).to.equal(201);
    //             expect(res.status).to.be.a('number');
    //             expect(body).to.be.an('object');
    //             expect(body.data).to.be.have.property('user_id');
    //             expect(body.data).to.be.have.property('booking_id');
    //             expect(body.data).to.be.have.property('trip_id');
    //             expect(body.data).to.be.have.property('bus_id');
    //             expect(body.data).to.be.have.property('seat_number');
    //             expect(body.data).to.be.have.property('status');
    //             done();
    //         });
    // });
    it('Admin/User should not create a booking successfully when body is empty', (done) => {
        chai
            .request(app)
            .post(bookingUrl)
            .set({ "Authorization": `Bearer ${Token}` })
            .send(emptyBookingDetails)
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
    it('Admin/User should not create a trip successfully when one of the reuired param is empty', (done) => {
        chai
            .request(app)
            .post(bookingUrl)
            .set({ "Authorization": `Bearer ${Token1}` })
            .send(oneEmtpyBookingField)
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
    it('Admin/User should not create a trip successfully when the trip id is not in the right UUID format', (done) => {
        chai
            .request(app)
            .post(bookingUrl)
            .set({ "Authorization": `Bearer ${Token}` })
            .send(incorrectUUIDFormatForTripId)
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
    it('Admin/User should not create a trip successfully when the trip id is invalid', (done) => {
        chai
            .request(app)
            .post(bookingUrl)
            .set({ "Authorization": `Bearer ${Token}` })
            .send(incorrectTripId)
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

    it('Admin/User should not create a trip successfully when the seat number has been exceeded', (done) => {
        chai
            .request(app)
            .post(bookingUrl)
            .set({ "Authorization": `Bearer ${Token1}` })
            .send(seatNumberExceeded)
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

    it('Admin/User should not create a trip successfully when the seat number is not available', (done) => {
        chai
            .request(app)
            .post(bookingUrl)
            .set({
                "Authorization": `Bearer ${Token1}`
            })
            .send(unavailableSeatNumber)
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
})

describe('Testing the get booking requests', () => {
    // getAllBookingUrl accessible to Admin alone
    it('should get all bookings if Admin Logged in', (done) => {
        chai
            .request(app)
            .get(getAllBookingUrl)
            .set({ "Authorization": `Bearer ${Token}` })
            .end((err, res) => {
                console.log(err)
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
    })

    it('should not get all bookings if user Logged in', (done) => {
        chai
            .request(app)
            .get(getAllBookingUrl)
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
    it('should not get all bookings if no Logged in Admin / User', (done) => {
        chai
            .request(app)
            .get(getAllBookingUrl)
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.equal(401);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('status');
                expect(body).to.be.have.property('error');
                done();
            });
    })

    // myBookingUrl...Users should get their bookings alone
    it('should get user bookings if User Logged in', (done) => {
        chai
            .request(app)
            .get(myBookingUrl)
            .set({ "Authorization": `Bearer ${Token1}` })
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
    it('should not get bookings if User has no bookings yet', (done) => {
        chai
            .request(app)
            .get(myBookingUrl)
            .set({ "Authorization": `Bearer ${Token2}` })
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
    })


    // allActiveBookingUrl....Admin alone
    it('should get all active bookings if Admin Logged in', (done) => {
        chai
            .request(app)
            .get(allActiveBookingUrl)
            .set({
                "Authorization": `Bearer ${Token}`
            })
            .end((err, res) => {
                console.log(err)
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

    it('should not get active bookings if User Logged in', (done) => {
        chai
            .request(app)
            .get(allActiveBookingUrl)
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
    })

    it('should not get all active bookings if log in token', (done) => {
        chai
            .request(app)
            .get(allActiveBookingUrl)
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.equal(401);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('status');
                expect(body).to.be.have.property('error');
                done();
            });
    })

    // allInactiveBookingUrl....Admin alone
    it('should get all inactive bookings if Admin Logged in', (done) => {
        chai
            .request(app)
            .get(allInactiveBookingUrl)
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
    })
    it('should not get all inactive bookings if User Logged in', (done) => {
        chai
            .request(app)
            .get(allInactiveBookingUrl)
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
    })
    it('should not get all active bookings if log in token', (done) => {
        chai
            .request(app)
            .get(allInactiveBookingUrl)
            .end((err, res) => {
                const {
                    body
                } = res;
                expect(res.status).to.equal(401);
                expect(res.status).to.be.a('number');
                expect(body).to.be.an('object');
                expect(body).to.be.have.property('status');
                expect(body).to.be.have.property('error');
                done();
            });
    })

})

describe('testing the patch request for changing the seat_number', () => {
    //   changeSeat....accessible to both Admin & users::
    it('should not change bookings seat if seat has been booked', (done) => {
        chai
            .request(app)
            .patch(alreadyBookedSeatNumber)
            .set({
                "Authorization": `Bearer ${Token1}`
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
                done();
            });
    })
    it('should not change bookings seat if seat number has been exceeded', (done) => {
        chai
            .request(app)
            .patch(exceedSeatNumber)
            .set({
                "Authorization": `Bearer ${Token1}`
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
                done();
            });
    })
    it('should not change bookings seat if no seat number', (done) => {
        chai
            .request(app)
            .patch(nonNumericSeatNumber)
            .set({
                "Authorization": `Bearer ${Token1}`
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
                done();
            });
    })
    it('should not change bookings seat if booking Id is wrong', (done) => {
        chai
            .request(app)
            .patch(wrongBookingId)
            .set({ "Authorization": `Bearer ${Token1}` })
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
    })
    it('should not change bookings seat if seat number is less than 0', (done) => {
            chai
                .request(app)
                .patch(seatNumberLessthanZero)
                .set({
                    "Authorization": `Bearer ${Token1}`
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
                    done();
                });
        })
        // it('should change bookings seat if User Logged in', (done) => {
        //     chai
        //         .request(app)
        //         .patch(correctNewSeat)
        //         .set({
        //             "Authorization": `Bearer ${Token1}`
        //         })
        //         .send(newSeatExceedSeatCapacity)
        //         .end((err, res) => {
        //             const {
        //                 body
        //             } = res;
        //             expect(res.status).to.equal(400);
        //             expect(res.status).to.be.a('number');
        //             expect(body).to.be.an('object');
        //             expect(body).to.be.have.property('status');
        //             expect(body).to.be.have.property('error');
        //             done();
        //         });
        // })

})