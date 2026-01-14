const mineflayer = require('mineflayer');
const express = require('express');

// --- CLOUD KEEP-ALIVE ---
const app = express();
app.get('/', (req, res) => res.send('Actually_Steve is Fully Conscious and Random.'));
app.listen(3000);

const botArgs = {
    host: 'iamvir_.aternos.me',
    username: 'Actually_Steve',
    version: '1.20.1',
};

let bot;
let isBypassing = false;

function createBot() {
    bot = mineflayer.createBot(botArgs);

    // --- 1. HUMAN SOCIAL CHAT ---
    let lastWelcome = 0;
    bot.on('playerJoined', (player) => {
        const now = Date.now();
        // Welcome nearby players, but only once every 5 minutes to avoid bot-spam flags
        if (player.username !== bot.username && now - lastWelcome > 300000) { 
            bot.chat(`Hay Mate What's Up? I am the savior of this server! :)`);
            lastWelcome = now;
        }
    });

    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        const msg = message.toLowerCase();
        if (msg.includes('actually_steve') || msg.includes('status')) {
            bot.chat(`I'm here and watching everything. Currently in Goat Stealth Mode. B)`);
        }
    });

    bot.on('spawn', () => {
        console.log('🐐 GOAT MODE: Initializing chaotic human behavior...');

        const moveLogic = () => {
            if (!bot || !bot.entity || isBypassing) return;

            // --- 2. THE "HUMAN FIDGET" ENGINE ---
            const fidgetRoll = Math.random();
            if (fidgetRoll < 0.12) bot.swingArm('right');     // Randomly punch air/blocks
            if (fidgetRoll < 0.05) bot.setControlState('sneak', true);  // Quick crouch
            if (fidgetRoll > 0.90) bot.setControlState('sneak', false); // Stop crouching
            
            // Randomly swap hotbar slots (looks like checking inventory)
            if (fidgetRoll < 0.03) bot.setQuickBarSlot(Math.floor(Math.random() * 9));

            // --- 3. SOCIAL TARGETING & MOVEMENT ---
            const nearbyEntity = bot.nearestEntity((e) => e.type === 'player' || e.type === 'mob');
            const isNear = nearbyEntity && bot.entity.position.distanceTo(nearbyEntity.position) < 7;

            // Pick a totally random direction every cycle
            const actions = ['forward', 'back', 'left', 'right'];
            const moveDirection = actions[Math.floor(Math.random() * actions.length)];

            if (isNear) {
                // LOCK ON: Look at player but KEEPS MOVING/STRAFING
                bot.lookAt(nearbyEntity.position.offset(0, nearbyEntity.height, 0));
                bot.setControlState(moveDirection, true);
                if (Math.random() < 0.7) bot.setControlState('jump', true); // Jump while looking
            } else {
                // WANDER: Look at random 3D points (sky, ground, sides)
                const yaw = bot.entity.yaw + (Math.random() * 4 - 2);
                const pitch = (Math.random() * 1.2 - 0.6); 
                bot.look(yaw, pitch, false);
                bot.setControlState(moveDirection, true);
            }

            // --- 4. ULTIMATE RANDOM TIMING ---
            if (Math.random() < 0.6) bot.setControlState('sprint', true);
            if (Math.random() < 0.5) bot.setControlState('jump', true);

            // Each movement lasts between 0.2 and 3.2 seconds
            const duration = Math.random() * 3000 + 200;

            setTimeout(() => {
                bot.clearControlStates();
                // Near-zero gap between moves (10ms to 120ms)
                setTimeout(moveLogic, Math.random() * 110 + 10);
            }, duration);
        };

        // --- 5. THE PATTERN-BREAK BYPASS (10-15m interval, 5-10s pause) ---
        const scheduleBypass = () => {
            const nextBypass = Math.floor(Math.random() * (900000 - 600000 + 1)) + 600000;
            setTimeout(() => {
                console.log('🤫 Anti-Detection Pause: Staying still for a few seconds...');
                isBypassing = true;
                bot.clearControlStates();
                
                const pauseTime = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
                setTimeout(() => {
                    isBypassing = false;
                    console.log('🚀 Resuming relentless activity.');
                    moveLogic(); 
                    scheduleBypass(); 
                }, pauseTime);
            }, nextBypass);
        };

        moveLogic();
        scheduleBypass();
    });

    // --- 6. PERSISTENT AUTO-REJOIN ---
    bot.on('end', () => {
        const time = Math.floor(Math.random() * 5000) + 5000;
        console.log(`Connection lost. Rejoining in ${time/1000}s...`);
        setTimeout(createBot, time);
    });

    bot.on('error', (err) => console.log('Bot Error:', err));
}

createBot();