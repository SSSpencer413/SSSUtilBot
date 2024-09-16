// Grabs the avatar of a user via context menu

const { ContextMenuCommandBuilder, ApplicationCommandType, InteractionContextType } = require('discord.js');


async function execute(interaction) {
	if (!interaction.isUserContextMenuCommand()) return;

	var user = interaction.targetUser;
	if (!user) user = interaction.user;

	// If the user is in a server, we gotta do a lot more ugh
	if (interaction.inGuild() && !(user.bot)) {
		var member = interaction.targetMember;
		if (!member) member = interaction.member;

		if (member && member.avatar) {
			let avatarImage = member.avatar;
		
			var guildId = interaction.guildId;
			
			if (avatarImage.startsWith("a_")) {
				avatarImage += ".gif";
			} else {
				avatarImage += ".png";
			}
			await interaction.reply({ content: `https://cdn.discordapp.com/guilds/${guildId}/users/${user.id}/avatars/${avatarImage}`, ephemeral: true })
			return;
		}
	}

	await interaction.reply({ content: `${(user.displayAvatarURL())}`, ephemeral: true });
}

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Get Avatar')
		.setType(ApplicationCommandType.User)
		.setIntegrationTypes("UserInstall")
		.setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel]),

	execute: execute
};