const mineflayer = require('mineflayer');
const express = require('express');

// 1. WEB HEARTBEAT (KEEPS KOYEB ACTIVE)
const app = express();
app.get('/', (req, res) => res.send('Actually_Steve: Online and Guarding'));
app.listen(3000, () => console.log('Web monitor on port 3000'));

// 2. CONFIG
const botArgs = {
    host: 'iamvir_.aternos.me', 
    port: 60814,                
    username: 'Actually_Steve',
    version: '1.20.1',          
};

let bot;
const welcomedPlayers = new Set(); // Steve's Anti-Spam Memory

const createBot = () => {
    bot = mineflayer.createBot(botArgs);

    // --- WELCOME LOGIC (PROTECTED FROM REJOIN SPAM) ---
    bot.on('playerJoined', (player) => {
        if (player.username === bot.username) return;

        // If the player is NOT in memory, welcome them
        if (!welcomedPlayers.has(player.username)) {
            welcomedPlayers.add(player.username);
            
            setTimeout(() => {
                bot.chat("Hay Mate What's Up? I am the savior of this server! :)");
            }, 3000);

            // They stay in memory for 5 minutes (300,000ms)
            // Even if they leave and rejoin, they won't be welcomed again until this time passes
            setTimeout(() => {
                welcomedPlayers.delete(player.username);
            }, 300000); 
        }
    });

    // --- CHAT COMMANDS ---
    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        if (message.toLowerCase() === 'actually_steve status') {
            bot.chat("I am guarding the server boss! ;)");
        }
    });

    bot.on('spawn', () => {
        console.log('Actually_Steve spawned. Speed: 2-8s. Rejoin: 30s Safe Mode.');
        startMoving();
    });

    // --- MOVEMENT ENGINE (2-8s) ---
    const startMoving = () => {
        if (!bot || !bot.entity) return;
        const actions = ['forward', 'back', 'left', 'right', 'jump', 'sneak'];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        const shouldJump = Math.random() > 0.7; 
        
        bot.setControlState(randomAction, true);
        if (shouldJump) bot.setControlState('jump', true);
        
        const holdTime = 250; 
        setTimeout(() => {
            bot.setControlState(randomAction, false);
            if (shouldJump) bot.setControlState('jump', false);
            bot.look(Math.random() * 6.2, (Math.random() - 0.5) * 2);
            
            // Random delay between 2 and 8 seconds
            const nextDelay = Math.random() * 6000 + 2000;
            setTimeout(startMoving, nextDelay);
        }, holdTime);
    };

    bot.on('error', (err) => console.log(`Error: ${err.code}`));
    
    bot.on('end', () => {
        console.log('Disconnected. Waiting 30s to rejoin...');
        setTimeout(createBot, 30000); 
    });
};

createBot();