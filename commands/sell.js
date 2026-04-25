const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sell')
    .setDescription('📦 Post a Brawl Stars account sale ad'),

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('sell_account_modal')
      .setTitle('📦 New Account on Sale');

    const titleInput = new TextInputBuilder()
      .setCustomId('acc_title')
      .setLabel('Ad title (ex: New Account 1776938975743)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMaxLength(100);

    const trophiesInput = new TextInputBuilder()
      .setCustomId('acc_trophies')
      .setLabel('Trophies')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setPlaceholder('ex: 100000');

    const priceInput = new TextInputBuilder()
      .setCustomId('acc_price')
      .setLabel('Price (€)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setPlaceholder('ex: 300');

    const p11Input = new TextInputBuilder()
      .setCustomId('acc_p11')
      .setLabel('P11 | Hypercharge | Master')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setPlaceholder('ex: 101 | 101 | 1(2025) 7(2024)');

    const extraInput = new TextInputBuilder()
      .setCustomId('acc_extra')
      .setLabel('Extra info (rank 35, ID changeable, etc.)')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false)
      .setPlaceholder('ex: l1 pl id changeable, 2 rank 35');

    modal.addComponents(
      new ActionRowBuilder().addComponents(titleInput),
      new ActionRowBuilder().addComponents(trophiesInput),
      new ActionRowBuilder().addComponents(priceInput),
      new ActionRowBuilder().addComponents(p11Input),
      new ActionRowBuilder().addComponents(extraInput)
    );

    await interaction.showModal(modal);
  },
};
