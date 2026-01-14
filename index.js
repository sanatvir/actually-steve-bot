const mineflayer = require('mineflayer');
const express = require('express');

// --- 1. CLOUD UPTIME ENGINE ---
const app = express();
app.get('/', (req, res) => res.send('Actually_Steve is Online and Sentient.'));
app.listen(3000, () => console.log('Keep-alive server on port 3000'));

const botArgs = {
    host: 'iamvir_.aternos.me',
    username: 'Actually_Steve',
    version: '1.20.1',
};

let bot;
let isBypassing = false;
let isEscaping = false;

function createBot() {
    bot = mineflayer.createBot(botArgs);

    // --- 2. CHAT & SOCIAL FEATURES ---
    let lastWelcome = 0;
    bot.on('playerJoined', (player) => {
        const now = Date.now();
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

    // --- 3. THE BRAIN & MOVEMENT ---
    bot.on('spawn', () => {
        console.log('🐐 GOAT MODE ACTIVATED: All features live.');

        const moveLogic = () => {
            if (!bot || !bot.entity || isBypassing || isEscaping) return;

            // --- OBSTACLE DETECTION ---
            const yaw = bot.entity.yaw;
            const moveDir = new mineflayer.vec3(-Math.sin(yaw), 0, -Math.cos(yaw));
            const blockInFront = bot.blockAt(bot.entity.position.plus(moveDir.scaled(1)));
            if (blockInFront && blockInFront.boundingBox !== 'empty') {
                bot.setControlState('jump', true);
            }

            // --- SOCIAL & RANDOM LOOK ---
            const nearby = bot.nearestEntity((e) => e.type === 'player' || e.type === 'mob');
            const isNear = nearby && bot.entity.position.distanceTo(nearby.position) < 7;

            const actions = ['forward', 'back', 'left', 'right'];
            const move = actions[Math.floor(Math.random() * actions.length)];

            if (isNear) {
                bot.lookAt(nearby.position.offset(0, nearby.height, 0));
            } else {
                bot.look(yaw + (Math.random() * 2 - 1), (Math.random() * 0.8 - 0.4), false);
            }

            // --- HUMAN FIDGETS & MOTION ---
            bot.setControlState(move, true);
            if (Math.random() < 0.6) bot.setControlState('sprint', true);
            if (Math.random() < 0.5) bot.setControlState('jump', true);
            
            const chance = Math.random();
            if (chance < 0.12) bot.swingArm('right'); 
            if (chance < 0.05) bot.setQuickBarSlot(Math.floor(Math.random() * 9));
            if (chance < 0.03) {
                bot.setControlState('sneak', true);
                setTimeout(() => bot.setControlState('sneak', false), 400);
            }

            setTimeout(() => {
                bot.clearControlStates();
                setTimeout(moveLogic, Math.random() * 120 + 20);
            }, Math.random() * 2800 + 400);
        };

        // --- 4. PATTERN-BREAK BYPASS ---
        const scheduleBypass = () => {
            // Wait 10-15 minutes
            const interval = Math.floor(Math.random() * 300000) + 600000;
            setTimeout(() => {
                isBypassing = true;
                bot.clearControlStates();
                // Pause for 5-10 seconds
                const pauseDuration = Math.floor(Math.random() * 5000) + 5000;
                setTimeout(() => {
                    isBypassing = false;
                    moveLogic();
                    scheduleBypass();
                }, pauseDuration);
            }, interval);
        };

        moveLogic();
        scheduleBypass();
    });

    // --- 5. REACTIVE COMBAT ---
    bot.on('health', () => {
        if (bot.health < 20 && !isEscaping && !isBypassing) {
            isEscaping = true;
            const attacker = bot.nearestEntity();
            if (attacker) {
                bot.lookAt(attacker.position);
                bot.swingArm('right');
            }
            bot.setControlState('back', true);
            bot.setControlState('sprint', true);
            bot.setControlState('jump', true);
            setTimeout(() => {
                isEscaping = false;
                bot.clearControlStates();
            }, 5000);
        }
    });

    // --- 6. 24/7 PERSISTENCE ---
    bot.on('error', (err) => console.log('Connection Error:', err));
    bot.on('end', () => {
        const rejoinDelay = Math.floor(Math.random() * 5000) + 5000;
        console.log(`Lost connection. Rejoining in ${rejoinDelay/1000}s...`);
        setTimeout(createBot, rejoinDelay);
    });
}

createBot();