// Increments counting game

const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const Milestones = [
	{value: 100, message: ""}, 
	{value: 250, message: "\nYou are all stars! :star:"}, 
	{value: 500, message: "\nTeamwork makes the dream work! :glowing_star:"}, 
	{value: 1000, message: "\nCongratulations everyone! That's a lot of clicks! You all deserve a trophy! :trophy:"}];

async function execute(interaction) {
	var message = interaction.message;
	if (!message) return interaction.reply({ content: `Something went wrong!`, ephemeral: true });

	if (message.author.id == "691014251136942110") return;

	var content = message.content;
	if (!content) return interaction.reply({ content: `Something went wrong!`, ephemeral: true });

	var count = parseInt(message.content.match(/(?<=Current count: )\d+(?=(\n)|$)/)[0]);
	if (count == null) return interaction.reply({ content: `Something went wrong!`, ephemeral: true });

	var user = message.content.match(/(?<=<@)(\d)+(?=>)/g);
	if (user == interaction.user.id) {
		return interaction.reply({ content: `You can't click twice in a row!`, ephemeral: true })
	}

	count = count + 1;

	await interaction.update({ content: `Current count: ${count}\nLast User: <@${interaction.user.id}>`});

	// Messages to celebrate milestones!
	for (var milestone of Milestones) {
		if (count == milestone.value) {
			await interaction.followUp({ content: `<@${interaction.user.id}> has clicked the ${milestone.value}th time! :tada:${milestone.message}`});
			return;
		} else if (count < milestone.value) {
			return;
		}
	}
	// If the count is divisible by 1000, send a message!
	if (count % 1000) {
		await interaction.followUp({ content: `<@${interaction.user.id}> has clicked the ${count}th time! :tada:\nAnother trophy for you! ${":trophy:".repeat(count / 1000)}`});
	}
}

module.exports = {
	customId: "countgame_click",

	execute: execute
};