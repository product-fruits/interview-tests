import { MongoClient } from 'mongodb'
import { uniqueNamesGenerator, Config, names, adjectives } from 'unique-names-generator'
import { log, color, yellow } from 'console-log-colors'

export async function reset() {
    const mongoClient = new MongoClient(process.env.MONGO_SERVER as string, {
        tlsCAFile: 'rds-combined-ca-bundle.pem'
    })

    const configNames: Config = {
        dictionaries: [names]
    }

    const configAdjectives: Config = {
        dictionaries: [adjectives],
        style: 'capital'
    }

    const db = mongoClient.db('test_0001')
    log.yellow("Dropping collection 'source_data'")
    await db.dropCollection('source_data', {}).catch((e) => {
        if (e.message !== 'ns not found') {
            throw e
        }
    });

    console.log(color.yellow.bold("Collection 'source_data' dropped"))

    const coll = db.collection('source_data')
    const docs: object[] = [];

    const documents_count = 100000

    console.log(yellow(`Saving ${documents_count} documents`))

    for (var i = 1; i <= documents_count; i++) {
        const first_name = uniqueNamesGenerator(configAdjectives)
        const last_name = uniqueNamesGenerator(configNames)
        const order = Math.floor((i - 1) / 100) * 100 + (100 - (i - 1) % 100)
        const doc = {first_name: first_name, last_name: last_name, index: i, order: order}
        docs.push(doc)
        // console.log(`Inserted #${i}`)

        if (docs.length >= 10000) {
            console.log(yellow(`  Saving batch of ${docs.length} documents`))
            await coll.insertMany(docs);
            console.log(yellow.bold(`  Saved batch of ${docs.length} documents`))
            docs.length = 0;
        }
        // await coll.insertOne(doc)
    }

    if (docs.length > 0) {
        console.log(yellow(`  Saving batch of ${docs.length} documents`))
        await coll.insertMany(docs);
        console.log(yellow.bold(`  Saved batch of ${docs.length} documents`))
        docs.length = 0;
    }

    console.log(yellow.bold(`Saved ${documents_count} documents`))
}
