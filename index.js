const mineflayer = require('mineflayer');
const express = require('express');

// --- 1. CLOUD UPTIME ENGINE ---
// Keeps the bot alive on services like Koyeb/Render
const app = express();
app.get('/', (req, res) => res.send('Actually_Steve: Sentient Stealth Engine Online.'));
app.listen(3000);

const botArgs = {
    host: 'iamvir_.aternos.me',
    username: 'Actually_Steve',
    version: '1.20.1',
};

let bot;
let isBypassing = false;
let isEscaping = false;
let lastPosition = null;
let stuckTicks = 0;

function createBot() {
    bot = mineflayer.createBot(botArgs);

    // --- 2. REJOIN LOGIC (5-15s RANDOM) ---
    // Essential to avoid "Spam Join" bans
    bot.on('end', () => {
        const delay = Math.floor(Math.random() * 10000) + 5000; 
        console.log(`Connection lost. Rejoining in ${delay / 1000}s...`);
        setTimeout(createBot, delay);
    });

    bot.on('error', (err) => console.log('Engine Error:', err.message));
    bot.on('kicked', (reason) => console.log('Kicked:', reason));

    // --- 3. SOCIAL CHAT ---
    let lastWelcome = 0;
    bot.on('playerJoined', (player) => {
        const now = Date.now();
        if (player.username !== bot.username && now - lastWelcome > 300000) { 
            bot.chat(`Hay Mate What's Up? I am the savior of this server! :)`);
            lastWelcome = now;
        }
    });

    // --- 4. THE BRAIN (Movement & Intelligence) ---
    bot.on('spawn', () => {
        console.log('🐐 STEALTH GOAT: Zero-Idle & Smart Navigation Active.');

        const moveLogic = () => {
            // Safety check to prevent logic overlap during pauses/escapes
            if (!bot || !bot.entity || isBypassing || isEscaping) {
                setTimeout(moveLogic, 500);
                return;
            }

            // --- STUCK DETECTION ---
            if (lastPosition && bot.entity.position.distanceTo(lastPosition) < 0.15) {
                stuckTicks++;
            } else {
                stuckTicks = 0;
            }
            lastPosition = bot.entity.position.clone();

            const yaw = bot.entity.yaw;
            const moveDir = new mineflayer.vec3(-Math.sin(yaw), 0, -Math.cos(yaw));
            const block = bot.blockAt(bot.entity.position.plus(moveDir.scaled(1)));
            
            // --- SMART JUMPING & NAVIGATION ---
            if (block && block.boundingBox !== 'empty') {
                if (stuckTicks > 3) {
                    // Turn 90 degrees if jumping doesn't work (Anti-Stuck)
                    bot.look(yaw + (Math.random() > 0.5 ? 1.5 : -1.5), 0);
                    stuckTicks = 0;
                } else {
                    bot.setControlState('jump', true);
                }
            } else {
                bot.setControlState('jump', false);
            }

            // --- PERPETUAL MOTION (No Idle) ---
            const actions = ['forward', 'left', 'right'];
            bot.setControlState(actions[Math.floor(Math.random() * 3)], true);
            bot.setControlState('sprint', Math.random() > 0.1); // Humanized speed variation

            // --- HUMANIZED LOOKING (With Offset) ---
            const nearby = bot.nearestEntity((e) => e.type === 'player');
            if (nearby && bot.entity.position.distanceTo(nearby.position) < 8) {
                // Mimics human "head lag" by not tracking perfectly
                const offset = new mineflayer.vec3((Math.random() - 0.5), nearby.height * 0.8, (Math.random() - 0.5));
                bot.lookAt(nearby.position.plus(offset));
            } else {
                // Natural head bobbing/wandering
                bot.look(yaw + (Math.random() * 0.4 - 0.2), (Math.random() * 0.2 - 0.1), false);
            }

            // --- FIDGETS & INVENTORY SHUFFLE ---
            const roll = Math.random();
            if (roll < 0.1) bot.swingArm('right'); 
            if (roll < 0.05) bot.setQuickBarSlot(Math.floor(Math.random() * 9));

            // Decision speed mimics human thinking (0.4s to 1.2s)
            setTimeout(moveLogic, Math.random() * 800 + 400); 
        };

        // --- 5. AFK BYPASS (Every 12 mins) ---
        const scheduleBypass = () => {
            setTimeout(() => {
                isBypassing = true;
                bot.clearControlStates();
                setTimeout(() => {
                    isBypassing = false;
                    moveLogic();
                    scheduleBypass();
                }, Math.random() * 5000 + 5000); // 5-10 second break
            }, 720000); 
        };

        moveLogic();
        scheduleBypass();
    });

    // --- 6. REACTIVE COMBAT ESCAPE ---
    bot.on('health', () => {
        // If hit, look at attacker, swing, and sprint away
        if (bot.health < 19 && !isEscaping) {
            isEscaping = true;
            console.log('⚠️ Combat Detected! Escaping...');
            bot.setControlState('back', true);
            bot.setControlState('sprint', true);
            bot.setControlState('jump', true);
            setTimeout(() => { 
                isEscaping = false; 
                bot.clearControlStates();
                moveLogic(); 
            }, 5000);
        }
    });
}

createBot();