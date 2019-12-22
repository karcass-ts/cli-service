import { AbstractConsoleCommand, MetaContainerInterface } from './AbstractConsoleCommand'

export class HelpCommand extends AbstractConsoleCommand {
    public static meta = { name: '--help', description: 'Show this help' }

    public constructor(protected commands: (new (...args: any[]) => AbstractConsoleCommand)[]) {
        super()
    }

    public async execute(): Promise<void> {
        console.log('\n=== Available commands: ===')
        const commands = this.commands.map(command => {
            const meta = (command as unknown as MetaContainerInterface).meta
            if (!meta || !meta.name) {
                throw new Error(`There is no static field "meta" in the ${command.name}`)
            }
            if (typeof meta.name !== 'string') {
                throw new Error(`The property "name" of the static field "meta" of the ${command.name} must be a string`)
            }
            if (meta.description && typeof meta.description !== 'string') {
                throw new Error(`The property "description" of the static field "meta" of the ${command.name} must be a string`)
            }
            return { description: '', ...meta }
        }).sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1)
        const maxLength = Math.max(...commands.map((c) => c.usage ? c.usage.length : c.name.length))

        for (const command of commands) {
            console.log('  ' +
                (command.usage ? command.usage : command.name).padEnd(maxLength) +
                `  ${command.description}`)
        }
    }

}
