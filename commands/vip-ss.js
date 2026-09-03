const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'vip-ss',
    description: 'VIP Ss Doğrulama Paneli',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('❌ Bu paneli sadece yöneticiler kurabilir!');
        }

        const embed = new EmbedBuilder()
            .setColor('#22f10f')
            .setTitle('<a:strike:1544076316263972885> 05-SS DOĞRULAMA')
            .setDescription(
                '-------------------------------------------------------------------------------------\n' +
                '<a:sagaok:1544076213176246422>VIP Kanallara Ulaşmak için Ekran Görüntülerinizi İletmeniz Gerekmektedir.\n\n' +
                '# <:classadam:1544075571116511253> **Nasıl Çalışır?**\n\n' +
                
                '<a:sagaok:1544076213176246422> Aşağıdaki **` Kanıt Yükle`** butonuna basın.\n' +
                '<a:sagaok:1544076213176246422> Sadece sizin ve yetkililerin görebileceği özel bir oda açılacaktır.\n' +
                '<a:sagaok:1544076213176246422> Açılan odaya **en az / en fazla 5 adet** ekran görüntüsü yükleyin.\n' +
                '-------------------------------------------------------------------------------------\n' +
                '*Yetkililerimiz fotoğrafları inceleyip VIP rolünüzü en kısa sürede tanımlayacaktır.*'
            )
            .setFooter({ text: 'VIP Verification System', iconURL: message.guild.iconURL() })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('vip_ss_talebi_ac')
                .setLabel('Kanıt Yükle')
                .setEmoji('<:plus:1544076344927846541>')
                .setStyle(ButtonStyle.Success)
        );

        await message.channel.send({ embeds: [embed], components: [row] });
        message.delete().catch(() => {});
    }
};
