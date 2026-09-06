const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'komutlar',
    description: 'Tüm bot komutlarını listeler.',
    async execute(message) {
        const embed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setDescription(
                '# <:classadam:1544075571116511253> Bot Komut Listesi:\n' +
                '<a:partimuzik:1544076160445587576> Aşağıda botta kullanabileceğiniz tüm komutlar kategorilerine göre listelenmiştir:\n\n' +
                '## <:moderator:1544076112018280498> Moderasyon Komutları\n' +
                '<a:32877animatedarrowbluelite:1544079118247796769>` !ban @kullanıcı [sebep]` - Kullanıcıyı yasaklar.\n' +
                '<a:32877animatedarrowbluelite:1544079118247796769>` !unban <kullanıcı_id>` - Ban kaldırır.\n' +
                '<a:32877animatedarrowbluelite:1544079118247796769>` !kick @kullanıcı [sebep]` - Kullanıcıyı atar.\n' +
                '<a:32877animatedarrowbluelite:1544079118247796769>` !timeout @kullanıcı <dk> [sebep]` - Kullanıcıyı susturur.\n' +
                '<a:32877animatedarrowbluelite:1544079118247796769>` !sil <1-100>` - Mesajları toplu siler..\n\n' +
                '## <a:berqdev:1544075507652493432> Yönetim ve Ayarlar\n' +
                '<a:32877animatedarrowbluelite:1544079118247796769>` !ayarlar` - Mevcut sunucu ayarlarını gösterir.\n' +
                '<a:32877animatedarrowbluelite:1544079118247796769>` !ayarlar log #kanal` - Log kanalını ayarlar.\n' +
                '<a:32877animatedarrowbluelite:1544079118247796769>` !ayarlar hosgeldin #kanal` - Hoş geldin kanalını ayarlar.\n' +
                '<a:32877animatedarrowbluelite:1544079118247796769>` !ayarlar otorol @rol` - Oto-rol belirler.\n' +
                '<a:32877animatedarrowbluelite:1544079118247796769>` !ticket-kur` - Destek talebi buton panelini kurar.\n\n' +
                '## <a:siren:1544077374549925978> Bilgi Komutları\n' +
                '<a:32877animatedarrowbluelite:1544079118247796769>` !avatar [@kullanıcı]` - Kullanıcının profil resmini gösterir.\n' +
                '<a:32877animatedarrowbluelite:1544079118247796769>` !kullanici-bilgi [@kullanıcı]` - Kullanıcı detaylarını gösterir.\n' +
                '<a:32877animatedarrowbluelite:1544079118247796769>` !sunucu-bilgi` - Sunucu istatistiklerini gösterir.\n' +
                '<a:32877animatedarrowbluelite:1544079118247796769>` !komutlar` - Bu komut listesini gösterir.'
            )
            .setFooter({ text: 'Project Swisty: ! | Bot Tüm Sistemleri Aktiftir', iconURL: message.client.user.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
