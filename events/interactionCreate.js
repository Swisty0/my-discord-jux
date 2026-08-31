const { 
    ChannelType, 
    PermissionsBitField, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    PermissionFlagsBits
} = require('discord.js');

module.exports = async (interaction) => {
    // ==========================================
    // 1. TICKET (DESTEK TALEBİ) SİSTEMİ
    // ==========================================
    if (interaction.isButton()) {
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
            return interaction.reply({ content: `✅ Destek kanalınız oluşturuldu: ${channel}`, ephemeral: true });
        }

        if (interaction.customId === 'close_ticket') {
            await interaction.reply({ content: '🔒 Bilet 5 saniye içinde kapatılıyor...' });
            return setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
        }
    }

    // ==========================================
    // 2. YETKİLİ BAŞVURU SİSTEMİ
    // ==========================================
    
    // A. Formu Açma Butonu
    if (interaction.isButton() && interaction.customId === 'basvuru_form_ac') {
        const modal = new ModalBuilder()
            .setCustomId('basvuru_modal')
            .setTitle('Yetkili Başvuru Formu');

        const nameInput = new TextInputBuilder()
            .setCustomId('basvuru_isim_yas')
            .setLabel('İsminiz ve Yaşınız')
            .setPlaceholder('Örn: Ahmet, 17')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const activeInput = new TextInputBuilder()
            .setCustomId('basvuru_aktiflik')
            .setLabel('Günde Kaç Saat Aktifsiniz?')
            .setPlaceholder('Örn: 4-6 saat')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const expInput = new TextInputBuilder()
            .setCustomId('basvuru_tecrube')
            .setLabel('Daha Önce Yetkili Oldunuz Mu? (Tecrübe)')
            .setPlaceholder('Örnek sunucular veya tecrübeleriniz...')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const reasonInput = new TextInputBuilder()
            .setCustomId('basvuru_neden')
            .setLabel('Neden Seni Seçmeliyiz?')
            .setPlaceholder('Sunucuya ne gibi katkıların olabilir?')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(nameInput),
            new ActionRowBuilder().addComponents(activeInput),
            new ActionRowBuilder().addComponents(expInput),
            new ActionRowBuilder().addComponents(reasonInput)
        );

        return await interaction.showModal(modal);
    }

    // B. Form Gönderildiğinde Log Kanalına Mesaj Atma
    if (interaction.isModalSubmit() && interaction.customId === 'basvuru_modal') {
        const isimYas = interaction.fields.getTextInputValue('basvuru_isim_yas');
        const aktiflik = interaction.fields.getTextInputValue('basvuru_aktiflik');
        const tecrube = interaction.fields.getTextInputValue('basvuru_tecrube');
        const neden = interaction.fields.getTextInputValue('basvuru_neden');

        const logChannel = interaction.guild.channels.cache.find(c => c.name === 'basvuru-log');

        if (!logChannel) {
            return interaction.reply({ 
                content: '❌ `basvuru-log` kanalı bulunamadı! Lütfen yöneticiye bildirin.', 
                ephemeral: true 
            });
        }

        const logEmbed = new EmbedBuilder()
            .setTitle('📥 Yeni Yetkili Başvurusu')
            .setColor('#e67e22')
            .setThumbnail(interaction.user.displayAvatarURL())
            .addFields(
                { name: '👤 Başvuran Kullanıcı', value: `${interaction.user} (${interaction.user.tag})`, inline: true },
                { name: '🆔 Kullanıcı ID', value: `\`${interaction.user.id}\``, inline: true },
                { name: '📝 İsim ve Yaş', value: isimYas },
                { name: '⏰ Günlük Aktiflik', value: aktiflik },
                { name: '📜 Tecrübe', value: tecrube },
                { name: '💡 Neden O?', value: neden }
            )
            .setTimestamp();

        const actionButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`basvuru_onay_${interaction.user.id}`)
                .setLabel('Onayla')
                .setEmoji('✅')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`basvuru_red_${interaction.user.id}`)
                .setLabel('Reddet')
                .setEmoji('❌')
                .setStyle(ButtonStyle.Danger)
        );

        await logChannel.send({ embeds: [logEmbed], components: [actionButtons] });

        return interaction.reply({ 
            content: '✅ Başvurunuz başarıyla yetkililere iletildi. Teşekkür ederiz!', 
            ephemeral: true 
        });
    }

    // C. Yetkili Onay/Red Butonları
    if (interaction.isButton() && (interaction.customId.startsWith('basvuru_onay_') || interaction.customId.startsWith('basvuru_red_'))) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ Bu işlemi sadece yöneticiler yapabilir!', ephemeral: true });
        }

        const isApprove = interaction.customId.startsWith('basvuru_onay_');
        const userId = interaction.customId.split('_')[2];
        const applicant = await interaction.guild.members.fetch(userId).catch(() => null);

        const oldEmbed = interaction.message.embeds[0];
        const updatedEmbed = EmbedBuilder.from(oldEmbed)
            .setColor(isApprove ? '#2ecc71' : '#e74c3c')
            .setFooter({ text: `İşlem Yapan Yetkili: ${interaction.user.tag}` });

        const disabledRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('disabled_status')
                .setLabel(isApprove ? 'ONAYLANDI' : 'REDDEDİLDİ')
                .setStyle(isApprove ? ButtonStyle.Success : ButtonStyle.Danger)
                .setDisabled(true)
        );

        await interaction.update({ embeds: [updatedEmbed], components: [disabledRow] });

        if (applicant) {
            const statusMessage = isApprove
                ? '🎉 **Tebrikler!** Yetkili başvurunuz onaylandı. En kısa sürede sizinle iletişime geçilecektir.'
                : '❌ **Maalesef**, yetkili başvurunuz reddedildi. Gösterdiğiniz ilgi için teşekkür ederiz.';
            
            await applicant.send(statusMessage).catch(() => {});
        }
    }
};
