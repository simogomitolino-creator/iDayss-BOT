const {
  SlashCommandBuilder, EmbedBuilder, ActionRowBuilder,
  ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits
} = require('discord.js');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('🎫 Open a ticket manually'),

  async execute(interaction) {
    const guild = interaction.guild;
    const user = interaction.user;
    const ticketCat = process.env.TICKET_CATEGORY_ID;

    // Check if user already has a ticket open
    const existing = guild.channels.cache.find(
      c =>
        c.name === `ticket-${user.username.toLowerCase()}` &&
        c.parentId === (ticketCat || null)
    );

    if (existing) {
      return interaction.reply({
        content: `❌ You already have an open ticket: ${existing}`,
        ephemeral: true
      });
    }

    // Create ticket channel
    const ch = await guild.channels.create({
      name: `ticket-${user.username.toLowerCase()}`,
      type: ChannelType.GuildText,
      parent: ticketCat || null,
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          deny: [PermissionFlagsBits.ViewChannel]
        },
        {
          id: user.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages
          ]
        },
        {
          id: process.env.STAFF_ROLE_ID,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages
          ]
        }
      ]
    });

    // Ticket embed
    const embed = new EmbedBuilder()
      .setTitle('🎫 Open Ticket')
      .setDescription(
        'Hello! Please describe your request and our staff will reply as soon as possible.'
      )
      .setColor(0xE63946)
      .setFooter({ text: "iDayss's Services • Support" })
      .setTimestamp();

    // Close button
    const closeBtn = new ButtonBuilder()
      .setCustomId(`close_ticket_${ch.id}`)
      .setLabel('🔒 Close Ticket')
      .setStyle(ButtonStyle.Danger);

    // Send message inside ticket
    await ch.send({
      content: `${user} <@&${process.env.STAFF_ROLE_ID}>`,
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(closeBtn)]
    });

    // Reply to command
    return interaction.reply({
      content: `✅ Ticket opened: ${ch}`,
      ephemeral: true
    });
  }
};
