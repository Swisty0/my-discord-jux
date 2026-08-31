const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'komutlar',
    description: 'Tüm bot komutlarını listeler.',
    async execute(message) {
        const embed = new EmbedBuilder()
            .setTitle('📜 Bot Komut Listesi')
            .setColor('#2b2d31')
            .setDescription('<a:coding:1544006660857528430> Aşağıda botta kullanabileceğiniz tüm komutlar kategorilerine göre listelenmiştir:')
            .addFields(
                {
                    name: '🛡️ Moderasyon Komutları',
                    value: [
                        '`!ban @kullanıcı [sebep]` - Kullanıcıyı yasaklar.',
                        '`!unban <kullanıcı_id>` - Ban kaldırır.',
                        '`!kick @kullanıcı [sebep]` - Kullanıcıyı atar.',
                        '`!timeout @kullanıcı <dk> [sebep]` - Kullanıcıyı susturur.',
                        '`!sil <1-100>` - Mesajları toplu siler.'
                    ].join('\n')
                },
                {
                    name: '⚙️ Yönetim ve Ayarlar',
                    value: [
                        '`!ayarlar` - Mevcut sunucu ayarlarını gösterir.',
                        '`!ayarlar log #kanal` - Log kanalını ayarlar.',
                        '`!ayarlar hosgeldin #kanal` - Hoş geldin kanalını ayarlar.',
                        '`!ayarlar otorol @rol` - Oto-rol belirler.',
                        '`!ticket-kur` - Destek talebi buton panelini kurar.'
                    ].join('\n')
                },
                {
                    name: 'ℹ️ Bilgi Komutları',
                    value: [
                        '`!avatar [@kullanıcı]` - Kullanıcının profil resmini gösterir.',
                        '`!kullanici-bilgi [@kullanıcı]` - Kullanıcı detaylarını gösterir.',
                        '`!sunucu-bilgi` - Sunucu istatistiklerini gösterir.',
                        '`!komutlar` - Bu komut listesini gösterir.'
                    ].join('\n')
                }
            )
            .setFooter({ text: 'Prefix: ! | Bot Tüm Sistemleri Aktiftir', iconURL: message.client.user.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};