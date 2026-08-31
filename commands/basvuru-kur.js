const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'basvuru-kur',
    description: 'Yetkili başvuru panelini kurar.',
    async execute(message) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('❌ Bu komutu kullanmak için `Yönetici` yetkisine sahip olmalısın!');
        }

        const embed = new EmbedBuilder()
            .setTitle('<a:partimuzik:1544076160445587576> Yetkili Başvuru Formu')
            .setColor('#2b2d31')
            .setDescription(
                '# <a:duyuru:1544076380558589982> Sunucumuza Yetkili Ekip Arkadaşları Arıyoruz!\n\n' +
                'Aşağıdaki **"Başvuru Yap"** butonuna basarak formu doldurabilir ve yetkili ekibimize katılmak için ilk adımı atabilirsiniz.\n\n' +
                '<a:hata:1544075791397163018> **Kurallar:**\n' +
                '<a:32877animatedarrowbluelite:1544079118247796769> Yanıltıcı bilgi vermek başvurunuzun reddedilmesine yol açar.\n' +
                '<a:32877animatedarrowbluelite:1544079118247796769> Lütfen formu eksiksiz ve özenle doldurun.'
            )
            .setFooter({ text: 'J U X Başvuru Sistemi', iconURL: message.client.user.displayAvatarURL() });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('basvuru_form_ac')
                .setLabel('Başvuru Yap')
                .setEmoji('<:plus:1544076344927846541>')
                .setStyle(ButtonStyle.Success)
        );

        await message.channel.send({ embeds: [embed], components: [row] });
        message.delete().catch(() => {});
    }
};
