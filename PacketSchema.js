const avro = require('avsc')

module.exports.packetSchema = avro.Type.forSchema({
        name: 'packet',
        type: 'record',
        fields: [
            {name: 'device_type', type: 'string'},
            {name: 'device_id', type: 'int'},
            {name: 'gprs_coordinates', type: {
                name: 'gprs_information',
                type: 'record',
                fields: [
                    {name: 'latitude', type: 'double'},
                    {name: 'longitude', type: 'double'},
                    {name: 'elevation', type: ['null', 'int'], default: null},
                    {name: 'offset', type: 'double'}
                ]
            }}
        ]

    })
