module.exports = (command, usage) => {
  const { instance, commandObject } = command
  const { user, interaction, message } = usage

  const { botOwners } = instance

  if (commandObject.ownerOnly && !botOwners.includes(user.id)) {
    const text = 'Only bot owners can run this command'

    if (message) message.reply(text)
    else if (interaction) interaction.reply(text)
    return false
  }

  return true
}