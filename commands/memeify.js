// Creates a meme, batman

const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const { registerFont, createCanvas, loadImage } = require('canvas')
registerFont("./assets/fonts/impact.ttf", { family: 'Impact' })



// Returns an array of lines and a ctx set to fit the text
function wrapText(ctx, text, maxWidth, maxHeight) {
	let lines = [];
	let words = text.split(" ");

	// Isolate font size
	let fontSize = ctx.font.match(/(\d+(\.\d+)?)(?=px)/);
	if (fontSize) {
		fontSize = parseInt(fontSize[1], 10);
	} else fontSize = 30;

	// 6 will be the minimum font size
	while (fontSize > 6) {
		// Set font size
		ctx.font = ctx.font.replace(/(\d+(\.\d+)?)(?=px)/, fontSize);
		lines = [];
		let currentLine = '';

		// Wrap the text into lines
		for (let word of words) {
			let testLine = currentLine + (currentLine ? ' ' : '') + word;
			// if adding this word is still good, add it to the current line
			if (ctx.measureText(testLine).width <= maxWidth) {
				currentLine = testLine;
			} else {
				// adding this word would cause overflow, create a new line
				lines.push(currentLine);
				currentLine = word;
			}
		}
		lines.push(currentLine); // Add the last line

		// Check if the total height fits
		if ((lines.length) * fontSize <= maxHeight) {
			// Ensure the last line fits
			if (ctx.measureText(currentLine).width <= maxWidth) {
				break; // Found a fitting font size
			}
		}

		fontSize -= 1; // Reduce font size
	}

	// Remove empty values
	lines.forEach((value, index) => {
		if (value == '') {
			lines.splice(index, 1);
		}
	});

	return lines;
}


// Adds a caption to an image on a canvas
const CAPTION_PERCENT = 0.5;
function captionImage(imageCanvas, captionText) {
	// get dimensions of canvas
	const canvasWidth = imageCanvas.width;
	const canvasHeight = imageCanvas.height * (1 + CAPTION_PERCENT);

	// create canvas
	var canvas = createCanvas(canvasWidth, canvasHeight)
	var ctx = canvas.getContext('2d')

	// fill background 10% with white
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvasWidth, imageCanvas.height * CAPTION_PERCENT);

	// Write text
	ctx.fillStyle = "black"
	ctx.textAlign = "center"
	
	let fontSize = imageCanvas.height * CAPTION_PERCENT * 0.5
	ctx.font = `${fontSize}px Impact`

	let lines = wrapText(ctx, captionText, canvasWidth, imageCanvas.height * CAPTION_PERCENT)

	fontSize = ctx.font.match(/(\d+(\.\d+)?)(?=px)/);
	if (fontSize) {
		fontSize = parseInt(fontSize[1], 10);
	} else fontSize = 30;

	// Calculate middle of the y level
	let centerOffset = imageCanvas.height * CAPTION_PERCENT * 0.55 + (imageCanvas.height * CAPTION_PERCENT * 0.05);
	centerOffset = centerOffset - (((lines.length - 1) * fontSize)/2);
	
	// lines are good, font size is good, let's draw!
	for (let i = 0; i < lines.length; i++) {
		ctx.fillText(lines[i], canvasWidth * 0.5, centerOffset + ((i) * fontSize));
	}

	// Draw original image
	ctx.drawImage(imageCanvas, 0, imageCanvas.height * CAPTION_PERCENT)

	return canvas;
}


// Adds top and bottom text to the image
const TOP_PERCENTAGE = 1/3;
const BOTTOM_PERCENTAGE = 1/3;
function addTopBottomText(imageCanvas, topText, bottomText) {
	var canvas = createCanvas(imageCanvas.width, imageCanvas.height);
	var ctx = canvas.getContext('2d');

	ctx.drawImage(imageCanvas, 0, 0);

	ctx.textAlign = "center";
	ctx.fillStyle = "white";
	ctx.strokeStyle = "black";
	ctx.lineWidth = 5;

	// top text gets drawn on the top
	if (topText) {
		let fontSize = canvas.height * TOP_PERCENTAGE * 0.5;
		ctx.font = `${fontSize}px Impact`;

		let lines = wrapText(ctx, topText, canvas.width, canvas.height * TOP_PERCENTAGE);
		fontSize = ctx.font.match(/(\d+(\.\d+)?)(?=px)/);
		if (fontSize) {
			fontSize = parseInt(fontSize[1], 10);
		} else fontSize = 30;

		// If font size is below 12, we need to scale up the image!
		if (fontSize > 12) {
			for (let i = 0; i < lines.length; i++) {
				ctx.strokeText(lines[i], canvas.width * 0.5, (i + 1) * fontSize);
				ctx.fillText(lines[i], canvas.width * 0.5, (i + 1) * fontSize);
			}
		} else {
			let newCanvas = createCanvas(imageCanvas.width * 2, imageCanvas.height * 2);
			let newCtx = newCanvas.getContext('2d');
			newCtx.drawImage(imageCanvas, 0, 0, imageCanvas.width * 2, imageCanvas.height * 2);
			return addTopBottomText(newCanvas, topText, bottomText);
		}
	}

	// bottom text gets drawn on the bottom
	if (bottomText) {
		let fontSize = canvas.height * BOTTOM_PERCENTAGE * 0.5;
		ctx.font = `${fontSize}px Impact`;

		let lines = wrapText(ctx, bottomText, canvas.width, canvas.height * BOTTOM_PERCENTAGE);
		fontSize = ctx.font.match(/(\d+(\.\d+)?)(?=px)/);
		if (fontSize) {
			fontSize = parseInt(fontSize[1], 10);
		} else fontSize = 30;

		// If font size is below 12, we need to scale up the image!
		if (fontSize > 12) {
			for (let i = lines.length - 1; i >= 0; i--) {
				ctx.strokeText(lines[i], canvas.width * 0.5, canvas.height - (fontSize * (lines.length - i - 0.5)));
				ctx.fillText(lines[i], canvas.width * 0.5, canvas.height - (fontSize * (lines.length - i - 0.5)));
			}
		} else {
			let newCanvas = createCanvas(imageCanvas.width * 2, imageCanvas.height * 2);
			let newCtx = newCanvas.getContext('2d');
			newCtx.drawImage(imageCanvas, 0, 0, imageCanvas.width * 2, imageCanvas.height * 2);
			return addTopBottomText(newCanvas, topText, bottomText);
		}
	}

	return canvas;
}

async function execute(interaction) {
	if (!interaction.isChatInputCommand()) return;

	let ephemeral = interaction.options.getBoolean('ephemeral');
	await interaction.deferReply({ ephemeral: ephemeral });

	var imageAttachment = interaction.options.getAttachment('image');
	// Check image type
	let imageType = imageAttachment.contentType;
	if (!imageType || !imageType.startsWith('image')) return interaction.reply({content : "Invalid image", ephemeral : true});

	// create canvas
	var canvas = createCanvas(imageAttachment.width, imageAttachment.height)
	var ctx = canvas.getContext('2d')

	// Draw original image
	let image = await loadImage(imageAttachment.url);
	ctx.drawImage(image, 0, 0);


	// Top/bottom text
	var topText = interaction.options.getString('top-text');
	var bottomText = interaction.options.getString('bottom-text');
	if (topText || bottomText) {
		canvas = addTopBottomText(canvas, topText, bottomText);
	}

	// Caption text
	var captionText = interaction.options.getString('caption');
	if (captionText) {
		canvas = captionImage(canvas, captionText);
	}

	await interaction.editReply({ files: [canvas.toBuffer()] });
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('memeify')
		.setDescription('Create a meme on an image')
		.addAttachmentOption(option => 
			option.setName('image')
				.setDescription('The image to make into meme')
				.setRequired(true))

		
		
		
		/** Memes */

		.addStringOption(option => 
			option.setName('caption')
				.setDescription('The caption of the image (appears as white bit above image)'))
		.addStringOption(option => 
			option.setName('top-text')
				.setDescription('Top text of the image'))
		.addStringOption(option => 
			option.setName('bottom-text')
				.setDescription('Bottom text of the image'))
		

		.addBooleanOption(option => 
			option.setName('ephemeral')
				.setDescription('Whether the response should be ephemeral (defaults to false)'))
		.setIntegrationTypes("UserInstall")
		.setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel]),
		

	execute: execute
};