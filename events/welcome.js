const { EmbedBuilder } = require('discord.js');

function registerWelcomeModule(client) {
    // Karşılama kanalının ID'si
    const channelId = '1549081840839692388'; 

    client.on('guildMemberAdd', async member => {
        try {
            const channel = member.guild.channels.cache.get(channelId);
            if (!channel) return;

            const embed = new EmbedBuilder()
                .setColor('#008000') // Yeşil
                .setTitle('<a:hosgeldin:1546228962412331060> Aramıza Hoş Geldin!')
                .setDescription(
                    `Sunucumuza Hoşgeldin ${member}!\n\n` +
                    `Seninle birlikte **${member.guild.memberCount}** kişi olduk!`
                )
                .setFooter({ text: `${member.guild.name} — Karşılama Sistemi`, iconURL: member.guild.iconURL() })
                .setTimestamp();

            await channel.send({ content: `${member}`, embeds: [embed] });
        } catch (err) {
            console.error('Welcome mesajı gönderilirken hata oluştu:', err);
        }
    });
}

module.exports = { registerWelcomeModule };
