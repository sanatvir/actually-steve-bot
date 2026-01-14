const mineflayer = require('mineflayer');
const express = require('express');

// --- 1. IMMORTAL CLOUD ENGINE ---
const app = express();
app.get('/', (req, res) => res.send('Actually_Steve: 24/7 Sentient Mode Active.'));
app.listen(3000, () => console.log('Uptime server running on port 3000'));

const botArgs = {
    host: 'iamvir_.aternos.me',
    username: 'Actually_Steve',
    version: '1.20.1',
};

let bot;
let isBypassing = false;
let isEscaping = false;
let lastPos = null;
let stuckTicks = 0;

function createBot() {
    bot = mineflayer.createBot(botArgs);

    // --- 2. SOCIAL & CHAT ---
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

    // --- 3. THE PERFECTED BRAIN ---
    bot.on('spawn', () => {
        console.log('🐐 GOAT 24/7: All systems green.');

        const moveLogic = () => {
            if (!bot || !bot.entity || isBypassing || isEscaping) return;

            // --- STUCK DETECTION ---
            if (lastPos && bot.entity.position.distanceTo(lastPos) < 0.15) {
                stuckTicks++;
            } else {
                stuckTicks = 0;
            }
            lastPos = bot.entity.position.clone();

            // --- SMART NAVIGATION (Anti-Jumping Spasm) ---
            const yaw = bot.entity.yaw;
            const moveDir = new mineflayer.vec3(-Math.sin(yaw), 0, -Math.cos(yaw));
            const blockInFront = bot.blockAt(bot.entity.position.plus(moveDir.scaled(1)));
            const isBlocked = blockInFront && blockInFront.boundingBox !== 'empty';

            if (isBlocked) {
                if (stuckTicks > 4) {
                    bot.setControlState('jump', false);
                    bot.look(yaw + (Math.PI / 2 + Math.random()), 0); // Smart turn if stuck
                    bot.setControlState('forward', true);
                    stuckTicks = 0;
                } else {
                    bot.setControlState('jump', true);
                }
            } else {
                bot.setControlState('jump', false);
            }

            // --- SOCIAL & HUMAN BEHAVIOR ---
            const nearby = bot.nearestEntity((e) => e.type === 'player' || e.type === 'mob');
            const isNear = nearby && bot.entity.position.distanceTo(nearby.position) < 7;
            const actions = ['forward', 'back', 'left', 'right'];
            const move = actions[Math.floor(Math.random() * actions.length)];

            if (isNear) {
                bot.lookAt(nearby.position.offset(0, nearby.height, 0));
                // Add a "Nod" or "Shake" chance
                if (Math.random() < 0.1) bot.look(bot.entity.yaw, (Math.random() > 0.5 ? 0.5 : -0.5));
            } else {
                bot.look(yaw + (Math.random() * 2 - 1), (Math.random() * 0.6 - 0.3), false);
            }

            // --- FIDGETS & EXECUTION ---
            bot.setControlState(move, true);
            if (Math.random() < 0.6) bot.setControlState('sprint', true);
            
            const roll = Math.random();
            if (roll < 0.1) bot.swingArm('right'); 
            if (roll < 0.05) bot.setQuickBarSlot(Math.floor(Math.random() * 9));
            if (roll < 0.02) {
                bot.setControlState('sneak', true);
                setTimeout(() => bot.setControlState('sneak', false), 300);
            }

            setTimeout(() => {
                bot.clearControlStates();
                setTimeout(moveLogic, Math.random() * 100 + 10);
            }, Math.random() * 2500 + 500);
        };

        // --- 4. BYPASS LOGIC (10-15m interval, 5-10s pause) ---
        const scheduleBypass = () => {
            setTimeout(() => {
                isBypassing = true;
                bot.clearControlStates();
                setTimeout(() => {
                    isBypassing = false;
                    moveLogic();
                    scheduleBypass();
                }, Math.random() * 5000 + 5000);
            }, Math.floor(Math.random() * 300000) + 600000);
        };

        moveLogic();
        scheduleBypass();
    });

    // --- 5. RECOVERY & REJOIN ---
    bot.on('health', () => {
        if (bot.health < 18 && !isEscaping) {
            isEscaping = true;
            bot.setControlState('back', true);
            bot.setControlState('sprint', true);
            bot.setControlState('jump', true);
            setTimeout(() => { isEscaping = false; bot.clearControlStates(); }, 5000);
        }
    });

    bot.on('error', (err) => console.log('Err:', err.message));
    bot.on('end', () => setTimeout(createBot, 10000));
}

createBot();