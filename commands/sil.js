const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'sil',
    description: 'Mesajları toplu siler.',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply('❌ Mesajları yönetme yetkiniz yok.');
        }

        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount < 1 || amount > 100) {
            return message.reply('❌ Lütfen 1 ile 100 arasında bir sayı girin.');
        }

        await message.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            message.channel.send('❌ 14 günden eski mesajlar silinemez.');
        });

        const msg = await message.channel.send(`🧹 **${amount}** adet mesaj temizlendi.`);
        setTimeout(() => msg.delete().catch(() => {}), 3000);
    }
};