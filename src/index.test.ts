import { CliService, AbstractConsoleCommand } from './'
import assert from 'assert'

class FailCommand extends AbstractConsoleCommand {
    public async execute() { /**/ }
}
let testVar = 1
class SuccessCommand extends AbstractConsoleCommand {
    public static meta = { name: 'test', description: 'test description' }
    public async execute() {
        testVar = 2
    }
}

it('Must throw message about undefined static field', async () => {
    const cliService = new CliService()
    cliService.add(FailCommand, () => new FailCommand())
    try {
        await cliService.run()
    } catch (err) {
        return assert(err.message.indexOf('meta'))
    }
    assert.fail()
})
it('Must change value of testVar to 2', async () => {
    const cliService = new CliService()
    cliService.add(SuccessCommand, () => new SuccessCommand())
    process.argv[2] = 'test'
    await cliService.run()
    assert.equal(testVar, 2)
})
it('Must console.log help text', async () => {
    const cliService = new CliService()
    const out: string[] = []
    const myLog = (text: string) => {
        out.push(text)
    }
    const reallyLog = console.log
    console.log = myLog
    await cliService.run()
    console.log = reallyLog
    assert(out.join('\n').indexOf('Show this help') >= 0)
    assert(out.join('\n').indexOf('--help') >= 0)
})
it('Must console.log "123"', async () => {
    class MyCommand extends AbstractConsoleCommand {
        public static meta = { name: 'test' }
        public async execute() {
            await new Promise(resolve => setTimeout(resolve, 100))
            console.log('123')
        }
    }
    const cliService = new CliService()
    let out = ''
    const myLog = (text: string) => {
        out = text
    }
    const reallyLog = console.log
    cliService.add(MyCommand, () => new MyCommand())
    console.log = myLog
    await cliService.run()
    console.log = reallyLog
    assert(out.indexOf('123') >= 0)
})
