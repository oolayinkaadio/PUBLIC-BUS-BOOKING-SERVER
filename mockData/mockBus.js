const correctLoginAdmin = {
    email: 'Bola@gmail.com',
    password: 'pass'
};

const correctLoginUser = {
    email: 'Shola@gmail.com',
    password: 'pass'
};

const correctBusDetails = {
    number_plate: 'FKJ420UT',
    manufacturer: 'Mercedez',
    model: 'C-CLASS',
    year: 2021,
    capacity: 25
}
const emptyBusDetails = {
    number_plate: '',
    manufacturer: '',
    model: '',
    year: '',
    capacity: ''
}
const oneEmtpyBusField = {
    number_plate: '',
    manufacturer: 'Honda',
    model: 'CR-V',
    year: 2017,
    capacity: 25
}
const existingBusNumberPlate = {
    number_plate: 'KJA565JU',
    manufacturer: 'Honda',
    model: 'CR-V',
    year: 2017,
    capacity: 25
}

// For createBus::
const createBusUrl = `/api/v1/bus/create`

// For getAllBus::
const allBus = `/api/v1/bus/`

// For getBusWithNumberPlate::
const correctBusNumberPlate = `/api/v1/bus/number/KJA565JU`
const incorrectBusNumberPlate = `/api/v1/bus/number/111111`

// For getBuswithTripOriginDestination::
const correctBusOriginDestination = `/api/v1/bus/Yaba`
const incorrectBusOriginDestination = `/api/v1/bus/Togo`

// For getScheduledBuses::
const getScheduledBuses = `/api/v1/bus/scheduled`

// For getUnscheduledBuses::
const getUnscheduledBuses = `/api/v1/bus/unscheduled`

// For delete bus::
const deleteScheduledBus = `/api/v1/bus/KJA565JU`
const deleteUnscheduledBus = `/api/v1/bus/FKJ420UT`

module.exports = {
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
}