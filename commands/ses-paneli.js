const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'ses-paneli',
    description: 'Şık Bot Ses Yönetim Paneli',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('❌ Bu paneli sadece yöneticiler kurabilir!');
        }

        const embed = new EmbedBuilder()
            .setColor('#1e1f22')
            .setTitle('<a:berqdev:1544075507652493432> JUX - Ses Aktifleştirme Merkezi')
            .setDescription(
                '### <a:partimuzik:1544076160445587576> Kesintisiz 7/24 Ses Odası Bağlantısı\n' +
                '---\n' +
                'Aşağıdaki kontrol panelini kullanarak botu dilediğiniz ses kanalına bağlayabilir veya sesten çıkarabilirsiniz.\n\n' +
                '<a:sagaok:1544076213176246422> **Kolay Bağlantı:** Bot Token ve Kanal ID ile hızlı erişim\n' +
                '<a:sagaok:1544076213176246422> **Kesintisiz Yayın:** Düşmeyen 7/24 bağlantı altyapısı\n' +
                '<a:sagaok:1544076213176246422> **Sessiz Mod (Deaf):** Otomatik kulaklık kapatma koruması\n' +
                '---\n' +
                '*Lütfen işlem yaparken doğru Kanal ID kullandığınızdan emin olun.*'
            )
            .setFooter({ text: 'JUX Development • Voice Automation', iconURL: message.guild.iconURL() })
            .setTimestamp();

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('voice_token_sese_sok')
                .setLabel('Sese Sok')
                .setEmoji('<a:strike:1544076316263972885>')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('voice_token_durum')
                .setLabel('Durum')
                .setEmoji('<a:partimuzik:1544076160445587576>')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('voice_token_sesten_cikar')
                .setLabel('Sesten Çıkar')
                .setEmoji('<a:emoji_97:1544076512037314651>')
                .setStyle(ButtonStyle.Danger)
        );

        await message.channel.send({ embeds: [embed], components: [buttons] });
        message.delete().catch(() => {});
    }
};
