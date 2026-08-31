const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'timeout',
    description: 'Kullanıcıyı susturur.',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return message.reply('❌ Üyeleri zamana aşımına uğratma yetkiniz yok.');
        }

        const target = message.mentions.members.first();
        const minutes = parseInt(args[1]);
        const reason = args.slice(2).join(' ') || 'Sebep belirtilmedi.';

        if (!target || isNaN(minutes)) {
            return message.reply('❌ Kullanım: `!timeout @kullanıcı <dakika> [sebep]`');
        }

        const duration = minutes * 60 * 1000;
        await target.timeout(duration, reason);
        message.channel.send(`🔇 **${target.user.tag}**, **${minutes}** dakika boyunca susturuldu.`);
    }
};