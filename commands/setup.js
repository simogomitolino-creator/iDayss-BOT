const {
  SlashCommandBuilder, EmbedBuilder, ActionRowBuilder,
  ButtonBuilder, ButtonStyle, PermissionFlagsBits
} = require('discord.js');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Invia i pannelli del server [STAFF]')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(opt =>
      opt.setName('tipo')
        .setDescription('Quale pannello inviare?')
        .setRequired(true)
        .addChoices(
          { name: 'Ticket',      value: 'ticket' },
          { name: 'Rules',       value: 'rules' },
          { name: 'Partnership', value: 'partnership' },
          { name: 'Vouches',     value: 'vouches' },
        )
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });
      const tipo = interaction.options.getString('tipo');

      if (tipo === 'ticket') {
        const embed = new EmbedBuilder()
          .setTitle('Sistema Ticket — iDayss Service')
          .setDescription(
            '**Hai bisogno di supporto?**\n\n' +
            'Vuoi acquistare un account?\n' +
            'Hai domande o problemi?\n\n' +
            'Clicca il pulsante qui sotto per aprire un ticket privato con lo staff!'
          )
          .setColor(0xE63946)
          .setFooter({ text: 'iDayss Service • Support System' });

        const btn = new ButtonBuilder()
          .setCustomId('open_ticket')
          .setLabel('Apri un Ticket')
          .setStyle(ButtonStyle.Danger);

        await interaction.channel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(btn)] });
        await interaction.editReply({ content: 'Pannello ticket inviato!' });

      } else if (tipo === 'rules') {
        const embed = new EmbedBuilder()
          .setTitle('Regole del Server — iDayss Service')
          .setColor(0xE63946)
          .setDescription(
            '**Benvenuto nel server! Leggi attentamente le regole:**\n\n' +
            '**1.** Rispetta tutti i membri\n' +
            '**2.** No spam o flood nei canali\n' +
            '**3.** No contenuti inappropriati\n' +
            '**4.** Nessuna truffa — violatori saranno bannati\n' +
            '**5.** No pubblicita non autorizzate\n' +
            '**6.** Parla nei canali corretti\n' +
            '**7.** Segui le istruzioni dello staff\n' +
            '**8.** Non condividere info personali\n\n' +
            'Violando le regole si rischiano: warn, mute, kick o ban.'
          )
          .setFooter({ text: 'iDayss Service • Rules' })
          .setTimestamp();

        await interaction.channel.send({ embeds: [embed] });
        await interaction.editReply({ content: 'Regole inviate!' });

      } else if (tipo === 'partnership') {
        const embed = new EmbedBuilder()
          .setTitle('Partnership — iDayss Service')
          .setDescription(
            '**Vuoi fare partnership con noi?**\n\n' +
            'Requisiti:\n' +
            'Minimo 100 membri\n' +
            'Server attivo\n' +
            'Contenuto non esplicitamente vietato\n\n' +
            'Clicca il pulsante per inviare la tua richiesta!'
          )
          .setColor(0x5865F2)
          .setFooter({ text: 'iDayss Service • Partnership' });

        const btn = new ButtonBuilder()
          .setCustomId('request_partnership')
          .setLabel('Richiedi Partnership')
          .setStyle(ButtonStyle.Primary);

        await interaction.channel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(btn)] });
        await interaction.editReply({ content: 'Pannello partnership inviato!' });

      } else if (tipo === 'vouches') {
        const embed = new EmbedBuilder()
          .setTitle('Vouches — iDayss Service')
          .setDescription(
            '**Hai acquistato un account da noi?**\n\n' +
            'Lascia una recensione usando il comando /vouch!\n\n' +
            'Grazie per la fiducia in iDayss Service!'
          )
          .setColor(0xFFD700)
          .setFooter({ text: 'iDayss Service • Vouches' });

        await interaction.channel.send({ embeds: [embed] });
        await interaction.editReply({ content: 'Pannello vouches inviato!' });
      }

    } catch (err) {
      console.error('Errore /setup:', err);
      try {
        await interaction.editReply({ content: 'Errore: ' + err.message });
      } catch {
        await interaction.reply({ content: 'Errore: ' + err.message, ephemeral: true });
      }
    }
  },
};
