// SupportBot 6.0, Created by Emerald Services
// Suggest Command

const Discord = require("discord.js");
const fs = require("fs");

const yaml = require('js-yaml');
const supportbot = yaml.load(fs.readFileSync('./supportbot-config.yml', 'utf8'));

module.exports = {
    name: supportbot.SuggestCommand,
    description: supportbot.SuggestionDesc,

    execute(message, args) {
        let locateChannel = message.guild.channels.cache.find(SuggestionChannel => SuggestionChannel.name === supportbot.SuggestionChannel);

        const errornochannel = new Discord.MessageEmbed()
            .setTitle("Invalid Channel")
            .setDescription(`${supportbot.InvalidChannel}\n\nChannel Required: \`${supportbot.SuggestionChannel}\``)
            .setColor(supportbot.ErrorColour);

        if(!locateChannel) return message.channel.send({ embed: errornochannel });

        const embed = new Discord.MessageEmbed()
            .setDescription(`> **${supportbot.SuggestionStarter}**`)
	        .setColor(supportbot.EmbedColour)
        message.channel.send({ embed: embed });

        let suggestion = []
        message.channel.awaitMessages(response => response.content.length > 2, {
            max: 1,
            time: 500000,
            errors: ['time'],
        }).then((collected) => {
            suggestion.push(collected.map(r => r.content));

            const SuggestionMessage = new Discord.MessageEmbed()
                .setColor(supportbot.EmbedColour)
                .setFooter(supportbot.EmbedFooter)

                .setTitle(supportbot.SuggestionTitle)
                .setDescription(`\`\`\`${suggestion}\`\`\``)

                .addFields( { name: "From", value: `<@${message.author.id}>`, inline: false }, )

            locateChannel.send({ embed: SuggestionMessage }).then(async function(msg) {
                msg.react(supportbot.SuggestReact_1).then(() => msg.react(supportbot.SuggestReact_2));
            });

            const SuggestionComplete = new Discord.MessageEmbed()
                .setColor(supportbot.SuccessColour)
                .setDescription(`:white_check_mark: Your suggestion has been successfully created. <#${locateChannel.id}>`)
            message.channel.send({ embed: SuggestionComplete })

        });
    
    }
};