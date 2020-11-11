const createTripQuery = `INSERT INTO trip (origin,destination,bus_stops,trip_date,fare,bus_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;
const allTripQuery = `SELECT * FROM trip;`;
const allActiveTripQuery = `SELECT * FROM trip JOIN bus ON(trip.bus_id = bus.bus_id)  WHERE status ='active';`;
const allInactiveTripQuery = `SELECT * FROM trip JOIN bus ON(trip.bus_id = bus.bus_id)  WHERE status ='inactive';`;
const originDestinationQuery = `SELECT * FROM trip JOIN bus ON(trip.bus_id = bus.bus_id) WHERE (origin) ILIKE ($1) OR (destination) ILIKE ($1) AND status = 'active';`;
const getTripBusstopQuery = `SELECT * FROM trip JOIN bus ON(trip.bus_id = bus.bus_id) WHERE bus_stops @> ($1);`;
const tripCheckQuery = `SELECT * FROM trip WHERE trip_id = ($1)`;
const activateTripBookingsQuery = `UPDATE booking SET status ='active' WHERE trip_id = ($1)`;
const activateTripQuery = `UPDATE trip SET status ='active' WHERE trip_id = ($1)`;
const deactivateTripBookingsQuery = `UPDATE booking SET status ='inactive' WHERE trip_id = ($1)`;
const cancelTripQuery = `UPDATE trip SET status ='inactive' WHERE trip_id = ($1)`;

const busCheckQuery = `SELECT * FROM bus WHERE bus_id = ($1)`;
const scheduledTripQuery = `SELECT * FROM trip JOIN bus ON(trip.bus_id = bus.bus_id) WHERE trip.bus_id= ($1)`;

module.exports = {
    createTripQuery,
    allTripQuery,
    allActiveTripQuery,
    allInactiveTripQuery,
    originDestinationQuery,
    getTripBusstopQuery,
    tripCheckQuery,
    activateTripBookingsQuery,
    activateTripQuery,
    deactivateTripBookingsQuery,
    cancelTripQuery,
    busCheckQuery,
    scheduledTripQuery
}