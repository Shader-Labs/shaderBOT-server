import { Command } from '../commandHandler.js';
import { sendError, sendSuccess } from '../lib/embeds.js';
import eraseEndUserData from '../lib/eraseEndUserData.js';
import log from '../lib/log.js';
import { getUser } from '../lib/searchMessage.js';

export const command: Command = {
    commands: ['eraseeud'],
    help: 'Erase all End User Data of the specified user.',
    expectedArgs: '<@user|userID|username>',
    minArgs: 1,
    maxArgs: null,
    requiredPermissions: ['ADMINISTRATOR'],
    callback: async (message, _, text) => {
        const { channel } = message;

        try {
            const user = await getUser(text);
            eraseEndUserData(user.id);

            sendSuccess(channel, `Successfully erased all End User Data of <@${user.id}>.`);
            log(`<@${message.author.id}> erased all End User Data of <@${user.id}>.`);
        } catch (error) {
            if (error) sendError(channel, error);
        }
    },
};
