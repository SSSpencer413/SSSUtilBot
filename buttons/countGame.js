// Increments counting game

const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const Milestones = [100, 200, 500, 1000];

async function execute(interaction) {
	var message = interaction.message;
	if (!message) return interaction.reply({ content: `Something went wrong!`, ephemeral: true });

	var content = message.content;
	if (!content) return interaction.reply({ content: `Something went wrong!`, ephemeral: true });

	var count = parseInt(message.content.match(/\d(\d)*/)[0]);
	if (count == null) return interaction.reply({ content: `Something went wrong!`, ephemeral: true });

	var user = message.content.match(/(?!<@)\d(\d)*(?=>)/g);
	
	if (user == interaction.user.id) {
		return interaction.reply({ content: `You can't click twice in a row!`, ephemeral: true })
	}

	count = count + 1;

	await interaction.update({ content: `Current count: ${count}\nLast User: <@${interaction.user.id}>`});

	// Messages to celebrate milestones!
	for (var milestone of Milestones) {
		if (count == milestone) {
			await interaction.followUp({ content: `<@${interaction.user.id}> has clicked the ${milestone}th time! :tada:`});
			return;
		} else if (count < milestone) {
			break;
		}
	}
}

module.exports = {
	customId: "countgame_click",

	execute: execute
};