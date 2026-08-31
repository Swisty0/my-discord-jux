const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'avatar',
    description: 'Profil resmini gösterir.',
    async execute(message) {
        const user = message.mentions.users.first() || message.author;
        const embed = new EmbedBuilder()
            .setTitle(`🖼️ ${user.tag} Avatarı`)
            .setColor('#2b2d31')
            .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }));

        message.channel.send({ embeds: [embed] });
    }
};