# @karcass/cli-service

Cli service for karcass skeleton which helps to build simple CLI interfaces

## Installation

```
npm install @karcass/cli-service
```

## Usage

With this code in `example.ts`:

```typescript
import { CliService, AbstractConsoleCommand } from '@karcass/cli-service'

const cliService = new CliService()

class SomeCommand extends AbstractConsoleCommand {
    public static meta = { name: 'do:some', description: 'Does some action' }
    public async execute() {
        console.log('It\'s just work!')
    }
}

cliService.run()
```

Executing &nbsp;`ts-node example.ts`&nbsp; will print:

```
=== Available commands: ===
  --help   Show this help
  do:some  Does some action
```

And executing of &nbsp;`ts-node example.js do:some`&nbsp; will print:

```
It's just work!
```

Also you can turn off default --help command behaviour by turning off corresponding setting:

```
const cliService = new CliService({ useDefaultHelpCommand: false })
```