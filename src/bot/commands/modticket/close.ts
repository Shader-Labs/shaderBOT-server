import { Command } from '../../commandHandler.js';
import { sendError, sendSuccess } from '../../lib/embeds.js';
import log from '../../lib/log.js';
import { closeTicket } from '../../lib/ticketManagement.js';

export const command: Command = {
    commands: ['close'],
    superCommands: ['modticket', 'mticket'],
    help: 'Close any open ticket.',
    expectedArgs: '<ticketID|ticketTitle>',
    minArgs: 1,
    maxArgs: null,
    requiredPermissions: ['MANAGE_MESSAGES'],
    callback: async (message, args, text) => {
        const { member, channel } = message;

        try {
            const ticket = await closeTicket(args, text, member, true);
            sendSuccess(channel, 'Ticket closed.');
            log(`<@${message.author.id}> closed the ticket "${ticket.title}" by <@${ticket.author}>.`);
        } catch (error) {
            if (error) sendError(channel, error);
        }
    },
};
