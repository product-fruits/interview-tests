import { process } from './job'
import { reset } from './manager'
import { Control } from './mongoWrapper'
import { log } from 'console-log-colors'
import { TestMultipartUpload } from './sink'

async function run_job() {
    let result: boolean
    let runsRemaining: number = 5;

    do {
        Control.setQueriesLeft(100);
        
        result = await process(() => Control.getQueriesLeft() < 1200);
        runsRemaining--;
    } while (!result && runsRemaining > 0)


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
