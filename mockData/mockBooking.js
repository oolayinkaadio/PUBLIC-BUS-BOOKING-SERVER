const correctLoginAdmin = {
    email: 'Bola@gmail.com',
    password: 'pass'
};

const correctLoginUser = {
    email: 'Shola@gmail.com',
    password: 'pass'
};

const emptyBookingDetails = {
    trip_id: '',
    seat_number: ''
}
const oneEmtpyBookingField = {
    trip_id: 'c7ab37c1-b60b-4855-bb27-1510754e3dab',
    seat_number: ''
}
const incorrectUUIDFormatForTripId = {
    trip_id: 'c7ab37c1-b60b-4855-bb27-1510754e3dabhjhkhhvkljghk',
    seat_number: 1
}
const incorrectTripId = {
    trip_id: 'c4ab56c1-b60b-4899-bb27-1510754e3dab',
    seat_number: 1
}
const unavailableSeatNumber = {
    trip_id: 'c7ab37c1-b60b-4855-bb27-1510754e3dab',
    seat_number: 1
}
const seatNumberExceeded = {
    trip_id: 'c7ab37c1-b60b-4855-bb27-1510754e3dab',
    seat_number: 50
}

const alreadyBookedSeatNumber = `/api/v1/bookings/change-seat/c8bccf07-c4e9-46c6-881b-4d9f49841903/10`
const exceedSeatNumber = `/api/v1/bookings/change-seat/c8bccf07-c4e9-46c6-881b-4d9f49841903/40`
const nonNumericSeatNumber = `/api/v1/bookings/change-seat/c8bccf07-c4e9-46c6-881b-4d9f49841903/l`
const wrongBookingId = `/api/v1/bookings/change-seat/c8bccf07-c4e9-46c6-881b-4d9f498419/10`
const seatNumberLessthanZero = `/api/v1/bookings/change-seat/c8bccf07-c4e9-46c6-881b-4d9f49841903/-2`
const correctNewSeat = `/api/v1/bookings/change-seat/c8bccf07-c4e9-46c6-881b-4d9f49841903/9`
module.exports = {
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
};

// module.exports = {
//     correctLoginAdmin,
//     correctLoginUser,
//     correctBookingDetails,
//     EmptyBookingDetails,
//     oneEmtpyBookingField,
//     incorrectBookingId,
//     unAvailableSeatNumber,
//     seatNumberExceeded,
//     updateSeat,
//     oneEmptyNewSeatField,
//     unavailableNewSeat,
//     newSeatWrongTripId,
//     newSeatExceedSeatCapacity
// }