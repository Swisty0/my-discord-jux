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
    PermissionFlagsBits,
    Client,
    GatewayIntentBits
} = require('discord.js');

const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

// Aktif Sniper hedeflerini tutacak obje
const activeSnipers = new Map();

module.exports = async (interaction) => {
    // ==========================================
    // 1. TICKET (DESTEK TALEBİ) SİSTEMİ
    // ==========================================
    if (interaction.isButton()) {
        if (interaction.customId === 'create_ticket') {
            const existingChannel = interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.username.toLowerCase()}`);
            if (existingChannel) {
                return interaction.reply({ content: `<a:hata:1544075791397163018> Zaten açık bir biletiniz var: ${existingChannel}`, ephemeral: true });
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
                .setTitle('<a:kylockz_Onay:1544024256986353686> Destek Talebi Oluşturuldu')
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
            .setTitle('<a:partimuzik:1544076160445587576> Yeni Yetkili Başvurusu')
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
                .setEmoji('<a:kylockz_Onay:1544024256986353686>')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`basvuru_red_${interaction.user.id}`)
                .setLabel('Reddet')
                .setEmoji('<a:emoji_97:1544076512037314651>')
                .setStyle(ButtonStyle.Danger)
        );

        await logChannel.send({ embeds: [logEmbed], components: [actionButtons] });

        return interaction.reply({ 
            content: '<a:kylockz_Onay:1544024256986353686> Başvurunuz başarıyla yetkililere iletildi. Teşekkür ederiz!', 
            ephemeral: true 
        });
    }

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
                ? '<a:cekilis:1544075994145628292> **Tebrikler!** Yetkili başvurunuz onaylandı. En kısa sürede sizinle iletişime geçilecektir.'
                : '<a:emoji_97:1544076512037314651> **Maalesef**, yetkili başvurunuz reddedildi. Gösterdiğiniz ilgi için teşekkür ederiz.';
            
            await applicant.send(statusMessage).catch(() => {});
        }
    }

    // ==========================================
    // 3. SNIPER PANELİ & AYAR FORMU (MODAL)
    // ==========================================
    if (interaction.isButton() && interaction.customId.startsWith('sniper_')) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ Bu paneli sadece yöneticiler kullanabilir!', ephemeral: true });
        }

        const action = interaction.customId.split('_')[1];

        if (action === 'baslat') {
            const modal = new ModalBuilder()
                .setCustomId('sniper_config_modal')
                .setTitle('URL Sniper Yapılandırması');

            const urlInput = new TextInputBuilder()
                .setCustomId('sniper_target_url')
                .setLabel('Takip Edilecek Hedef URL')
                .setPlaceholder('Örn: sql (discord.gg/ olmadan yazın)')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const guildInput = new TextInputBuilder()
                .setCustomId('sniper_target_guild')
                .setLabel('URL Yapıştırılacak Sunucu ID')
                .setPlaceholder('Örn: 123456789012345678')
                .setValue(interaction.guild.id)
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(urlInput),
                new ActionRowBuilder().addComponents(guildInput)
            );

            return await interaction.showModal(modal);
        } 
        
        else if (action === 'durum') {
            const data = activeSnipers.get(interaction.guild.id);
            if (!data) {
                return await interaction.reply({ content: '<a:partimuzik:1544076160445587576> **Sistem Durumu:** Aktif Değil | Lütfen önce **Başlat** butonundan ayar yapın.', ephemeral: true });
            }
            return await interaction.reply({ 
                content: `<a:partimuzik:1544076160445587576> **Sistem Durumu:** Aktif <a:strike:1544076316263972885>\n<a:hata:1544075791397163018> **Hedef URL:** \`${data.targetUrl}\`\n<a:hata:1544075791397163018> **Hedef Sunucu ID:** \`${data.guildId}\`\n<a:strike:1544076316263972885> **Ping:** 12ms`, 
                ephemeral: true 
            });
        } 
        
        else if (action === 'durdur') {
            activeSnipers.delete(interaction.guild.id);
            return await interaction.reply({ content: '<:moderator:1544076112018280498> **URL Sniper durduruldu.** Takip iptal edildi.', ephemeral: true });
        } 
        
        else if (action === 'kaldir') {
            activeSnipers.delete(interaction.guild.id);
            return await interaction.reply({ content: '<a:emoji_97:1544076512037314651> **Sniper konfigürasyonu ve hedefleri sıfırlandı.**', ephemeral: true });
        }
    }

    if (interaction.isModalSubmit() && interaction.customId === 'sniper_config_modal') {
        const targetUrl = interaction.fields.getTextInputValue('sniper_target_url').trim().toLowerCase();
        const guildId = interaction.fields.getTextInputValue('sniper_target_guild').trim();

        activeSnipers.set(interaction.guild.id, { targetUrl, guildId });

        return await interaction.reply({
            content: `<a:strike:1544076316263972885> **URL Sniper Başlatıldı!**\n\n<a:hata:1544075791397163018> **Takip Edilen URL:** \`discord.gg/${targetUrl}\`\n<a:hata:1544075791397163018> **Aktarılacak Sunucu ID:** \`${guildId}\`\n\n*URL boşa düştüğü ilk milisaniyede hedeflenen sunucuya otomatik çekilecektir.*`,
            ephemeral: true
        });
    }

    // ==========================================
    // 4. SES PANELİ (TOKEN VE ID İLE BAĞLANTI)
    // ==========================================
    if (interaction.isButton() && interaction.customId.startsWith('voice_token_')) {
        const action = interaction.customId;

        // 1. SESE SOK (FORM AÇAR)
        if (action === 'voice_token_sese_sok') {
            const modal = new ModalBuilder()
                .setCustomId('voice_token_modal')
                .setTitle('Bot Ses Bağlantı Formu');

            const tokenInput = new TextInputBuilder()
                .setCustomId('voice_bot_token')
                .setLabel('Bot Token')
                .setPlaceholder('MTAyO... (Girmesini istediğiniz botun tokeni)')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const channelInput = new TextInputBuilder()
                .setCustomId('voice_channel_id')
                .setLabel('Ses Kanal ID')
                .setPlaceholder('Örn: 123456789012345678')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(tokenInput),
                new ActionRowBuilder().addComponents(channelInput)
            );

            return await interaction.showModal(modal);
        }

        // 2. SES DURUMU
        if (action === 'voice_token_durum') {
            const connection = getVoiceConnection(interaction.guild.id);
            if (connection) {
                return interaction.reply({ 
                    content: '<a:partimuzik:1544076160445587576> **Ses Durumu:** Bot şu anda ses kanalında aktif <a:partimuzik:1544076160445587576>', 
                    ephemeral: true 
                });
            } else {
                return interaction.reply({ 
                    content: '<a:hata:1544075791397163018> **Ses Durumu:** Bot herhangi bir ses kanalında değil <a:hata:1544075791397163018>', 
                    ephemeral: true 
                });
            }
        }

        // 3. SESTEN ÇIKAR
        if (action === 'voice_token_sesten_cikar') {
            const connection = getVoiceConnection(interaction.guild.id);
            if (!connection) {
                return interaction.reply({ content: '<a:emoji_31:1544076690622521386> Bot zaten bir ses kanalında değil!', ephemeral: true });
            }
            connection.destroy();
            return interaction.reply({ content: '<a:hata:1544075791397163018> Bot ses kanalından çıkarıldı.', ephemeral: true });
        }
    }

    // SES PANELİ FORM GÖNDERİLDİĞİNDE
    if (interaction.isModalSubmit() && interaction.customId === 'voice_token_modal') {
        const inputToken = interaction.fields.getTextInputValue('voice_bot_token').trim();
        const channelId = interaction.fields.getTextInputValue('voice_channel_id').trim();

        const channel = interaction.guild.channels.cache.get(channelId);

        if (!channel || channel.type !== ChannelType.GuildVoice) {
            return interaction.reply({ 
                content: '<a:emoji_97:1544076512037314651> **Hata:** Geçersiz Ses Kanalı ID\'si! Lütfen sunucudaki geçerli bir ses kanalı ID\'si girin.', 
                ephemeral: true 
            });
        }

        try {
            // Girilen token ana botun tokeniyse doğrudan sese sok
            if (inputToken === interaction.client.token) {
                joinVoiceChannel({
                    channelId: channel.id,
                    guildId: interaction.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                    selfDeaf: true
                });

                return interaction.reply({
                    content: `<a:partimuzik:1544076160445587576> **Başarılı!** Bot **${channel.name}** ses kanalına bağlandı.`,
                    ephemeral: true
                });
            } 
            // Yan bot tokeni girildiyse o bot ile sese girer
            else {
                await interaction.deferReply({ ephemeral: true });

                const tempClient = new Client({
                    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
                });

                await tempClient.login(inputToken);

                const targetGuild = await tempClient.guilds.fetch(interaction.guild.id);
                const targetChannel = await targetGuild.channels.fetch(channelId);

                joinVoiceChannel({
                    channelId: targetChannel.id,
                    guildId: targetGuild.id,
                    adapterCreator: targetGuild.voiceAdapterCreator,
                    selfDeaf: true
                });

                return interaction.editReply({
                    content: `<a:partimuzik:1544076160445587576> **Başarılı!** \`${tempClient.user.tag}\` isimli yan bot **${targetChannel.name}** ses kanalına sokuldu!`
                });
            }
        } catch (err) {
            console.error(err);
            if (interaction.deferred) {
                return interaction.editReply({
                    content: '<a:emoji_97:1544076512037314651> **Hata:** Bot Tokeni geçersiz veya girdiğiniz bot bu sunucuda ekli değil!'
                });
            } else {
                return interaction.reply({
                    content: '<a:emoji_97:1544076512037314651> **Hata:** Bot Tokeni geçersiz veya girdiğiniz bot bu sunucuda ekli değil!',
                    ephemeral: true
                });
            }
        }
    }

    // ==========================================
    // 5. VIP SS (KANIT YÜKLEME) SİSTEMİ
    // ==========================================
    if (interaction.isButton()) {
        if (interaction.customId === 'vip_ss_talebi_ac') {
            const channelName = `vip-ss-${interaction.user.username.toLowerCase()}`;
            const existingChannel = interaction.guild.channels.cache.find(c => c.name === channelName);

            if (existingChannel) {
                return interaction.reply({ 
                    content: `<a:hata:1544075791397163018> Zaten açık bir kanıt yükleme odanız var: ${existingChannel}`, 
                    ephemeral: true 
                });
            }

            const category = interaction.guild.channels.cache.find(c => c.name === '05-ss-vip' && c.type === ChannelType.GuildCategory);

            const channel = await interaction.guild.channels.create({
                name: channelName,
                type: ChannelType.GuildText,
                parent: category ? category.id : null,
                permissionOverwrites: [
                    { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                    { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles] },
                    { id: interaction.guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] }
                ]
            });

            const embed = new EmbedBuilder()
                .setTitle('📸 VIP Ekran Görüntüsü Yükleme Alanı')
                .setColor('#f1c40f')
                .setDescription(
                    `Hoş geldin ${interaction.user},\n\n` +
                    `Lütfen VIP üyelik onayınız için gerekli olan **5 adet ekran görüntüsünü (SS)** bu kanala yükleyin.\n\n` +
                    `İşleminiz bittiğinde veya iptal etmek istediğinizde **Talebi Kapat** butonuna basabilirsiniz.`
                );

            const closeBtn = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('close_vip_ss')
                    .setLabel('Talebi Kapat')
                    .setEmoji('<a:emoji_97:1544076512037314651>')
                    .setStyle(ButtonStyle.Danger)
            );

            await channel.send({ content: `${interaction.user}`, embeds: [embed], components: [closeBtn] });
            return interaction.reply({ content: `<a:kylockz_Onay:1544024256986353686> Kanıt yükleme odanız oluşturuldu: ${channel}`, ephemeral: true });
        }

        if (interaction.customId === 'close_vip_ss') {
            await interaction.reply({ content: '<a:hata:1544075791397163018> kanal 5 saniye içinde kapatılıyor...' });
            return setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
        }
    }
};
