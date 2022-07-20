const CommandHandler = require("./command-handler/CommandHandler")
const mongoose = require('mongoose')

class eskaiCommands {
  constructor({ client, mongoUri, commandsDir, testServers = [], botOwners = [] }) {
    if (!client) {
      throw new Error('A client is required')
    }

    this._testServers = testServers
    this._botOwners = botOwners

    if (mongoUri) {
      this.connectToMongo(mongoUri)
    }

    if (commandsDir) {
      new CommandHandler(this, commandsDir, client)
    }
  }

  get testServers() {
    return this._testServers
  }

  get botOwners() {
    return this._botOwners
  }

  connectToMongo(mongoUri) {
    mongoose.connect(mongoUri, {
      keepAlive: true
    })
  }
}

module.exports = eskaiCommands