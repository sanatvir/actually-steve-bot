const mineflayer = require('mineflayer');
const express = require('express');

// --- WEB SERVER FOR KOYEB & UPTIMEROBOT ---
const app = express();
app.get('/', (req, res) => res.send('Actually_Steve is Online!'));
app.listen(3000, () => console.log('Web monitor on port 3000'));

// --- BOT SETTINGS ---
const botArgs = {
    host: 'iamvir_.aternos.me', 
    username: 'Actually_Steve',
    version: '1.20.1', // Ensure this matches your Aternos version
};

let bot;

function createBot() {
    bot = mineflayer.createBot(botArgs);

    // --- WELCOME MESSAGE ---
    let lastWelcome = 0;
    bot.on('playerJoined', (player) => {
        const now = Date.now();
        if (player.username !== bot.username && now - lastWelcome > 300000) { 
            bot.chat(`Hay Mate What's Up? I am the savior of this server! :)`);
            lastWelcome = now;
        }
    });

    // --- HUMAN MOVEMENT ENGINE (2-8 seconds) ---
    bot.on('spawn', () => {
        console.log('Actually_Steve has joined the server!');
        
        setInterval(() => {
            const actions = ['forward', 'back', 'left', 'right', 'jump', 'sneak'];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            
            bot.setControlState(randomAction, true);
            setTimeout(() => bot.setControlState(randomAction, false), 500);
            
            // Randomly look around
            const yaw = Math.random() * Math.PI * 2;
            const pitch = (Math.random() - 0.5) * Math.PI;
            bot.look(yaw, pitch);
            
        }, Math.floor(Math.random() * 6000) + 2000); 
    });

    // --- FAST REJOIN LOGIC (5-10 seconds) ---
    bot.on('end', () => {
        const rejoinTime = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
        console.log(`Disconnected. Rejoining in ${rejoinTime / 1000} seconds...`);
        setTimeout(createBot, rejoinTime);
    });

    // --- ERROR LOGGING ---
    bot.on('error', (err) => console.log(`Error: ${err.message}`));
    bot.on('kicked', (reason) => console.log(`Kicked for: ${reason}`));
}

// Start the bot for the first time
createBot();