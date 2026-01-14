const mineflayer = require('mineflayer');
const express = require('express');

// --- 1. IMMORTAL CLOUD ENGINE ---
const app = express();
app.get('/', (req, res) => res.send('Actually_Steve is Online. Status command disabled.'));
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

    // --- 2. SOCIAL CHAT (Only Welcome) ---
    let lastWelcome = 0;
    bot.on('playerJoined', (player) => {
        const now = Date.now();
        if (player.username !== bot.username && now - lastWelcome > 300000) { 
            bot.chat(`Hay Mate What's Up? I am the savior of this server! :)`);
            lastWelcome = now;
        }
    });

    // --- 3. THE PERFECTED BRAIN ---
    bot.on('spawn', () => {
        console.log('🐐 GOAT 24/7: Stealth Mode (No Status Cmd) Active.');

        const moveLogic = () => {
            if (!bot || !bot.entity || isBypassing || isEscaping) return;

            // STUCK DETECTION
            if (lastPos && bot.entity.position.distanceTo(lastPos) < 0.15) {
                stuckTicks++;
            } else {
                stuckTicks = 0;
            }
            lastPos = bot.entity.position.clone();

            // SMART NAVIGATION
            const yaw = bot.entity.yaw;
            const moveDir = new mineflayer.vec3(-Math.sin(yaw), 0, -Math.cos(yaw));
            const blockInFront = bot.blockAt(bot.entity.position.plus(moveDir.scaled(1)));
            const isBlocked = blockInFront && blockInFront.boundingBox !== 'empty';

            if (isBlocked) {
                if (stuckTicks > 4) {
                    bot.setControlState('jump', false);
                    bot.look(yaw + (Math.PI / 2 + Math.random()), 0); 
                    bot.setControlState('forward', true);
                    stuckTicks = 0;
                } else {
                    bot.setControlState('jump', true);
                }
            } else {
                bot.setControlState('jump', false);
            }

            // SOCIAL LOOK & MOVEMENT
            const nearby = bot.nearestEntity((e) => e.type === 'player' || e.type === 'mob');
            const isNear = nearby && bot.entity.position.distanceTo(nearby.position) < 7;
            const actions = ['forward', 'back', 'left', 'right'];
            const move = actions[Math.floor(Math.random() * actions.length)];

            if (isNear) {
                bot.lookAt(nearby.position.offset(0, nearby.height, 0));
                if (Math.random() < 0.1) bot.look(bot.entity.yaw, (Math.random() > 0.5 ? 0.4 : -0.4)); // Nod/Shake
            } else {
                bot.look(yaw + (Math.random() * 2 - 1), (Math.random() * 0.6 - 0.3), false);
            }

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

    // --- 4. RECOVERY & REJOIN ---
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