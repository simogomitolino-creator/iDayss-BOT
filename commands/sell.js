const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sell')
    .setDescription('📦 Pubblica un annuncio di vendita account Brawl Stars'),

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('sell_account_modal')
      .setTitle('📦 New Account on Sale');

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
          .setLabel('Trophies')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setPlaceholder('es: 100000')
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('acc_price')
          .setLabel('Price (€)')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setPlaceholder('es: 300')
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('acc_p11')
          .setLabel('P11 | Hypercharge | Master')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setPlaceholder('es: 101 | 101 | 1(2025) 7(2024)')
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('acc_extra')
          .setLabel('Extra info (rank 35, ID changeable, etc.)')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false)
          .setPlaceholder('es: l1 pl id changeable, 2 rank 35')
      ),
    );

    await interaction.showModal(modal);
  },
};
