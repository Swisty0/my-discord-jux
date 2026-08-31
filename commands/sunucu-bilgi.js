const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'sunucu-bilgi',
    description: 'Sunucu bilgilerini gösterir.',
    async execute(message) {
        const guild = message.guild;
        const embed = new EmbedBuilder()
            .setTitle(`🏰 ${guild.name} İstatistikleri`)
            .setColor('#2b2d31')
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: 'Sunucu Sahibi', value: `<@${guild.ownerId}>`, inline: true },
                { name: 'Toplam Üye', value: `${guild.memberCount}`, inline: true },
                { name: 'Kanal Sayısı', value: `${guild.channels.cache.size}`, inline: true },
                { name: 'Rol Sayısı', value: `${guild.roles.cache.size}`, inline: true },
                { name: 'Oluşturulma Tarihi', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true }
            );

        message.channel.send({ embeds: [embed] });
    }
};