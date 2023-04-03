import { process, ProcessResult } from '../src/job'
import { reset, cleanup, checkCleanup } from './manager'
import { Control } from '../lib/mongoWrapper'
import { log, green, greenBright } from 'console-log-colors'
import { testMultipartUpload } from '../lib/sink'

async function run_job() {
    let result: ProcessResult
    let runsRemaining: number = 50
    let runsPassed: number = 0

    await cleanup()

    do {
        Control.setQueriesLeft(10000);
        
        runsPassed++
        log.green(`  >>>>> Running job pass #${runsPassed}`)
        result = await process(() => Control.getQueriesLeft() < 1200);
        runsRemaining--;
    } while (result != ProcessResult.Finished && runsRemaining > 0)

    log.green('>>>>> Job done.')
    log.green('>>>>> Running tests.')
    log.green('  >>>>> Running output data tests.')

    testMultipartUpload();

    console.log(green.bold('  >>>>> Output data tests passed.'))

    console.log(green('  >>>>> Running cleanup tests.'))

    await checkCleanup();

    console.log(green.bold('  >>>>> Cleanup tests passed.'))
}

async function run() {
    await run_job();

    // await reset();
}

log.green('>>>>> Starting')
run().then(() => {
    console.log(green.underline('>>>>> Finished and all tests passed!')
})
.catch((e: Error) => {
    log.red(`>>>>> ${e.message}`)
})
