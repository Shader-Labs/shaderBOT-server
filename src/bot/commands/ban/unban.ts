import { Command, syntaxError } from '../../commandHandler.js';
import { unban } from '../../lib/banUser.js';
import { sendError, sendSuccess } from '../../lib/embeds.js';
import { getUser } from '../../lib/searchMessage.js';

const expectedArgs = '<username|userID>';

export const command: Command = {
    commands: ['unban'],
    help: 'Unban a user.',
    minArgs: 1,
    maxArgs: null,
    expectedArgs,
    requiredPermissions: ['BAN_MEMBERS'],
    callback: async (message, _, text) => {
        const { member, channel } = message;

        const user = await getUser(text).catch(() => undefined);
        if (!user) return syntaxError(channel, 'unban ' + expectedArgs);

        try {
            await unban(user.id, member.id);
        } catch (error) {
            return sendError(channel, error);
        }

        sendSuccess(channel, `<@${user.id}> has been unbanned.`);
    },
};
