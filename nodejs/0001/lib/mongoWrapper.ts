import {
    Collection as MCollection,
    MongoClient as MMongoClient,
    Document as MDocument,
    Db as MDb,
    Filter as MFilter,
    Sort as MSort,
    UpdateFilter as MUpdateFilter,
    WithId as MWithId,
    OptionalUnlessRequiredId as MOptionalUnlessRequiredId,
    FindCursor as MFindCursor,
    ModifyResult as MModifyResult,
    InsertOneResult
} from 'mongodb'
import { config } from 'dotenv'
import { NotFoundException } from '@aws-sdk/client-sns';

config();

var queriesLeft: number = 0;

function queryCheck() {
    queriesLeft--;
    if (queriesLeft < 0) {
        throw new Error('Job already terminated');
    }
}

export class Control {
    static setQueriesLeft(nQueriesLeft: number) {
        queriesLeft = nQueriesLeft;
    }

    static getQueriesLeft() {
        return queriesLeft;
    }
}

export class FindCursor<TSchema> {
    private findCursor: MFindCursor<TSchema>

    constructor(mFindCursor: MFindCursor<TSchema>) {
        this.findCursor = mFindCursor;
    }

    async hasNext(): Promise<boolean> {
        return await this.findCursor.hasNext()
    }

    async next(): Promise<TSchema | null> {
        queryCheck();
        
        return await this.findCursor.next()
    }

    async close(): Promise<void> {
        queryCheck();
        
        return await this.findCursor.close()
    }

    sort(sort: MSort): FindCursor<TSchema> {
        return new FindCursor(this.findCursor.sort(sort))
    }

    limit(value: number): FindCursor<TSchema> {
        return new FindCursor(this.findCursor.limit(value))
    }
}

export class Collection<TSchema extends Document> {
    private collection: MCollection<TSchema>
    
    constructor(mcollection: MCollection<TSchema>) {
        this.collection = mcollection
    }

    findOne(): Promise<MWithId<TSchema> | null>;
    findOne(filter?: MFilter<TSchema>): Promise<MWithId<TSchema> | null> {
        queryCheck();

        if (!filter) {
            return this.collection.findOne();
        }
        
        return this.collection.findOne(filter)
    }

    find(filter?: MFilter<TSchema>): FindCursor<MWithId<TSchema>> {
        queryCheck();
       
        if (!filter) {
            return new FindCursor<MWithId<TSchema>>(this.collection.find())
        }

        return new FindCursor<MWithId<TSchema>>(this.collection.find(filter))
    }

    async findOneAndUpsert(filter: MFilter<TSchema>, updateFilter: MUpdateFilter<TSchema>): Promise<MModifyResult<TSchema>> {
        return await this.collection.findOneAndUpdate(filter, updateFilter, {upsert: true})
    }

    async remove(filter: MFilter<TSchema>): Promise<MModifyResult<TSchema>> {
        return await this.collection.findOneAndDelete(filter)
    }

    async Insert(doc: MOptionalUnlessRequiredId<TSchema>): Promise<InsertOneResult<TSchema>> {
        return await this.collection.insertOne(doc)
    }
}

export class MongoClient {
    private mongoClient: MMongoClient

    constructor() {
        this.mongoClient = new MMongoClient(process.env.MONGO_SERVER as string, {
            tlsCAFile: 'rds-combined-ca-bundle.pem'
        })
    }

    async connect(): Promise<MongoClient> {
        await this.mongoClient.connect()
        return this
    }

    db(dbName: string): Db {
        return new Db(this.mongoClient.db(dbName))
    }
}

export declare class Document {
    
}

export class Db {
    private db: MDb

    constructor(mdb: MDb) {
        this.db = mdb
    }

    collection<TSchema extends Document = Document>(name: string) {
        return new Collection(this.db.collection<TSchema>(name))
    }
}
