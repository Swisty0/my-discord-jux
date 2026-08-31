const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '../database.json');

module.exports = {
    name: 'ayarlar',
    description: 'Sunucu sistemlerini yapılandırır.',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ Bu komut için **Yönetici** yetkisi gerekiyor.');
        }

        const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        const option = args[0]?.toLowerCase();
        const target = message.mentions.channels.first() || message.mentions.roles.first();

        if (option === 'log' && target) {
            db.logChannel = target.id;
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            return message.reply(`✅ Log kanalı ${target} olarak ayarlandı.`);
        }

        if (option === 'hosgeldin' && target) {
            db.welcomeChannel = target.id;
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            return message.reply(`✅ Hoş geldin kanalı ${target} olarak ayarlandı.`);
        }

        if (option === 'otorol' && target) {
            db.autoRole = target.id;
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            return message.reply(`✅ Oto-Rol ${target} olarak ayarlandı.`);
        }

        const embed = new EmbedBuilder()
            .setTitle('⚙️ Sunucu Ayarları')
            .setColor('#2b2d31')
            .addFields(
                { name: 'Log Kanalı', value: db.logChannel ? `<#${db.logChannel}>` : '`Ayarlanmadı`' },
                { name: 'Hoş Geldin Kanalı', value: db.welcomeChannel ? `<#${db.welcomeChannel}>` : '`Ayarlanmadı`' },
                { name: 'Oto-Rol', value: db.autoRole ? `<@&${db.autoRole}>` : '`Ayarlanmadı`' },
                { name: 'Reklam Engeli', value: db.filterAds ? '🟢 Açık' : '🔴 Kapalı' },
                { name: 'Küfür Engeli', value: db.filterSwear ? '🟢 Açık' : '🔴 Kapalı' }
            )
            .setFooter({ text: 'Kullanım: !ayarlar log #kanal | !ayarlar hosgeldin #kanal | !ayarlar otorol @rol' });

        message.channel.send({ embeds: [embed] });
    }
};