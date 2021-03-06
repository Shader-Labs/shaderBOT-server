import { settings } from '../../bot.js';
import { Command } from '../../commandHandler.js';
import { sendInfo } from '../../lib/embeds.js';

export const command: Command = {
    commands: ['list'],
    superCommands: ['config'],
    help: "Print the bot's current configuration.",
    minArgs: 0,
    maxArgs: 0,
    requiredPermissions: ['MANAGE_GUILD'],
    callback: (message) => {
        sendInfo(message.channel, '```json\n' + JSON.stringify(settings, null, 2) + '```', 'Configuration');
    },
};
