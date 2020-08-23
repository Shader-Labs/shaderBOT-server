import { Command } from '../../commandHandler.js';
import { Message, MessageEmbed } from 'discord.js';
import { settings, client } from '../../bot.js';
import { getTicket } from '../../../misc/searchMessage.js';

export const command: Command = {
    commands: ['open'],
    expectedArgs: '<ticketID|ticketTitle>',
    minArgs: 1,
    maxArgs: null,
    superCommand: 'ticket',
    callback: async (message: Message, args: string[], text: string) => {
        const { guild, member } = message;
        if (!guild || !member) return;

        try {
            let ticket = await getTicket(message, args, text, true);

            ticket.closed = false;

            const ticketChannel = await guild.channels.create(ticket.title, {
                type: 'text',
                parent: settings.ticketCategoryID,
                topic: `${ticket._id} | <#${ticket.project}>`,
            });
            ticket.channel = ticketChannel.id;

            const ticketAuthor = await client.users.fetch(ticket.author);

            const ticketEmbed = new MessageEmbed()
                .setAuthor(ticketAuthor.username + '#' + ticketAuthor.discriminator, ticketAuthor.avatarURL() || undefined)
                .setColor('#0000ff')
                .setFooter(`ID: ${ticket._id}`)
                .addFields([
                    {
                        name: 'Title',
                        value: ticket.title,
                    },
                    {
                        name: 'Project',
                        value: `<#${ticket.project}>`,
                    },
                    {
                        name: 'Description',
                        value: ticket.description,
                    },
                ])
                .setTimestamp(new Date(ticket.timestamp));

            await ticketChannel.send(ticketEmbed);

            if (ticket.comments) {
                await Promise.all(
                    ticket.comments.map(async (comment) => {
                        const author = await client.users.fetch(comment.author);
                        const commentMessage = await ticketChannel.send(
                            new MessageEmbed()
                                .setAuthor(author.username + '#' + author.discriminator, author.avatarURL() || undefined)
                                .setFooter('ID: ' + comment.edited ? comment._id + ' (edited)' : comment._id)
                                .setTimestamp(new Date(comment.timestamp))
                                .setDescription(comment.content)
                        );

                        comment.message = commentMessage.id;
                        return comment;
                    })
                );
            }

            await ticket.save();
            message.channel.send('Ticket opened.');
        } catch (error) {
            if (error) message.channel.send(error);
        }
    },
};
