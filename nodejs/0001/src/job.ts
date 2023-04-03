import { MongoClient } from '../lib/mongoWrapper'
import { initMultipartUpload, uploadPart, completeMultipartUpload, PartDescriptor } from '../lib/sink'

export enum ProcessResult {
    NotYetDone,
    Finished
}

export async function process(shouldEnd: () => boolean): Promise<ProcessResult> {
    // Your code goes here
    throw Error('Not implemented')
}
