// Creates an embed

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


async function execute(interaction) {
	if (!interaction.isChatInputCommand()) return;

	var embed = EmbedBuilder.new()
		.setDescription(interaction.options.getString('description', true));

	let title = interaction.options.getString('title');
	if (title) embed.setTitle(title);

	let color = interaction.options.getString('color');
	if (color) embed.setColor(color);

	let url = interaction.options.getString('url');
	if (url) embed.setURL(url);



	await interaction.reply({ content : ``, embed : embed });
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('Creates an embed')
		.addStringOption(option => 
			option.setName('description')
				.setDescription('Set the description of the embed')
				.setRequired(true))
		.addStringOption(option => 
			option.setName('title')
				.setDescription('Set the title of the embed'))
		.addStringOption(option => 
			option.setName('color')
				.setDescription('Set the color of the embed (uses hex color)'))
		.addStringOption(option => 
			option.setName('url')
				.setDescription('Set the url of the embed'))

		// Author
		.addStringOption(option => 
			option.setName('author')
				.setDescription('Set the author of the embed'))
		.addStringOption(option => 
			option.setName('author-url')
				.setDescription('Set the url of the author of the embed. Requires author field to be set'))
			
		
		.setIntegrationTypes("UserInstall")
		.setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel]),
		

	execute: execute
};