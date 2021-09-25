# Getting Started with Kafka

#### Objective
 - To create __topics__ and __partitions__ dynamically in Kafka cluster
 - To validate incoming JSON packet with AVRO schema
 - Insert serialized packet into kafka broker
 - Consume message from topic and unserialized it

#### Architecture
 - Every topic in the broker represent a __family__ of an IoT device
 - Every partition represent a device belonging to a specific family

```bash
: '
    This is a multiline comments

    Npm modules used in this project
    1) kafkajs
    2) axios
    3) fastify
    4) avsc (for AVRO schema)
'
```

#### Conclusion
 - Successfully create topics and partitions at runtime
