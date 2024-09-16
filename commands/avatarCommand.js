// Grabs the avatar of a user

const { SlashCommandBuilder, InteractionContextType } = require('discord.js');


async function execute(interaction) {
	if (!interaction.isChatInputCommand()) return;

	var ephemeral = interaction.options.getBoolean('ephemeral');
	var server = interaction.options.getBoolean('server');
	var user = interaction.options.getUser('user');
	if (!user) user = interaction.user;
	
	// If the user is in a server, we gotta do a lot more ugh
	if (server || server == null) {
		var member = interaction.options.getMember('user');
		if (!member) member = interaction.member;

		if (member && member.avatar) {
			let avatarImage = member.avatar;
		
			var guildId = interaction.guildId;
			
			if (avatarImage.startsWith("a_")) {
				avatarImage += ".gif";
			} else {
				avatarImage += ".png";
			}
			await interaction.reply({ content: `https://cdn.discordapp.com/guilds/${guildId}/users/${user.id}/avatars/${avatarImage}`, ephemeral: ephemeral })
			return;
		}
	}

	await interaction.reply({ content: `${(user.displayAvatarURL())}`, ephemeral: ephemeral });
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Grab the avatar of a user')
		.addUserOption(option => 
			option.setName('user')
				.setDescription('The user take the avatar of (defaults to you)'))
		.addBooleanOption(option => 
			option.setName('ephemeral')
				.setDescription('Whether the response should be ephemeral (defaults to false)'))
		.addBooleanOption(option => 
			option.setName('server')
				.setDescription('Whether to use the server avatar (defaults to true)'))
		.setIntegrationTypes("UserInstall")
		.setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel]),
		

	execute: execute
};