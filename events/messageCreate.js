const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database.json');
function getDB() {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

let prefix = '!';
try {
    const config = require('../config.json');
    if (config.prefix) prefix = config.prefix;
} catch {
    prefix = '!';
}

const SWEAR_WORDS = ['amk', 'aq', 'oç', 'piç', 'sik', 'yarrak', 'kahpe'];

module.exports = async (message, client) => {
    if (message.author.bot || !message.guild) return;

    const db = getDB();

    // Reklam Engeli
    if (db.filterAds && !message.member.permissions.has('Administrator')) {
        const inviteRegex = /(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/[a-zA-Z0-9]+/gi;
        if (inviteRegex.test(message.content)) {
            await message.delete().catch(() => {});
            return message.channel.send(`⚠️ ${message.author}, reklam yapmak yasaktır!`).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
        }
    }

    // Küfür Engeli
    if (db.filterSwear && !message.member.permissions.has('Administrator')) {
        const words = message.content.toLowerCase().split(/\s+/);
        if (words.some(w => SWEAR_WORDS.includes(w))) {
            await message.delete().catch(() => {});
            return message.channel.send(`⚠️ ${message.author}, lütfen üslubuna dikkat et!`).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
        }
    }

    // Komut Mantığı
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        message.reply('❌ Komut çalıştırılırken bir hata oluştu!');
    }
};
