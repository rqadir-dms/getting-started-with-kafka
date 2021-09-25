/**
 * Retrieve msgs from the partition
 */

const {packetSchema} = require('../PacketSchema')
const {Kafka} = require('kafkajs')

// Consume messages from FMBT103
const topic = 'FMBT103'

const kafka = new Kafka({
    clientId: 'dms-pk',
    brokers: ['localhost:9092']
})

const consumer = kafka.consumer({
    groupId: topic
})

const fetchMsg = async () => {
    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            console.info(`From topic: ${topic}, Partition: ${partition}`)
            console.info(`Data: ${JSON.stringify(packetSchema.fromBuffer(message.value), null, 2)}`)
        }
    })
}

const run = async () => {
    await consumer.connect()
    await consumer.subscribe({
        topic
    })
    await fetchMsg()
}

run()
