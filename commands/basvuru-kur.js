const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'basvuru-kur',
    description: 'Yetkili başvuru panelini kurar.',
    async execute(message) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('❌ Bu komutu kullanmak için `Yönetici` yetkisine sahip olmalısın!');
        }

        const embed = new EmbedBuilder()
            .setTitle('📝 Yetkili Başvuru Formu')
            .setColor('#2b2d31')
            .setDescription(
                '# Sunucumuza Yetkili Ekip Arkadaşları Arıyoruz!\n\n' +
                'Aşağıdaki **"Başvuru Yap"** butonuna basarak formu doldurabilir ve yetkili ekibimize katılmak için ilk adımı atabilirsiniz.\n\n' +
                '⚠️ **Kurallar:**\n' +
                '• Yanıltıcı bilgi vermek başvurunuzun reddedilmesine yol açar.\n' +
                '• Lütfen formu eksiksiz ve özenle doldurun.'
            )
            .setFooter({ text: 'J U X Başvuru Sistemi', iconURL: message.client.user.displayAvatarURL() });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('basvuru_form_ac')
                .setLabel('Başvuru Yap')
                .setEmoji('📝')
                .setStyle(ButtonStyle.Success)
        );

        await message.channel.send({ embeds: [embed], components: [row] });
        message.delete().catch(() => {});
    }
};
