const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'unban',
    description: 'Kullanıcının banını kaldırır.',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply('❌ Bu komut için yetkiniz yok.');
        }

        const userId = args[0];
        if (!userId) return message.reply('❌ Lütfen banı kaldırılacak kullanıcının ID\'sini girin.');

        try {
            await message.guild.members.unban(userId);
            message.channel.send(`✅ **${userId}** ID'li kullanıcının yasağı kaldırıldı.`);
        } catch (error) {
            message.reply('❌ Bu ID\'ye sahip banlanmış bir kullanıcı bulunamadı.');
        }
    }
};