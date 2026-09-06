const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'sniper',
    description: 'URL Sniper panelini kurar.',
    async execute(message) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('❌ Bu komutu kullanmak için `Yönetici` yetkisine sahip olmalısın!');
        }

        const embed = new EmbedBuilder()
            .setColor('#111113')
            .setDescription(
                '# <a:strike:1544076316263972885> Project Swisty Sniper Sistemi\n' +
                '---\n' +
                '### <a:strike:1544076316263972885> Güvenli & Ultra Hızlı\n\n' +
                '<a:sagaok:1544076213176246422> Discord API Limit Uyumlu\n' +
                '<a:sagaok:1544076213176246422> Modern Container Arayüzü\n' +
                '<a:sagaok:1544076213176246422> Optimize Edilmiş Claimer\n' +
                '<a:sagaok:1544076213176246422> 7/24 Kesintisiz URL Takibi\n\n' +
                '### <a:strike:1544076316263972885> Sniper Özellikleri\n\n' +
                '<a:sagaok:1544076213176246422> **Hızlı Claim:** Mili saniyeler içinde URL çekimi\n' +
                '<a:sagaok:1544076213176246422> **Çoklu Hesap:** Aynı anda birden fazla token\n' +
                '<a:sagaok:1544076213176246422> **MFA Desteği:** 2FA korumalı hesap uyumluluğu\n' +
                '<a:sagaok:1544076213176246422> **Akıllı Log:** Deneme ve başarı raporları\n' +
                '---\n' +
                '### <a:strike:1544076316263972885> Otomasyon & Guard\n\n' +
                '<a:sagaok:1544076213176246422> Otomatik Sunucu URL Takibi\n' +
                '<a:sagaok:1544076213176246422> Guard Modu ile URL Koruma\n' +
                '<a:sagaok:1544076213176246422> Hata Algılama Sistemi\n' +
                '<a:sagaok:1544076213176246422> Otomatik Yeniden Bağlanma\n' +
                '---\n' +
                'discord.gg/Project Swisty'
            );

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('sniper_baslat')
                .setLabel('Başlat')
                .setEmoji('<a:strike:1544076316263972885>')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('sniper_durum')
                .setLabel('Durum')
                .setEmoji('<a:partimuzik:1544076160445587576>')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('sniper_durdur')
                .setLabel('Durdur')
                .setEmoji('<:moderator:1544076112018280498>')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('sniper_kaldir')
                .setLabel('Kaldır')
                .setEmoji('<a:emoji_97:1544076512037314651>')
                .setStyle(ButtonStyle.Secondary)
        );

        await message.channel.send({ embeds: [embed], components: [buttons] });
        message.delete().catch(() => {});
    }
};
