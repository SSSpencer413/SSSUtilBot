// Creates an embed

const { SlashCommandBuilder, EmbedBuilder, InteractionContextType } = require('discord.js');


async function execute(interaction) {
	if (!interaction.isChatInputCommand()) return;

	var embed = new EmbedBuilder()
		.setDescription(interaction.options.getString('description', true));

	// Title
	let title = interaction.options.getString('title');
	if (title) embed.setTitle(title);

	// Color
	let color = interaction.options.getString('color');
	if (color) embed.setColor(color);

	// URL
	let url = interaction.options.getString('url');
	if (url) embed.setURL(url);

	// Author
	let author = interaction.options.getString('author');
	if (author) {
		let authorData = {
			name : author
		}

		// These fields require the author field
		let authorUrl = interaction.options.getString('author-url');
		if (authorUrl) authorData.url = authorUrl;

		let authorIcon = interaction.options.getString('author-icon');
		if (authorIcon) authorData.iconURL = authorIcon;

		embed.setAuthor(authorData);
	}

	// Image
	let image = interaction.options.getString('image');
	if (image) embed.setImage(image);
	// Thumbnail
	let thumbnail = interaction.options.getString('thumbnail');
	if (thumbnail) embed.setThumbnail(thumbnail);

	// Footer
	let footer = interaction.options.getString('footer');
	if (footer) {
		let footerData = {
			text : footer
		}

		// These fields require the footer field
		let footerIcon = interaction.options.getString('footer-icon');
		if (footerIcon) footerData.iconURL = footerData;

		embed.setFooter(footerData);
	}

	// Timestamp
	let timestamp = interaction.options.getInteger('timestamp');
	if (timestamp) {
		if (timestamp < 0) embed.setTimestamp();	// if timestamp < 0, use now!
		else embed.setTimestamp(timestamp);
	}

	let message = interaction.options.getString('message');
	await interaction.reply({ content : `${message ? message : ""}`, embeds : [embed] });
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('Creates an embed')
		
		// Body
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
		.addStringOption(option => 
			option.setName('author-icon')
				.setDescription('Set the icon (url) of the author of the embed. Requires author field to be set'))
		
		// Images
		.addStringOption(option => 
			option.setName('image')
				.setDescription('Set the image (url) of the embed'))
		.addStringOption(option => 
			option.setName('thumbnail')
				.setDescription('Set the thumbnail (url) of the embed'))


		// Footer
		.addStringOption(option => 
			option.setName('footer')
				.setDescription('Set the footer of the embed'))
		.addStringOption(option => 
			option.setName('footer-icon')
				.setDescription('Set the footer icon of the embed. Requires footer field to be set'))
		.addIntegerOption(option => 
			option.setName('timestamp')
				.setDescription('Set the timestamp of the embed. Uses unix timestamp, or -1 for now!'))


		// Message
		.addStringOption(option => 
			option.setName('message')
				.setDescription('Attach a message to the embed'))

		.setIntegrationTypes("UserInstall")
		.setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel]),
		

	execute: execute
};