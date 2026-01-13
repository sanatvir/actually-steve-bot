const mineflayer = require('mineflayer');
const express = require('express');

// 1. WEB HEARTBEAT (KEEPS KOYEB ALIVE)
const app = express();
app.get('/', (req, res) => {
    res.send('Actually_Steve System: 24/7 Operational');
});
app.listen(3000, () => {
    console.log('Web monitor listening on port 3000');
});

// 2. BOT CONFIGURATION
const botArgs = {
    host: 'iamvir_.aternos.me', 
    port: 60814,                
    username: 'Actually_Steve',
    version: '1.20.1',          
};

let bot;

// 3. MAIN BOT FUNCTION
const createBot = () => {
    bot = mineflayer.createBot(botArgs);

    bot.on('spawn', () => {
        console.log('Actually_Steve has spawned. Initializing Movement Engine...');
        startMoving();
    });

    // HUMAN-LIKE MOVEMENT LOGIC (5-8 SECONDS)
    const startMoving = () => {
        if (!bot || !bot.entity) return;

        const actions = ['forward', 'back', 'left', 'right', 'jump', 'sneak'];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        
        bot.setControlState(randomAction, true);
        
        // Key press duration
        const holdTime = Math.random() * 300 + 200;
        
        setTimeout(() => {
            bot.setControlState(randomAction, false);
            
            // Randomly look around
            bot.look(Math.random() * 6.2, (Math.random() - 0.5) * 2);
            
            // --- UPDATED DELAY: 5s TO 8s ---
            // 8000 is max (8s), 5000 is min (5s)
            const nextDelay = Math.random() * (8000 - 5000) + 5000;
            
            console.log(`Steve: Action completed. Next move in ${Math.round(nextDelay/1000)}s`);
            
            setTimeout(startMoving, nextDelay);
        }, holdTime);
    };

    bot.on('error', (err) => {
        console.log(`Error encountered: ${err.code}`);
    });

    bot.on('end', () => {
        console.log('Disconnected. Reconnecting in 40s...');
        setTimeout(createBot, 40000);
    });
};

createBot();