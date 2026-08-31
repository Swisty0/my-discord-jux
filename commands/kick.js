const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kullanıcıyı sunucudan atar.',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply('❌ Bu komut için **Üyeleri At** yetkisi gerekiyor.');
        }

        const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);
        if (!target) return message.reply('❌ Atılacak kullanıcıyı etiketleyin veya ID girin.');

        if (!target.kickable) return message.reply('❌ Bu kullanıcı sunucudan atılamıyor.');

        const reason = args.slice(1).join(' ') || 'Sebep belirtilmedi.';
        await target.kick(reason);
        message.channel.send(`✅ **${target.user.tag}** sunucudan atıldı. Sebep: *${reason}*`);
    }
};