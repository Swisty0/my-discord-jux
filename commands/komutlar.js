const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'komutlar',
    description: 'Tüm bot komutlarını listeler.',
    async execute(message) {
        const embed = new EmbedBuilder()
           .setDescription('# <:classadam:1544075571116511253> Bot Komut Listesi:')
            .setColor('#2b2d31')
            .setDescription('<a:partimuzik:1544076160445587576> # Aşağıda botta kullanabileceğiniz tüm komutlar kategorilerine göre listelenmiştir:')
            .addFields(
                {
                    name: '## <:moderator:1544076112018280498> Moderasyon Komutları',
                    value: [
                        '<a:32877animatedarrowbluelite:1544079118247796769>` !ban @kullanıcı [sebep]` - Kullanıcıyı yasaklar.',
                        '<a:32877animatedarrowbluelite:1544079118247796769>` !unban <kullanıcı_id>` - Ban kaldırır.',
                        '<a:32877animatedarrowbluelite:1544079118247796769>` !kick @kullanıcı [sebep]` - Kullanıcıyı atar.',
                        '<a:32877animatedarrowbluelite:1544079118247796769>` !timeout @kullanıcı <dk> [sebep]` - Kullanıcıyı susturur.',
                        '<a:32877animatedarrowbluelite:1544079118247796769>` !sil <1-100>` - Mesajları toplu siler..'
                    ].join('\n')
                },
                {
                    name: '## <a:berqdev:1544075507652493432> Yönetim ve Ayarlar',
                    value: [
                        '<a:32877animatedarrowbluelite:1544079118247796769>` !ayarlar` - Mevcut sunucu ayarlarını gösterir.',
                        '<a:32877animatedarrowbluelite:1544079118247796769>` !ayarlar log #kanal` - Log kanalını ayarlar.',
                        '<a:32877animatedarrowbluelite:1544079118247796769>` !ayarlar hosgeldin #kanal` - Hoş geldin kanalını ayarlar.',
                        '<a:32877animatedarrowbluelite:1544079118247796769>` !ayarlar otorol @rol` - Oto-rol belirler.',
                        '<a:32877animatedarrowbluelite:1544079118247796769>` !ticket-kur` - Destek talebi buton panelini kurar.'
                    ].join('\n')
                },
                {
                    name: '## <a:siren:1544077374549925978> Bilgi Komutları',
                    value: [
                        '<a:32877animatedarrowbluelite:1544079118247796769>` !avatar [@kullanıcı]` - Kullanıcının profil resmini gösterir.',
                        '<a:32877animatedarrowbluelite:1544079118247796769>` !kullanici-bilgi [@kullanıcı]` - Kullanıcı detaylarını gösterir.',
                        '<a:32877animatedarrowbluelite:1544079118247796769>` !sunucu-bilgi` - Sunucu istatistiklerini gösterir.',
                        '<a:32877animatedarrowbluelite:1544079118247796769>` !komutlar` - Bu komut listesini gösterir.'
                    ].join('\n')
                }
            )
            .setFooter({ text: 'J U X: ! | Bot Tüm Sistemleri Aktiftir', iconURL: message.client.user.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
