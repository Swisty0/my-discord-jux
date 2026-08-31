const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Kullanıcıyı sunucudan banlar.',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply('❌ Bu komutu kullanmak için **Üyeleri Yasakla** yetkisine sahip olmalısın.');
        }

        const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);
        if (!target) return message.reply('❌ Lütfen banlanacak bir kullanıcı etiketleyin veya geçerli bir ID girin.');

        if (!target.bannable) return message.reply('❌ Bu kullanıcıyı banlayamıyorum. (Yetkim yetersiz veya rolü benden üstte)');

        const reason = args.slice(1).join(' ') || 'Sebep belirtilmedi.';
        await target.ban({ reason });
        message.channel.send(`✅ **${target.user.tag}** sunucudan yasaklandı. Sebep: *${reason}*`);
    }
};