const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'ses-paneli',
    description: 'Bot Ses Kontrol Panelini kanala kurar.',
    async execute(message, args) {
        const embed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setTitle('<a:partimuzik:1544076160445587576> JUX Ses Yönetim Paneli')
            .setDescription(
                'Aşağıdaki butonları kullanarak botu bulunduğunuz ses kanalına çağırabilirsiniz.\n\n' +
                '<:plus:1544076344927846541> **Beni Ses Kanalına Çağır:** O an bulunduğunuz ses kanalına botu getirir.\n' +
                '<a:emoji_31:1544076690622521386> **Sesten Ayrıl:** Botu ses kanalından çıkarır.'
            )
            .setFooter({ text: 'JUX - Herkes İçin Ses Sistemi' });

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('voice_join_me')
                .setLabel('Beni Ses Kanalına Çağır')
                .setEmoji('🔊')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('voice_leave')
                .setLabel('Sesten Ayrıl')
                .setEmoji('🔇')
                .setStyle(ButtonStyle.Danger)
        );

        await message.channel.send({ embeds: [embed], components: [buttons] });
        message.delete().catch(() => {});
    }
};
