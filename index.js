// Environmental variables
require('dotenv').config();

// Node modules
const fs = require('node:fs');
const path = require('node:path');

// Require the necessary discord.js classes
const { Client, Events, Collection, GatewayIntentBits } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// Collection of commands inside the client
client.commands = new Collection();

// Collection of buttons
client.buttons = new Collection();

// Iterate through folders, load commands into collection
const commandsFolderPath = path.join(__dirname, 'commands');
const commandFolder = fs.readdirSync(commandsFolderPath);

for (const file of commandFolder) {
	const filePath = path.join(commandsFolderPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Iterate through folders, load commands into collection
const buttonsFolderPath = path.join(__dirname, 'buttons');
const buttonFolder = fs.readdirSync(buttonsFolderPath);

for (const file of buttonFolder) {
	const filePath = path.join(buttonsFolderPath, file);
	const button = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('customId' in button && 'execute' in button) {
		client.buttons.set(button.customId, button);
	} else {
		console.log(`[WARNING] The button at ${filePath} is missing a required "customId" or "execute" property.`);
	}
}


// When the client is ready, run this code (only once).
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Handle interactions
client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isCommand()) {
		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
	
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	} else if (interaction.isButton()) {
		const button = interaction.client.buttons.get(interaction.customId);
		if (!button) {
			console.error(`No button matching ${interaction.customId} was found.`);
			return;
		}

		try {
			await button.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this!', ephemeral: true });
			}
		}
	}
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);