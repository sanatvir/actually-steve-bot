const mineflayer = require('mineflayer');
const express = require('express');

// 1. WEB HEARTBEAT (PREVENTS KOYEB SLEEP)
const app = express();
app.get('/', (req, res) => res.send('Actually_Steve: Online and Guarding'));
app.listen(3000, () => console.log('Web monitor on port 3000'));

// 2. CONFIGURATION
const botArgs = {
    host: 'iamvir_.aternos.me', 
    port: 60814,                
    username: 'Actually_Steve',
    version: '1.20.1',          
};

let bot;
const welcomedPlayers = new Set(); // Memory for Anti-Spam

const createBot = () => {
    bot = mineflayer.createBot(botArgs);

    // --- WELCOME MESSAGE (With 5-min Memory) ---
    bot.on('playerJoined', (player) => {
        if (player.username === bot.username) return;

        if (!welcomedPlayers.has(player.username)) {
            welcomedPlayers.add(player.username);
            
            setTimeout(() => {
                bot.chat("Hey Mate..  Whats Up I Am The Savior Of This Server !!");
            }, 3000);

            // Forget them after 5 minutes
            setTimeout(() => {
                welcomedPlayers.delete(player.username);
            }, 300000); 
        }
    });

    bot.on('spawn', () => {
        console.log('Actually_Steve spawned. Speed: 2-4s. Rejoin: 30s Safe Mode.');
        startMoving();
    });

    // --- MOVEMENT ENGINE (2-4s Interval) ---
    const startMoving = () => {
        if (!bot || !bot.entity) return;

        const actions = ['forward', 'back', 'left', 'right', 'jump', 'sneak'];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        
        const shouldJump = Math.random() > 0.7; 
        
        bot.setControlState(randomAction, true);
        if (shouldJump) bot.setControlState('jump', true);
        
        const holdTime = 250; // Quick tap for safety
        
        setTimeout(() => {
            bot.setControlState(randomAction, false);
            if (shouldJump) bot.setControlState('jump', false);
            
            // Look around like a human
            bot.look(Math.random() * 6.2, (Math.random() - 0.5) * 2);
            
            // 2s to 4s delay
            const nextDelay = Math.random() * 2000 + 2000;
            setTimeout(startMoving, nextDelay);
        }, holdTime);
    };

    bot.on('error', (err) => console.log(`Error detected: ${err.code}`));
    
    // --- SAFE REJOIN LOGIC (30 Seconds) ---
    bot.on('end', () => {
        console.log('Actually_Steve disconnected. Waiting 30s for safe rejoin...');
        setTimeout(createBot, 30000); 
    });
};

createBot();