const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sell')
    .setDescription('📦 Publish a Brawl Stars account listing'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📦 New Account Listing')
      .setDescription('Select the **tier** of the account you want to sell:')
      .addFields(
        { name: '🥇 TIER 1', value: 'Top accounts — high trophies, rare skins', inline: true },
        { name: '🥈 TIER 2', value: 'Mid accounts — good value for money',       inline: true },
        { name: '🥉 TIER 3', value: 'Budget accounts — starter accounts',         inline: true },
      )
      .setColor(0xE63946)
      .setFooter({ text: "iDayss's Service • Select a tier to continue" });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('sell_tier_tier1').setLabel('🥇 TIER 1').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('sell_tier_tier2').setLabel('🥈 TIER 2').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('sell_tier_tier3').setLabel('🥉 TIER 3').setStyle(ButtonStyle.Success),
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  },
};
