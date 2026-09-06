const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');
const express = require('express');

// Express Web Sunucusu (Render 7/24 Aktiflik)
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot 7/24 Aktif!'));
app.listen(port, () => console.log(`Web sunucusu ${port} portunda çalışıyor.`));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,      // Hoş geldin (guildMemberAdd) için gerekli
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildVoiceStates   // Ses paneli bağlantıları için gerekli
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.commands = new Collection();

// Komut Yükleyici
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        // Yalnızca geçerli komut objelerini koleksiyona ekler
        if (command && command.name) {
            client.commands.set(command.name, command);
        }
    }
}

// Event Yükleyici (events/ klasöründeki dosyaları yükler)
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(path.join(eventsPath, file));
        const eventName = file.split('.')[0];
        
        // Eğer modül fonksiyon olarak dışa aktarılmışsa bağla
        if (typeof event === 'function') {
            client.on(eventName, (...args) => event(...args, client));
        }
    }
}

// Welcome Modülünü Bağlama
const welcomePath = path.join(__dirname, 'events', 'welcome.js');
if (fs.existsSync(welcomePath)) {
    const { registerWelcomeModule } = require(welcomePath);
    if (typeof registerWelcomeModule === 'function') {
        registerWelcomeModule(client);
    }
}

client.once('ready', () => {
    console.log(`✅ ${client.user.tag} olarak tüm sistemler aktif edildi!`);
    client.user.setActivity('Sunucu Güvenliği & Destek', { type: 3 });
});

// Token Yönetimi
let token;
try {
    const config = require('./config.json');
    token = process.env.TOKEN || config.token;
} catch {
    token = process.env.TOKEN;
}

client.login(token);
