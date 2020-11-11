const createBusQuery = `INSERT INTO bus (number_plate, manufacturer, model, year, capacity) VALUES($1, $2, $3, $4, $5) RETURNING *`;
const allBusQuery = `SELECT * FROM bus JOIN trip ON(trip.bus_id = bus.bus_id)`;
const existingBusQuery = `SELECT * FROM bus  WHERE number_plate = ($1);`;
const busWithTripOriginDestination = `SELECT * FROM bus JOIN trip ON(trip.bus_id = bus.bus_id) WHERE (trip.origin) ILIKE ($1) OR (trip.destination) ILIKE ($1);`;
const scheduledBusQuery = `SELECT * FROM trip JOIN bus ON(trip.bus_id = bus.bus_id);`;
const unScheduledBusQuery = `SELECT * FROM bus LEFT JOIN trip ON(bus.bus_id = trip.bus_id) WHERE trip.bus_id IS NULL;`;
const checkBusQuery = `SELECT * FROM bus WHERE number_plate = ($1);`;
const busScheduledForTripsQuery = `SELECT * FROM bus JOIN trip ON(trip.bus_id = bus.bus_id) WHERE number_plate = ($1);`;
const deleteBusQuery = `DELETE FROM bus WHERE bus_id = ($1);`;

module.exports = {
    createBusQuery,
    allBusQuery,
    existingBusQuery,
    busWithTripOriginDestination,
    scheduledBusQuery,
    unScheduledBusQuery,
    checkBusQuery,
    busScheduledForTripsQuery,
    deleteBusQuery
}