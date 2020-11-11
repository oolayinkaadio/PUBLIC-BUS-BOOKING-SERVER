const correctAdminLogin = {
    email: 'Yinka@gmail.com',
    password: 'pass'
}
const correctUserLogin = {
    email: 'Shola@gmail.com',
    password: 'pass'
}
const correctTripDetails = {
    origin: "Akute",
    destination: "Berger",
    bus_stops: ['Alagbole', 'Sabo', 'Yakoyo'],
    trip_date: "2020-08-26",
    fare: "350",
    bus_id: "8"
}

const EmptyTripDetails = {
    origin: "",
    destination: "",
    bus_stops: "",
    trip_date: "",
    fare: "",
    bus_id: ""
}

const oneEmtpyTripField = {
    origin: "Agege",
    destination: "Ishaga",
    bus_stops: ['Fagba', 'General-hospital', 'Balogun'],
    trip_date: "2020-08-26",
    fare: "",
    bus_id: "7"
}

const incorrectBusId = {
    origin: "Agege",
    destination: "Ishaga",
    bus_stops: ['Fagba', 'General-hospital', 'Balogun'],
    trip_date: "2020-08-26",
    fare: "370",
    bus_id: "90"
}

const scheduledBusId = {
    origin: "Agege",
    destination: "Ishaga",
    bus_stops: ['Fagba', 'General-hospital', 'Balogun'],
    trip_date: "2020-08-26",
    fare: "220",
    bus_id: "2"
}






module.exports = {
    correctAdminLogin,
    correctUserLogin,
    correctTripDetails,
    EmptyTripDetails,
    oneEmtpyTripField,
    incorrectBusId,
    scheduledBusId
}