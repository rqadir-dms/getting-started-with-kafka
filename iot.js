/**
 * This js file simulates packet sending from IoT device
 * It sends packet on HTTP POST method every 5 seconds
 */

/**
 * Packet Payload JSON Schema
 * {
 *      device_type: string,
 *      device_id: string, // IMEI
 *      gprs_coordinates: <coordinates_object> 
 * }
 * 
 * coordinates_object = {
 *      latitude: float,
 *      longitude: float,
 *      elevation: integer,
 *      offset: float
 * }
 */
const axios = require('axios')

// Device categories represent family of IoT devices
const devices_categories = ['FMBT103', 'FMBT104']

// Device IDs represent registered devices against the family
const device_ids = {
    'FMBT103': [300, 301, 302, 303],
    'FMBT104': [401, 402, 403]
}

const BASE_URL = 'http://localhost:8001'
const path = '/send-packet'

setInterval(function() {
    let device = devices_categories[Math.round(Math.random() * 10) % 2]
    let imei = device_ids[device][Math.round(Math.random() * 20) % 4]

    let payload = {
        device_type: device,
        device_id: imei,
        gprs_coordinates: {
            latitude: Math.random() * 100,
            longitude: Math.random() * 100,
            elevation: Math.round(Math.random() * 360), // Optional field
            offset: Math.random() * 10
        }
    }

axios.post(BASE_URL + path, payload)
    .then(result => {
        let {data} = result
        console.log(JSON.stringify(data, null, 2))
    })
    .catch(err => {
        console.error(err.message)
    })

}, 5000)
