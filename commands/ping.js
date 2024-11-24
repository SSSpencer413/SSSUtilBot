// sample command

const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType, EmbedBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
		.setIntegrationTypes("UserInstall")
		.setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel]),
	async execute(interaction) {
		let embed = new EmbedBuilder();
		embed.setDescription("Pong!\n");
		embed.setColor("Aqua");

		let fields = [
			{ name: 'App Permissions', value: "- `" + interaction.appPermissions.toArray().join('`\n- `') + "`", inline: true}
		];

		if (interaction.memberPermissions) {
			fields.push({ name: 'Your Permissions', value: "- `" + interaction.memberPermissions.toArray().join('`, `') + "`", inline: true});
		}

		embed.addFields(fields)

		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};