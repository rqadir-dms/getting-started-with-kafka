/**
 * Listen for incoming packets
 */

const fastify = require('fastify')({ logger: true })
const {packetSchema} = require('../PacketSchema')
const {Kafka} = require('kafkajs')

const kafka = new Kafka({
    clientId: 'dms-pk',
    brokers: ['localhost:9092']
})

const admin = kafka.admin()
const producer = kafka.producer()

const topic_partition = new Map()

// Declare a route
fastify.post('/send-packet', async (request, reply) => {

    let {body} = request // Packet

    /**
     * AVRO Validation
     */
    if (packetSchema.isValid(body)) {
        /**
         * Packet is well formed
         * Topic will be device_type
         * Partition will be device_id
         */
        let {device_type, device_id} = body

        fastify.log.info(`Received device type: ${device_type}, device ID: ${device_id}`)

        // Check for topic in map
        if (!topic_partition.has(device_type)) {
          // Nest one Map against every family
          topic_partition.set(device_type, new Map())

          // First partition is default to 0
          topic_partition.get(device_type).set(device_id, 0)

          await createTopic(device_type)
        }

        // Check for paritition in the topic map
        if (!topic_partition.get(device_type).has(device_id)) {
          // Create parition for evey new device in existing device type
          // Retrieve how many partitions exist against a family
          // Size will take care of offset
          let count = topic_partition.get(device_type).size

          topic_partition.get(device_type).set(device_id, count)

          // Count argument passed will be one greater than the exisiting partitions
          await createPartition(device_type, count + 1)
        }

        // Send message to topic - partition
        let partition = topic_partition.get(device_type).get(device_id)
        let buf = packetSchema.toBuffer(body)
        let topic = device_type
        await sendMsg(topic, partition, buf)        
        reply.send({ ok: true, statusCode: 200, message: "Packet received" })
    } else {
        reply.send({ ok: false, statusCode: 500, message: "Packet malformed" })
    }

  })
  // Producer
  const sendMsg = async (topic, partition, buf) => {
    try {
      await producer.connect()
      await producer.send({
        topic,
        messages: [
          {
            // key is optional in the message, not included
            value: buf, // Mandatory
            partition
          }
        ]
      })
    } catch(e) {
      fastify.log.error(e)
    } finally {
      await producer.disconnect()
    }
  }

  // Admin
  const createPartition = async (topic, count) => {

    try {
      await admin.connect()
      await admin.createPartitions({
        topicPartitions: [
          {
            topic,
            count
          }
        ]
      })
      fastify.log.info(`Partition count: ${count} created in topic: ${topic}`)
    } catch(e) {
      fastify.log.error(e)

    } finally {
      await admin.disconnect()
    }
  }

  // Admin
  const createTopic = async (topic) => {
    // Creating topic creates one default partition with index 0
    try {
      await admin.connect()
      await admin.createTopics({
        topics: [{
          topic
        }]
      })
      fastify.log.info(`Topic is created: ${topic}`)
    } catch (e) {
      fastify.log.error(e)
    } finally {
      await admin.disconnect()
    }
  }
  
  // Run the server!
  const run = async () => {
    try {
      await fastify.listen(8001)
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  }


run()
