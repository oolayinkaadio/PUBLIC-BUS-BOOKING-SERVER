// BOOKING CONTROLLER QUERIES
const tripAvailabilityQuery = `SELECT * FROM trip JOIN bus ON(trip.bus_id = bus.bus_id)  WHERE trip_id = ($1) AND status ='active';`;
const seatAvailabilityQuery = `SELECT CASE WHEN EXISTS (SELECT * FROM booking WHERE trip_id = ($1) AND seat_number = ($2)) THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END`;
const createBookingQuery = `INSERT INTO booking(user_id, trip_id, bus_id, trip_date, seat_number, first_name, last_name,email) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
const getAllBookingsQuery = `SELECT * FROM booking`;
const bookingBasedOnStatusQuery = `SELECT * FROM booking WHERE status = ($1)`;
const myBookingsQuery = `SELECT * FROM booking WHERE user_id = ($1) AND status = 'active'`;
const userNewSeatQuery = `UPDATE booking SET seat_number = ($1) WHERE trip_id = ($2) AND user_id = ($3)`;
const confirmBookingAvailabilityQuery = `SELECT * FROM booking WHERE booking_id =($1) AND user_id = ($2)`;
const cancelBookingQuery = `UPDATE booking SET status ='inactive' WHERE booking_id = $1 AND user_id = ($2)`;

// BOOKING CONTROLLER QUERIES
const seatDetailsQuery = `SELECT * FROM booking JOIN trip ON(trip.trip_id = booking.trip_id) WHERE booking_id =($1) AND booking.status ='active' AND user_id = ($2)`;
const busDetailsQuery = `SELECT * FROM bus WHERE bus_id = ($1)`;


module.exports = {
    tripAvailabilityQuery,
    seatAvailabilityQuery,
    createBookingQuery,
    getAllBookingsQuery,
    bookingBasedOnStatusQuery,
    myBookingsQuery,
    userNewSeatQuery,
    confirmBookingAvailabilityQuery,
    cancelBookingQuery,
    seatDetailsQuery,
    busDetailsQuery
}