const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('Actually_Steve is Surviving and Shuffling.'));
app.listen(3000);

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

    // --- 1. REACTIVE COMBAT (Self-Defense & Escape) ---
    bot.on('health', () => {
        // If health drops, we assume we are being attacked
        if (bot.health < 20 && !isEscaping && !isBypassing) {
            isEscaping = true;
            console.log('⚠️ Under attack! Executing panic escape...');
            
            const attacker = bot.nearestEntity((e) => e.type === 'player' || e.type === 'mob');
            if (attacker) {
                bot.lookAt(attacker.position.offset(0, attacker.height, 0));
                bot.swingArm('right'); // "Get away from me" punch
            }

            // Sprint in the opposite direction
            bot.clearControlStates();
            bot.setControlState('back', true);
            bot.setControlState('sprint', true);
            bot.setControlState('jump', true);

            setTimeout(() => {
                isEscaping = false;
                bot.clearControlStates();
                console.log('Safe (hopefully). Resuming randomness.');
            }, 5000); // Sprint away for 5 seconds
        }
    });

    bot.on('spawn', () => {
        console.log('🐐 SURVIVOR GOAT: Combat and Inventory logic online.');

        const moveLogic = () => {
            if (!bot || !bot.entity || isBypassing || isEscaping) return;

            // --- 2. INVENTORY SHUFFLE (Human Fidget) ---
            if (Math.random() < 0.05) {
                const randomSlot = Math.floor(Math.random() * 9);
                bot.setQuickBarSlot(randomSlot);
            }

            // --- 3. SMART OBSTACLE BRAIN ---
            const moveDir = new mineflayer.vec3(-Math.sin(bot.entity.yaw), 0, -Math.cos(bot.entity.yaw));
            const blockInFront = bot.blockAt(bot.entity.position.plus(moveDir.scaled(1)));
            if (blockInFront && blockInFront.boundingBox !== 'empty') {
                bot.setControlState('jump', true);
            }

            // --- 4. DYNAMIC MOVEMENT & SOCIAL LOOK ---
            const nearbyEntity = bot.nearestEntity((e) => e.type === 'player' || e.type === 'mob');
            const isNear = nearbyEntity && bot.entity.position.distanceTo(nearbyEntity.position) < 7;
            const actions = ['forward', 'back', 'left', 'right'];
            const move = actions[Math.floor(Math.random() * actions.length)];

            if (isNear) {
                bot.lookAt(nearbyEntity.position.offset(0, nearbyEntity.height, 0));
            } else {
                bot.look(bot.entity.yaw + (Math.random() * 4 - 2), (Math.random() * 1.2 - 0.6), false);
            }

            bot.setControlState(move, true);
            if (Math.random() < 0.6) bot.setControlState('sprint', true);
            if (Math.random() < 0.5) bot.setControlState('jump', true);
            if (Math.random() < 0.1) bot.swingArm('right');

            setTimeout(() => {
                bot.clearControlStates();
                setTimeout(moveLogic, Math.random() * 120 + 20);
            }, Math.random() * 2500 + 400);
        };

        // --- 5. THE 10-15m BYPASS ---
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

    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        if (message.toLowerCase().includes('status')) bot.chat('Surviving and thriving. B)');
    });

    bot.on('end', () => setTimeout(createBot, 5000));
}

createBot();