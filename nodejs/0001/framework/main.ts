import { process, ProcessResult } from '../src/job'
import { reset } from './manager'
import { Control } from '../lib/mongoWrapper'
import { log } from 'console-log-colors'
import { testMultipartUpload } from '../lib/sink'

async function run_job() {
    let result: ProcessResult
    let runsRemaining: number = 5;

    do {
        Control.setQueriesLeft(100);
        
        result = await process(() => Control.getQueriesLeft() < 1200);
        runsRemaining--;
    } while (result != ProcessResult.Finished && runsRemaining > 0)

    testMultipartUpload();
}

async function run() {
    await run_job();

    // await reset();
}

log.green('>>>>> Starting job…')
run().then(() => {
    log.green('>>>>> Job finished')
})
.catch((e: Error) => {
    log.red(`>>>>> ${e.message}`)
})
