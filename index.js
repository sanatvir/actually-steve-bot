const mineflayer = require('mineflayer');
const express = require('express');

// --- 1. CLOUD ALIVE SYSTEM (Koyeb & UptimeRobot) ---
const app = express();
app.get('/', (req, res) => res.send('Actually_Steve is Online and Stealthy!'));
app.listen(3000, () => console.log('Web monitor active on port 3000'));

// --- 2. PERMANENT CONNECTION SETTINGS ---
const botArgs = {
    host: 'iamvir_.aternos.me', // Automatically finds the port!
    username: 'Actually_Steve',
    version: '1.20.1',          
};

let bot;

function createBot() {
    bot = mineflayer.createBot(botArgs);

    // --- 3. HUMAN CHAT BEHAVIOR ---
    let lastWelcome = 0;
    bot.on('playerJoined', (player) => {
        const now = Date.now();
        // Only speaks if it's been 5 minutes since the last greet (prevents spam bans)
        if (player.username !== bot.username && now - lastWelcome > 300000) { 
            bot.chat(`Hay Mate What's Up? I am the savior of this server! :)`);
            lastWelcome = now;
        }
    });

    // --- 4. ULTIMATE STEALTH MOVEMENT (The Human Mimic) ---
    bot.on('spawn', () => {
        console.log('Actually_Steve: Stealth Mode Engaged.');

        const performHumanAction = () => {
            if (!bot || !bot.entity) return;

            // Chance to "AFK" (Simulates looking at another tab)
            if (Math.random() < 0.2) {
                const wait = Math.floor(Math.random() * 20000) + 10000; 
                return setTimeout(performHumanAction, wait);
            }

            const moves = ['forward', 'back', 'left', 'right'];
            const move = moves[Math.floor(Math.random() * moves.length)];
            
            // Randomly use sub-actions
            if (Math.random() < 0.15) bot.setControlState('sneak', true);
            if (Math.random() < 0.2) bot.setControlState('jump', true);
            if (Math.random() < 0.1) bot.setControlState('sprint', true);
            
            bot.setControlState(move, true);

            // Move for a random human duration (0.4s to 2.2s)
            const moveDuration = Math.floor(Math.random() * 1800) + 400;

            setTimeout(() => {
                bot.clearControlStates();

                // Look around with human-like neck constraints
                const yaw = bot.entity.yaw + (Math.random() * 1.6 - 0.8); 
                const pitch = (Math.random() * 0.6 - 0.3); 
                bot.look(yaw, pitch, false);

                // Wait before the next action (2s to 12s)
                const nextDelay = Math.floor(Math.random() * 10000) + 2000;
                setTimeout(performHumanAction, nextDelay);

            }, moveDuration);
        };

        performHumanAction();
    });

    // --- 5. PERSISTENCE ENGINE (5-10s Rejoin) ---
    bot.on('end', () => {
        const rejoinTime = Math.floor(Math.random() * 5000) + 5000;
        console.log(`Disconnected. Rejoining in ${rejoinTime/1000}s...`);
        setTimeout(createBot, rejoinTime);
    });

    // --- 6. ERROR HANDLING ---
    bot.on('error', (err) => console.log(`Error: ${err.message}`));
    bot.on('kicked', (reason) => {
        console.log(`Kicked for: ${JSON.stringify(reason)}`);
    });
}

createBot();