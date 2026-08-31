const { ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'create_ticket') {
        const existingChannel = interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.username.toLowerCase()}`);
        if (existingChannel) {
            return interaction.reply({ content: `❌ Zaten açık bir biletiniz var: ${existingChannel}`, ephemeral: true });
        }

        const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                { id: interaction.guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] }
            ]
        });

        const embed = new EmbedBuilder()
            .setTitle('🎫 Destek Talebi Oluşturuldu')
            .setColor('#2b2d31')
            .setDescription(`Merhaba ${interaction.user}, yetkililer en kısa sürede sizinle ilgilenecektir.\nBileti kapatmak için **Bileti Kapat** butonuna basabilirsiniz.`);

        const closeBtn = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('close_ticket').setLabel('Bileti Kapat').setEmoji('🔒').setStyle(ButtonStyle.Danger)
        );

        await channel.send({ content: `${interaction.user}`, embeds: [embed], components: [closeBtn] });
        await interaction.reply({ content: `✅ Destek kanalınız oluşturuldu: ${channel}`, ephemeral: true });
    }

    if (interaction.customId === 'close_ticket') {
        await interaction.reply({ content: '🔒 Bilet 5 saniye içinde kapatılıyor...' });
        setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
    }
};