const {
  ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder,
  EmbedBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits,
} = require('discord.js');
require('dotenv').config();

const pendingAnnunci = new Map();

module.exports = {
  name: 'interactionCreate',

  getPendingAnnunci() {
    return pendingAnnunci;
  },

  async execute(interaction, client) {

    // ─── SLASH COMMANDS ───
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try { await command.execute(interaction, client); }
      catch (err) {
        console.error(err);
        const msg = { content: 'Error executing command.', ephemeral: true };
        interaction.replied ? await interaction.followUp(msg) : await interaction.reply(msg);
      }
      return;
    }

    // ─── BUTTONS ───
    if (interaction.isButton()) {

      // ── BUY ──
      if (interaction.customId.startsWith('buy_')) {
        const msgId = interaction.customId.replace('buy_', '');
        const originalEmbed = interaction.message.embeds[0];
        const guild = interaction.guild;
        const user = interaction.user;
        const ch = await guild.channels.create({
          name: 'buy-' + user.username + '-' + msgId.slice(-4),
          type: ChannelType.GuildText,
          parent: process.env.TICKET_CATEGORY_ID || null,
          permissionOverwrites: [
            { id: guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
            { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
            { id: process.env.STAFF_ROLE_ID, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
          ],
        });
        const tEmbed = new EmbedBuilder()
          .setTitle('Purchase Request')
          .setDescription(user + ' wants to buy this account!\nA staff member will reply shortly.')
          .setColor(0xE63946).setTimestamp();
        const closeBtn = new ButtonBuilder().setCustomId('close_ticket_' + ch.id).setLabel('Close Ticket').setStyle(ButtonStyle.Danger);
        await ch.send({ content: user + ' <@&' + process.env.STAFF_ROLE_ID + '>', embeds: [tEmbed, originalEmbed], components: [new ActionRowBuilder().addComponents(closeBtn)] });
        await interaction.reply({ content: 'Ticket opened: ' + ch, ephemeral: true });
        return;
      }

      // ── SOLD ──
      if (interaction.customId.startsWith('sold_')) {
        if (!interaction.member.roles.cache.has(process.env.STAFF_ROLE_ID)) {
          await interaction.reply({ content: 'Only staff can mark as sold!', ephemeral: true }); return;
        }
        await interaction.message.delete();
        await interaction.reply({ content: 'Listing removed — account sold!', ephemeral: true });
        return;
      }

      // ── CLOSE TICKET ──
      if (interaction.customId.startsWith('close_ticket_')) {
        if (!interaction.member.roles.cache.has(process.env.STAFF_ROLE_ID)) {
          await interaction.reply({ content: 'Only staff can close tickets!', ephemeral: true }); return;
        }
        await interaction.reply({ content: 'Closing in 3 seconds...' });
        setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
        return;
      }

      // ── OPEN TICKET (panel) ──
      if (interaction.customId === 'open_ticket') {
        const guild = interaction.guild;
        const user = interaction.user;
        const existing = guild.channels.cache.find(c => c.name === 'ticket-' + user.username);
        if (existing) { await interaction.reply({ content: 'You already have an open ticket: ' + existing, ephemeral: true }); return; }
        const ch = await guild.channels.create({
          name: 'ticket-' + user.username,
          type: ChannelType.GuildText,
          parent: process.env.TICKET_CATEGORY_ID || null,
          permissionOverwrites: [
            { id: guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
            { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
            { id: process.env.STAFF_ROLE_ID, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
          ],
        });
        const e = new EmbedBuilder().setTitle('Ticket Opened').setDescription('Describe your request and staff will reply soon!').setColor(0xE63946).setTimestamp();
        const closeBtn = new ButtonBuilder().setCustomId('close_ticket_' + ch.id).setLabel('Close Ticket').setStyle(ButtonStyle.Danger);
        await ch.send({ content: '' + user + ' <@&' + process.env.STAFF_ROLE_ID + '>', embeds: [e], components: [new ActionRowBuilder().addComponents(closeBtn)] });
        await interaction.reply({ content: 'Ticket opened: ' + ch, ephemeral: true });
        return;
      }

      // ── ORDER BOOST ──
      if (interaction.customId === 'order_boost') {
        const guild = interaction.guild;
        const user = interaction.user;
        const existing = guild.channels.cache.find(c => c.name === 'boost-' + user.username);
        if (existing) { await interaction.reply({ content: 'You already have an open boost ticket: ' + existing, ephemeral: true }); return; }
        const ch = await guild.channels.create({
          name: 'boost-' + user.username,
          type: ChannelType.GuildText,
          parent: process.env.TICKET_CATEGORY_ID || null,
          permissionOverwrites: [
            { id: guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
            { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
            { id: process.env.STAFF_ROLE_ID, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
          ],
        });
        const e = new EmbedBuilder()
          .setTitle('Order Boost')
          .setDescription(
            'Welcome ' + user + '!\n\n' +
            'Please provide the following info:\n\n' +
            '**1.** Current trophies\n' +
            '**2.** Desired trophies / rank\n' +
            '**3.** Brawler (if specific)\n' +
            '**4.** Any additional info\n\n' +
            'A staff member will reply shortly!'
          )
          .setColor(0x5865F2)
          .setFooter({ text: "iDayss's Service • Order Boost" })
          .setTimestamp();
        const closeBtn = new ButtonBuilder().setCustomId('close_ticket_' + ch.id).setLabel('Close Ticket').setStyle(ButtonStyle.Danger);
        await ch.send({ content: '' + user + ' <@&' + process.env.STAFF_ROLE_ID + '>', embeds: [e], components: [new ActionRowBuilder().addComponents(closeBtn)] });
        await interaction.reply({ content: 'Boost ticket opened: ' + ch, ephemeral: true });
        return;
      }

      // ── SKIP IMAGE ──
      if (interaction.customId.startsWith('skip_image_')) {
        const userId = interaction.customId.replace('skip_image_', '');
        if (interaction.user.id !== userId) {
          await interaction.reply({ content: 'You cannot use this button!', ephemeral: true }); return;
        }
        const data = pendingAnnunci.get(userId);
        if (!data) { await interaction.reply({ content: 'Listing data expired, please use /sell again.', ephemeral: true }); return; }
        const accCh = interaction.guild.channels.cache.get(process.env.ACCOUNTS_CHANNEL_ID);
        if (!accCh) { await interaction.reply({ content: 'Accounts channel not found!', ephemeral: true }); return; }
        await accCh.send({ embeds: [data.embed], components: [data.row] });
        const imgCh = interaction.guild.channels.cache.get(data.imgChannelId);
        if (imgCh) await imgCh.delete().catch(() => {});
        pendingAnnunci.delete(userId);
        await interaction.reply({ content: 'Listing published without image!', ephemeral: true });
        return;
      }

      // ── PARTNERSHIP REQUEST button → apre modal ──
      if (interaction.customId === 'request_partnership') {
        const modal = new ModalBuilder().setCustomId('partnership_modal').setTitle('Partnership Request');
        modal.addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId('server_name').setLabel('Server Name').setStyle(TextInputStyle.Short).setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId('server_invite').setLabel('Invite Link').setStyle(TextInputStyle.Short).setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId('server_members').setLabel('Number of Members').setStyle(TextInputStyle.Short).setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId('server_description').setLabel('Server Description').setStyle(TextInputStyle.Paragraph).setRequired(true)
          ),
        );
        await interaction.showModal(modal);
        return;
      }

      // ── PARTNERSHIP ACCEPT (staff) ──
      if (interaction.customId.startsWith('partner_accept_')) {
        if (!interaction.member.roles.cache.has(process.env.STAFF_ROLE_ID)) {
          await interaction.reply({ content: 'Only staff can accept partnerships!', ephemeral: true }); return;
        }

        // Leggi i dati dall'embed del ticket
        const embed = interaction.message.embeds[0];
        const nameField   = embed.fields.find(f => f.name === 'Server');
        const inviteField = embed.fields.find(f => f.name === 'Invite');
        const descField   = embed.fields.find(f => f.name === 'Description');

        const partnerCh = interaction.guild.channels.cache.get(process.env.PARTNERSHIP_CHANNEL_ID);
        if (!partnerCh) {
          await interaction.reply({ content: 'Partnership channel not found! Check PARTNERSHIP_CHANNEL_ID.', ephemeral: true }); return;
        }

        const partnerEmbed = new EmbedBuilder()
          .setTitle('New Partner — ' + (nameField ? nameField.value : 'Unknown'))
          .setColor(0x5865F2)
          .addFields(
            { name: 'Invite', value: inviteField ? inviteField.value : 'N/A', inline: true },
            { name: 'Description', value: descField ? descField.value : 'N/A' },
          )
          .setFooter({ text: "iDayss's Service • Partnership" })
          .setTimestamp();

        await partnerCh.send({ embeds: [partnerEmbed] });

        // Aggiorna il messaggio nel ticket
        const acceptedEmbed = EmbedBuilder.from(embed).setColor(0x2ECC71).setTitle('ACCEPTED — ' + embed.title);
        await interaction.message.edit({ embeds: [acceptedEmbed], components: [] });
        await interaction.reply({ content: 'Partnership accepted! Announcement published in ' + partnerCh, ephemeral: true });

        // Chiudi il ticket dopo 5 secondi
        setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
        return;
      }

      // ── PARTNERSHIP DENY (staff) ──
      if (interaction.customId.startsWith('partner_deny_')) {
        if (!interaction.member.roles.cache.has(process.env.STAFF_ROLE_ID)) {
          await interaction.reply({ content: 'Only staff can deny partnerships!', ephemeral: true }); return;
        }

        const embed = interaction.message.embeds[0];
        const deniedEmbed = EmbedBuilder.from(embed).setColor(0xFF0000).setTitle('DENIED — ' + embed.title);
        await interaction.message.edit({ embeds: [deniedEmbed], components: [] });
        await interaction.reply({ content: 'Partnership denied. Ticket closing in 5 seconds...' });
        setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
        return;
      }
    }

    // ─── MODALS ───
    if (interaction.isModalSubmit()) {

      // ── SELL MODAL ──
      if (interaction.customId === 'sell_account_modal') {
        const title       = interaction.fields.getTextInputValue('acc_title');
        const trophies    = interaction.fields.getTextInputValue('acc_trophies');
        const price       = interaction.fields.getTextInputValue('acc_price');
        const p11line     = interaction.fields.getTextInputValue('acc_p11');
        const extra       = interaction.fields.getTextInputValue('acc_extra') || '';

        const parts       = p11line.split('|').map(s => s.trim());
        const p11         = parts[0] || '?';
        const hypercharge = parts[1] || '?';
        const master      = parts[2] || 'N/A';
        const msgId       = Date.now().toString();

        const embed = new EmbedBuilder()
          .setTitle('🏆 ' + title)
          .setColor(0xE63946)
          .addFields(
            { name: '🏆 Trophies',    value: '**' + trophies + '**',    inline: true },
            { name: '💰 Price',       value: '**' + price + '€**',      inline: true },
            { name: '\u200B',         value: '\u200B',                   inline: true },
            { name: '⭐ P11',         value: '**' + p11 + '**',         inline: true },
            { name: '⚡ Hypercharge', value: '**' + hypercharge + '**', inline: true },
            { name: '👑 Master',      value: '**' + master + '**',      inline: true },
          )
          .setFooter({ text: "iDayss's Service • Account Shop" })
          .setTimestamp();

        if (extra) embed.addFields({ name: '📝 Extra info', value: extra });

        const buyBtn  = new ButtonBuilder().setCustomId('buy_' + msgId).setLabel('🛒 Buy').setStyle(ButtonStyle.Success);
        const soldBtn = new ButtonBuilder().setCustomId('sold_' + msgId).setLabel('✅ Sold [STAFF]').setStyle(ButtonStyle.Danger);
        const row = new ActionRowBuilder().addComponents(buyBtn, soldBtn);

        // Crea canale temporaneo per immagine
        const guild = interaction.guild;
        const user  = interaction.user;
        const imgChannel = await guild.channels.create({
          name: 'img-' + user.username,
          type: ChannelType.GuildText,
          parent: process.env.TICKET_CATEGORY_ID || null,
          permissionOverwrites: [
            { id: guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
            { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles] },
            { id: process.env.STAFF_ROLE_ID, allow: [PermissionFlagsBits.ViewChannel] },
          ],
        });

        const skipBtn = new ButtonBuilder()
          .setCustomId('skip_image_' + user.id)
          .setLabel('Skip image')
          .setStyle(ButtonStyle.Secondary);

        await imgChannel.send({
          content: '' + user + ' 📸 **Send the screenshot of the account here!**\nYou have **5 minutes**.\nOr click the button to publish without image.',
          components: [new ActionRowBuilder().addComponents(skipBtn)],
        });

        pendingAnnunci.set(user.id, { embed, row, msgId, imgChannelId: imgChannel.id });
        setTimeout(async () => {
          if (pendingAnnunci.has(user.id)) {
            pendingAnnunci.delete(user.id);
            const ch = guild.channels.cache.get(imgChannel.id);
            if (ch) await ch.delete().catch(() => {});
          }
        }, 5 * 60 * 1000);

        await interaction.reply({ content: 'Go to ' + imgChannel + ' and send the screenshot!', ephemeral: true });
        return;
      }

      // ── PARTNERSHIP MODAL → crea ticket ──
      if (interaction.customId === 'partnership_modal') {
        const name        = interaction.fields.getTextInputValue('server_name');
        const invite      = interaction.fields.getTextInputValue('server_invite');
        const members     = interaction.fields.getTextInputValue('server_members');
        const description = interaction.fields.getTextInputValue('server_description');

        const guild = interaction.guild;
        const user  = interaction.user;

        // Crea ticket partnership
        const ticketCh = await guild.channels.create({
          name: 'partner-' + user.username,
          type: ChannelType.GuildText,
          parent: process.env.TICKET_CATEGORY_ID || null,
          permissionOverwrites: [
            { id: guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
            { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
            { id: process.env.STAFF_ROLE_ID, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
          ],
        });

        const ticketEmbed = new EmbedBuilder()
          .setTitle('Partnership Request — ' + name)
          .setColor(0x5865F2)
          .addFields(
            { name: 'Server',       value: name,        inline: true },
            { name: 'Members',      value: members,     inline: true },
            { name: 'Invite',       value: invite },
            { name: 'Description',  value: description },
          )
          .setFooter({ text: 'Requested by ' + user.tag })
          .setTimestamp();

        const acceptBtn = new ButtonBuilder()
          .setCustomId('partner_accept_' + ticketCh.id)
          .setLabel('Accept')
          .setStyle(ButtonStyle.Success);

        const denyBtn = new ButtonBuilder()
          .setCustomId('partner_deny_' + ticketCh.id)
          .setLabel('Deny')
          .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(acceptBtn, denyBtn);

        await ticketCh.send({
          content: '' + user + ' <@&' + process.env.STAFF_ROLE_ID + '> new partnership request!',
          embeds: [ticketEmbed],
          components: [row],
        });

        await interaction.reply({ content: 'Your partnership request has been submitted! Check ' + ticketCh, ephemeral: true });
        return;
      }
    }
  },
};
