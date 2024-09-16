// sample command

const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
		.setIntegrationTypes("UserInstall")
		.setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel]),
	async execute(interaction) {
		await interaction.reply({ content: 'Pong!', ephemeral: true });
	},
};