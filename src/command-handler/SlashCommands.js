class SlashCommands {
  constructor(client) {
    this._client = client
  }

  async getCommands(guildId) {
    let commands

    if (guildId) {
      const guild = await this._client.guilds.fetch(guildId)
      commands = guild.commands
    } else {
      commands = this._client.application.commands
    }

    await commands.fetch()

    return commands
  }

  areOptionsDifferent(options, existingOptions) {
    for (let a = 0; a < options.length; a++) {
      const option = options[a]
      const existing = existingOptions[a]

      if (option.name !== existing.name || option.type !== existing.type || option.description !== existing.description) {
        return true
      }
    }

    return false
  }

  async create(name, description, options, guildId) {
    const commands = await this.getCommands(guildId)

    const existingCommand = commands.cache.find((cmd) => cmd.name === name)
    if (existingCommand) {
      const { description: existingDescription, options: existingOptions } = existingCommand

      if (description !== existingDescription || options.length !== existingOptions.length || this.areOptionsDifferent(options, existingOptions)) {
        console.log(`Updating command "${name}".`)

        await commands.edit(existingCommand.id, {
          name,
          description,
          options
        })
      }
      return
    }

    await commands.create({
      name,
      description,
      options
    })
  }

  async delete(commandName, guildId) {
    const commands = await this.getCommands(guildId)
    if (!commands) return

    await commands.fetch()

    const targetCommand = commands.cache.find((cmd) => cmd.name === commandName)
    if (!targetCommand) return

    targetCommand.delete()
  }

  createOptions({ expectedArgs = "", minArgs = 0 }) {
    const options = []

    if (!minArgs) {
      return options
    }
    
      const split = expectedArgs
        .substring(1, expectedArgs.length - 1)
        .split(/[>\]] [<\[]/)

    for (let a = 0; a < split.length; a++) {
      const item = split[a]

      options.push({
        name: item.toLowerCase().replace(/\s+/g, '-'),
        description: item,
        type: 'STRING',
        required: a < minArgs
      })
    }

    return options
  }
}

module.exports = SlashCommands