const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'ticket-kur',
    description: 'Bilet oluşturma panelini kurar.',
    async execute(message) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ Bu komut için **Yönetici** yetkisi gereklidir.');
        }

        const embed = new EmbedBuilder()
            .setTitle('<a:partimuzik:1544076160445587576> Destek & Bilet Sistemi')
            .setColor('#2b2d31')
            .setDescription('Bir sorununuz veya talebiniz varsa aşağıdaki **Destek Talebi Aç** butonuna tıklayarak yetkililerimizle özel olarak görüşebilirsiniz.');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('create_ticket')
                .setLabel('Destek Talebi Aç')
                .setEmoji('<a:kylockz_Onay:1544024256986353686>')
                .setStyle(ButtonStyle.Primary)
        );

        await message.channel.send({ embeds: [embed], components: [row] });
        await message.delete().catch(() => {});
    }
};
