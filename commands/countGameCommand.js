// Starts the counting game

const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionContextType } = require('discord.js');


async function execute(interaction) {
	if (!interaction.isChatInputCommand()) return;

	var button = new ButtonBuilder()
		.setCustomId('countgame_click')
		.setLabel('Click!')
		.setStyle(ButtonStyle.Primary);

	var row = new ActionRowBuilder()
		.addComponents(button);

	await interaction.reply({ content: `Current count: 0`, components : [row] });
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('count')
		.setDescription('Start the counting game')
		.setIntegrationTypes("UserInstall")
		.setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel]),
		

	execute: execute
};