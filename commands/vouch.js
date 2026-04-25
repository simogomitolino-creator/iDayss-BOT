const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vouch')
    .setDescription('Lascia un vouch per un acquisto')
    .addUserOption(opt =>
      opt.setName('staff').setDescription('Lo staff con cui hai trattato').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('acquisto').setDescription('Cosa hai acquistato?').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('commento').setDescription('La tua esperienza').setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName('stelle').setDescription('Valutazione (1-5)').setRequired(true).setMinValue(1).setMaxValue(5)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const staff    = interaction.options.getUser('staff');
      const acquisto = interaction.options.getString('acquisto');
      const commento = interaction.options.getString('commento');
      const stelle   = interaction.options.getInteger('stelle');

      const stars = 'star'.repeat(stelle);
      const starsEmoji = '⭐'.repeat(stelle) + '☆'.repeat(5 - stelle);

      const embed = new EmbedBuilder()
        .setTitle(starsEmoji + ' Vouch')
        .setColor(0xFFD700)
        .addFields(
          { name: 'Acquirente', value: String(interaction.user),  inline: true },
          { name: 'Staff',      value: String(staff),             inline: true },
          { name: 'Acquistato', value: acquisto },
          { name: 'Commento',   value: commento },
          { name: 'Valutazione', value: starsEmoji + ' (' + stelle + '/5)' },
        )
        .setThumbnail(interaction.user.displayAvatarURL())
        .setFooter({ text: 'iDayss Service • Vouches' })
        .setTimestamp();

      const vouchChannelId = process.env.VOUCHES_CHANNEL_ID;
      if (!vouchChannelId) {
        await interaction.editReply({ content: 'Errore: VOUCHES_CHANNEL_ID non impostato nelle variabili!' });
        return;
      }

      const vouchChannel = interaction.guild.channels.cache.get(vouchChannelId);
      if (!vouchChannel) {
        await interaction.editReply({ content: 'Errore: canale vouches non trovato! ID: ' + vouchChannelId });
        return;
      }

      await vouchChannel.send({ embeds: [embed] });
      await interaction.editReply({ content: 'Vouch inviato in ' + vouchChannel.toString() + '! Grazie!' });

    } catch (err) {
      console.error('Errore /vouch:', err);
      try {
        await interaction.editReply({ content: 'Errore: ' + err.message });
      } catch {
        await interaction.reply({ content: 'Errore: ' + err.message, ephemeral: true });
      }
    }
  },
};
