const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sell')
    .setDescription('📦 Publish a Brawl Stars account listing')
    .addStringOption(opt =>
      opt.setName('tier')
        .setDescription('Select the account tier')
        .setRequired(true)
        .addChoices(
          { name: '🥇 TIER 1 — Top accounts', value: 'tier1' },
          { name: '🥈 TIER 2 — Mid accounts', value: 'tier2' },
          { name: '🥉 TIER 3 — Budget accounts', value: 'tier3' },
        )
    ),

  async execute(interaction) {
    const tier = interaction.options.getString('tier');

    const tierLabels = {
      tier1: '🥇 TIER 1',
      tier2: '🥈 TIER 2',
      tier3: '🥉 TIER 3',
    };

    const modal = new ModalBuilder()
      .setCustomId('sell_account_modal_' + tier)
      .setTitle('📦 New Account — ' + tierLabels[tier]);

    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('acc_title')
          .setLabel('Ad title (ex: New Account 1776938975743)')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMaxLength(100)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('acc_trophies')
          .setLabel('Trophies | Price€ | P11')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setPlaceholder('ex: 100000 | 300 | 101')
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('acc_p11')
          .setLabel('Hypercharge | Master (number or N/A)')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setPlaceholder('ex: 101 | 1(2025) 7(2024)')
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('acc_extra')
          .setLabel('Extra info (rank 35, ID changeable, etc.)')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false)
          .setPlaceholder('ex: l1 pl id changeable, 2 rank 35, 55k 3vs3...')
      ),
    );

    await interaction.showModal(modal);
  },
};
