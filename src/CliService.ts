import { Container } from '@karcass/container'
import { AbstractConsoleCommand, MetaContainerInterface } from './AbstractConsoleCommand'
import { HelpCommand } from './HelpCommand'

export class CliService {
    protected container = new Container<AbstractConsoleCommand>()

    public constructor(config: { useDefaultHelpCommand?: boolean } = {}) {
        config = { useDefaultHelpCommand: true, ...config }
        if (config.useDefaultHelpCommand) {
            const commands: (new (...args: any[]) => AbstractConsoleCommand)[] = []
            for (const key of this.container.getKeys()) {
                if (typeof key !== 'string') {
                    commands.push(key)
                }
            }
            this.container.add(HelpCommand, () => new HelpCommand(commands))
        }
    }

    public add<T extends AbstractConsoleCommand>(constructor: new (...args: any[]) => T, initializer: () => T|Promise<T>) {
        this.container.add(constructor, initializer)
    }

    public async run() {
        for (const command of this.container.getKeys()) {
            if (typeof command === 'string') {
                throw new Error(`Key "${command}" must be a constructor, not a string`)
            }
            const meta = (command as unknown as MetaContainerInterface).meta
            if (!meta || !meta.name) {
                throw new Error(`There is no static field "meta" in the ${command.name}`)
            }
            if (meta.name === process.argv[2]) {
                (await this.container.get(command)).execute()
                return
            }
        }
        (await this.container.get(HelpCommand)).execute()
    }

}
