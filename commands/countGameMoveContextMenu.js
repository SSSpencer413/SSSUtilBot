// Moves the button game down

const { ContextMenuCommandBuilder, ApplicationCommandType, InteractionContextType, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');


async function execute(interaction) {
	// Message must be a message context command
	if (!interaction.isMessageContextMenuCommand()) return;

	// Get message + content
	var message = interaction.targetMessage;
	if (!message) return interaction.reply({ content: `Message not found!`, ephemeral: true });

	// Message must come from a bot
	if (!interaction.targetMessage.author.bot) return interaction.reply({ content: `Invalid game!`, ephemeral: true });

	// message must have an interaction
	var msgInteraction = interaction.targetMessage.interaction;
	if (!msgInteraction || interaction.targetMessage.applicationId != interaction.applicationId) return interaction.reply({ content: `Invalid game!`, ephemeral: true });

	// Message must have a button in position 0 with id countgame_click
	let components = message.components;
	if (!components || !message.components[0] || !message.components[0].components) return interaction.reply({ content: `Invalid game!`, ephemeral: true });
	
	// Iterate through first row, if there's no button with id then stop
	let foundButton = false;
	for (var i = 0; i < message.components[0].components.length && !foundButton; i++) {
		var component = message.components[0].components[i];
		if (component.customId == "countgame_click") foundButton = true;
	}
	if (!foundButton) return interaction.reply({ content: `Invalid game!`, ephemeral: true });

	// Message must have content
	let content = message.content;
	if (!content) return interaction.reply({ content: `Message content not found!`, ephemeral: true });

	// Parse out count + user, add it to reply
	var count = parseInt(content.match(/(?<=Current count: )\d+(?=(\n)|$)/)[0]);
	if (count == null) return interaction.reply({ content: `Couldn't get count!`, ephemeral: true });

	let reply = `Current count: ${count}`;

	var user = message.content.match(/(?<=<@)(\d)+(?=>)/g);
	if (user) reply += `\nLast User: <@${user}>`;


	// Create button
	var button = new ButtonBuilder()
		.setCustomId('countgame_click')
		.setLabel('Click!')
		.setStyle(ButtonStyle.Primary);

	var row = new ActionRowBuilder()
		.addComponents(button);

	// Send reply
	await interaction.reply({ content: reply, components: [row] });
}

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Move Counter')
		.setType(ApplicationCommandType.Message)
		.setIntegrationTypes("UserInstall")
		.setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel]),

	execute: execute
};