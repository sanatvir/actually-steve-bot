const mineflayer = require('mineflayer');
const express = require('express');

// 1. WEB SERVER: This prevents Koyeb from shutting down the app.
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Actually_Steve System: 24/7 Operational');
});

app.listen(PORT, () => {
    console.log(`Web monitor listening on port ${PORT}`);
});

// 2. BOT CONFIGURATION
const botArgs = {
    host: 'yourserver.aternos.me', // <--- Replace with your Aternos IP
    username: 'Actually_Steve',
    version: '1.20.1',             // <--- Match your Minecraft version
};

function initBot() {
    const bot = mineflayer.createBot(botArgs);

    // When the bot enters the world
    bot.on('spawn', () => {
        console.log('Actually_Steve has spawned. Initializing Movement Engine...');
        
        // --- RANDOMIZED MOVEMENT ENGINE ---
        const startMoving = () => {
            const actions = ['forward', 'back', 'left', 'right', 'jump', 'sneak'];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            
            // Start the movement
            bot.setControlState(randomAction, true);
            
            // Hold the key for a random time (200ms to 800ms)
            const holdTime = Math.random() * 600 + 200;
            
            setTimeout(() => {
                bot.setControlState(randomAction, false);
                
                // Randomly look around (Yaw and Pitch)
                const yaw = Math.random() * 6.2;
                const pitch = (Math.random() - 0.5) * 2;
                bot.look(yaw, pitch);
                
                // 30% chance to swing the arm (looks like hitting/mining)
                if (Math.random() < 0.3) bot.swingArm();

                // --- 10s TO 25s RANDOM DELAY ---
                const nextDelay = Math.random() * (25000 - 10000) + 10000;
                
                console.log(`Next action in ${Math.round(nextDelay/1000)}s`);
                setTimeout(startMoving, nextDelay);
            }, holdTime);
        };

        startMoving();
    });

    // 3. AUTO-RECONNECT (The "No-Betrayal" System)
    bot.on('end', (reason) => {
        console.log(`Disconnected: ${reason}. Reconnecting in 40s...`);
        setTimeout(initBot, 40000);
    });

    // Error handling to prevent the script from crashing
    bot.on('error', (err) => {
        console.log(`Error encountered: ${err.message}`);
        if (err.code === 'ECONNREFUSED') {
            setTimeout(initBot, 60000); // Wait longer if server is offline
        }
    });
}

initBot();