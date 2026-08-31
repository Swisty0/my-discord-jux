const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = async (member) => {
    const db = JSON.parse(fs.readFileSync(path.join(__dirname, '../database.json'), 'utf8'));

    if (db.autoRole) {
        const role = member.guild.roles.cache.get(db.autoRole);
        if (role) await member.roles.add(role).catch(() => {});
    }

    if (db.welcomeChannel) {
        const channel = member.guild.channels.cache.get(db.welcomeChannel);
        if (channel) {
            const embed = new EmbedBuilder()
                .setTitle('👋 Sunucuya Biri Katıldı!')
                .setColor('#00FF00')
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`Hoş geldin ${member}! Seninle birlikte **${member.guild.memberCount}** kişi olduk.`)
                .setTimestamp();

            channel.send({ embeds: [embed] });
        }
    }
};