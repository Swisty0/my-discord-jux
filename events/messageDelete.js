const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = async (message) => {
    if (message.author?.bot || !message.guild) return;

    const db = JSON.parse(fs.readFileSync(path.join(__dirname, '../database.json'), 'utf8'));
    if (!db.logChannel) return;

    const logChannel = message.guild.channels.cache.get(db.logChannel);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setTitle('🗑️ Mesaj Silindi')
        .setColor('#FF0000')
        .addFields(
            { name: 'Kullanıcı:', value: `${message.author.tag} (${message.author.id})` },
            { name: 'Kanal:', value: `${message.channel}` },
            { name: 'Silinen Mesaj:', value: message.content || '*İçerik okunamadı*' }
        )
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
};