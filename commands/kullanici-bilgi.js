const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'kullanici-bilgi',
    description: 'Kullanıcı bilgilerini gösterir.',
    async execute(message) {
        const member = message.mentions.members.first() || message.member;
        const embed = new EmbedBuilder()
            .setTitle(`👤 ${member.user.tag} Bilgileri`)
            .setColor('#2b2d31')
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'Kullanıcı ID', value: member.id, inline: true },
                { name: 'Hesap Oluşturma', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: 'Sunucuya Katılım', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: 'Roller', value: member.roles.cache.map(r => r).join(' ') || 'Rol Yok' }
            );

        message.channel.send({ embeds: [embed] });
    }
};