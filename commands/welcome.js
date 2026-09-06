const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = async (member) => {
    // 1. Hoş geldin mesajının gideceği kanalı bul (Kanal adını sunucuna göre değiştirebilirsin)
    const welcomeChannel = member.guild.channels.cache.find(c => c.name === 'hoşgeldiniz' || c.name === 'welcome');
    
    // Kanal yoksa hata vermemesi için işlemi durdur
    if (!welcomeChannel) return;

    // 2. Sunucudaki toplam üye sayısı ve hesap oluşturulma tarihi
    const memberCount = member.guild.memberCount;
    const accountCreated = `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`;

    // 3. Karşılama Embed'i
    const welcomeEmbed = new EmbedBuilder()
        .setTitle(`<a:hosgeldin:1546228962412331060> Aramıza Katıldı,`)
        .setDescription(
            `<:classadam:1546229584226160750> **Kullanıcı:** ${member} (\`${member.user.tag}\`)\n` +
            `<a:manabar:1546229829148352633> **Seninle Birlikte:** **${memberCount}** Kişiyiz!\n\n` +
            `*Lütfen kurallar kanalını okumayı ve rollerini almayı unutma!*`
        )
        .setColor('#2b2d31')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
        .setImage('https://media.discordapp.net/attachments/100000000000000000/welcome-banner.gif') // İsteğe bağlı alt görsel URL'si
        .setFooter({ text: `${member.guild.name} • Hoş Geldin!`, iconURL: member.guild.iconURL() })
        .setTimestamp();

    // 4. Hızlı Erişim Butonları (İsteğe Bağlı)
    const rulesButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel('Kurallar')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://discord.com/channels/${member.guild.id}`) // Varsa kurallar kanal linkin
    );

    // 5. Mesajı kanala gönder
    try {
        await welcomeChannel.send({
            content: `Hey ${member}, Aramıza Katıldı! `,
            embeds: [welcomeEmbed]
        });
    } catch (error) {
        console.error('Hoş geldin mesajı gönderilirken bir hata oluştu:', error);
    }
};
