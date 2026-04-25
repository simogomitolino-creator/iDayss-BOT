const {
  ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder,
  EmbedBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits
} = require('discord.js');
require('dotenv').config();

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {

    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try { await command.execute(interaction, client); }
      catch (err) {
        console.error(err);
        const msg = { content: '❌ Errore nel comando.', ephemeral: true };
        interaction.replied ? await interaction.followUp(msg) : await interaction.reply(msg);
      }
      return;
    }

    if (interaction.isButton()) {

      // BUY
      if (interaction.customId.startsWith('buy_')) {
        const msgId = interaction.customId.replace('buy_', '');
        const originalEmbed = interaction.message.embeds[0];
        const guild = interaction.guild;
        const user = interaction.user;
        const ticketCat = process.env.TICKET_CATEGORY_ID;
        const ch = await guild.channels.create({
          name: `buy-${user.username}-${msgId.slice(-4)}`,
          type: ChannelType.GuildText,
          parent: ticketCat || null,
          permissionOverwrites: [
            { id: guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
            { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
            { id: process.env.STAFF_ROLE_ID, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
          ],
        });
        const tEmbed = new EmbedBuilder()
          .setTitle('🛒 Richiesta Acquisto')
          .setDescription(`${user} vuole acquistare questo account!\nUno staff ti risponderà presto ✅`)
          .setColor(0xE63946).setTimestamp();
        const closeBtn = new ButtonBuilder().setCustomId(`close_ticket_${ch.id}`).setLabel('🔒 Chiudi Ticket').setStyle(ButtonStyle.Danger);
        await ch.send({ content: `${user} <@&${process.env.STAFF_ROLE_ID}>`, embeds: [tEmbed, originalEmbed], components: [new ActionRowBuilder().addComponents(closeBtn)] });
        await interaction.reply({ content: `✅ Ticket aperto: ${ch}`, ephemeral: true });
        return;
      }

      // SOLD
      if (interaction.customId.startsWith('sold_')) {
        if (!interaction.member.roles.cache.has(process.env.STAFF_ROLE_ID)) {
          await interaction.reply({ content: '❌ Solo lo staff può usare questo!', ephemeral: true }); return;
        }
        await interaction.message.delete();
        await interaction.reply({ content: '✅ Annuncio rimosso — venduto!', ephemeral: true });
        return;
      }

      // CLOSE TICKET
      if (interaction.customId.startsWith('close_ticket_')) {
        if (!interaction.member.roles.cache.has(process.env.STAFF_ROLE_ID)) {
          await interaction.reply({ content: '❌ Solo lo staff può chiudere i ticket!', ephemeral: true }); return;
        }
        await interaction.reply({ content: '🔒 Chiusura in 3 secondi...' });
        setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
        return;
      }

      // OPEN TICKET PANEL
      if (interaction.customId === 'open_ticket') {
        const guild = interaction.guild; const user = interaction.user;
        const existing = guild.channels.cache.find(c => c.name === `ticket-${user.username}`);
        if (existing) { await interaction.reply({ content: `❌ Hai già un ticket: ${existing}`, ephemeral: true }); return; }
        const ch = await guild.channels.create({
          name: `ticket-${user.username}`, type: ChannelType.GuildText, parent: process.env.TICKET_CATEGORY_ID || null,
          permissionOverwrites: [
            { id: guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
            { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
            { id: process.env.STAFF_ROLE_ID, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
          ],
        });
        const e = new EmbedBuilder().setTitle('🎫 Ticket Aperto').setDescription('Descrivi la tua richiesta, lo staff risponderà presto!').setColor(0xE63946).setTimestamp();
        const closeBtn = new ButtonBuilder().setCustomId(`close_ticket_${ch.id}`).setLabel('🔒 Chiudi Ticket').setStyle(ButtonStyle.Danger);
        await ch.send({ content: `${user} <@&${process.env.STAFF_ROLE_ID}>`, embeds: [e], components: [new ActionRowBuilder().addComponents(closeBtn)] });
        await interaction.reply({ content: `✅ Ticket: ${ch}`, ephemeral: true });
        return;
      }

      // PARTNERSHIP BUTTON
      if (interaction.customId === 'request_partnership') {
        const modal = new ModalBuilder().setCustomId('partnership_modal').setTitle('📋 Richiesta Partnership');
        modal.addComponents(
          new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('server_name').setLabel('Nome del Server').setStyle(TextInputStyle.Short).setRequired(true)),
          new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('server_invite').setLabel('Link Invito').setStyle(TextInputStyle.Short).setRequired(true)),
          new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('server_members').setLabel('Numero Membri').setStyle(TextInputStyle.Short).setRequired(true)),
          new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('server_description').setLabel('Descrizione').setStyle(TextInputStyle.Paragraph).setRequired(true)),
        );
        await interaction.showModal(modal); return;
      }
    }

    if (interaction.isModalSubmit()) {

      // SELL MODAL
      if (interaction.customId === 'sell_account_modal') {
        const title = interaction.fields.getTextInputValue('acc_title');
        const line1 = interaction.fields.getTextInputValue('acc_trophies');
        const line2 = interaction.fields.getTextInputValue('acc_p11');
        const extra = interaction.fields.getTextInputValue('acc_hypercharge') || '';
        const note  = interaction.fields.getTextInputValue('acc_master') || '';

        const [trophies = '?', price = '?', p11 = '?'] = line1.split('|').map(s => s.trim());
        const [hypercharge = '?', master = 'N/A'] = line2.split('|').map(s => s.trim());

        const msgId = Date.now().toString();
        const embed = new EmbedBuilder()
          .setTitle(`🏆 ${title}`)
          .setColor(0xE63946)
          .addFields(
            { name: '🏆 Coppe', value: `**${trophies}**`, inline: true },
            { name: '💰 Prezzo', value: `**${price}€**`, inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: '⭐ P11', value: `**${p11}**`, inline: true },
            { name: '⚡ Hypercharge', value: `**${hypercharge}**`, inline: true },
            { name: '👑 Master', value: `**${master}**`, inline: true },
          )
          .setFooter({ text: "Dark's Services • Account Shop" })
          .setTimestamp();
        if (extra) embed.addFields({ name: '📝 Info extra', value: extra });
        if (note) embed.addFields({ name: '💬 Note', value: note });

        const buyBtn = new ButtonBuilder().setCustomId(`buy_${msgId}`).setLabel('🛒 Buy').setStyle(ButtonStyle.Success);
        const soldBtn = new ButtonBuilder().setCustomId(`sold_${msgId}`).setLabel('✅ Sold [STAFF]').setStyle(ButtonStyle.Danger);
        const row = new ActionRowBuilder().addComponents(buyBtn, soldBtn);

        const accCh = interaction.guild.channels.cache.get(process.env.ACCOUNTS_CHANNEL_ID);
        if (!accCh) { await interaction.reply({ content: '❌ Imposta ACCOUNTS_CHANNEL_ID nel .env!', ephemeral: true }); return; }
        await accCh.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: `✅ Annuncio pubblicato in ${accCh}!`, ephemeral: true });
        return;
      }

      // PARTNERSHIP MODAL
      if (interaction.customId === 'partnership_modal') {
        const name = interaction.fields.getTextInputValue('server_name');
        const invite = interaction.fields.getTextInputValue('server_invite');
        const members = interaction.fields.getTextInputValue('server_members');
        const description = interaction.fields.getTextInputValue('server_description');
        const pCh = interaction.guild.channels.cache.get(process.env.PARTNERSHIP_CHANNEL_ID);
        if (!pCh) { await interaction.reply({ content: '❌ Imposta PARTNERSHIP_CHANNEL_ID nel .env!', ephemeral: true }); return; }
        const embed = new EmbedBuilder()
          .setTitle(`🤝 Partnership — ${name}`)
          .setColor(0x5865F2)
          .addFields(
            { name: '📨 Link', value: invite, inline: true },
            { name: '👥 Membri', value: members, inline: true },
            { name: '📝 Descrizione', value: description },
          )
          .setFooter({ text: `Proposto da ${interaction.user.tag}` }).setTimestamp();
        await pCh.send({ content: `<@&${process.env.STAFF_ROLE_ID}> nuova richiesta!`, embeds: [embed] });
        await interaction.reply({ content: '✅ Richiesta inviata!', ephemeral: true });
        return;
      }
    }
  },
};
