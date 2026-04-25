const {
  SlashCommandBuilder, EmbedBuilder, ActionRowBuilder,
  ButtonBuilder, ButtonStyle, PermissionFlagsBits
} = require('discord.js');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('⚙️ Send server panels [STAFF]')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(opt =>
      opt.setName('type')
        .setDescription('Which panel do you want to send?')
        .setRequired(true)
        .addChoices(
          { name: '🎫 Ticket', value: 'ticket' },
          { name: '📜 Rules', value: 'rules' },
          { name: '🤝 Partnership', value: 'partnership' },
          { name: '⭐ Vouches', value: 'vouches' },
        )
    ),

  async execute(interaction) {
    const tipo = interaction.options.getString('type');

    // ------------------ TICKET PANEL ------------------
    if (tipo === 'ticket') {
      const embed = new EmbedBuilder()
        .setTitle("🎫 Ticket System — iDayss's Services")
        .setDescription(
          "**Do you need support?**\n\n" +
          "📦 Want to buy an account?\n" +
          "❓ Have questions?\n" +
          "⚠️ Do you have a problem?\n\n" +
          "Click the button below to open a private ticket with the staff!"
        )
        .setColor(0xE63946)
        .setFooter({ text: "iDayss's Services • Support System" });

      const btn = new ButtonBuilder()
        .setCustomId('open_ticket')
        .setLabel('🎫 Open a Ticket')
        .setStyle(ButtonStyle.Danger);

      await interaction.channel.send({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(btn)]
      });

      return interaction.reply({ content: '✅ Ticket panel sent!', ephemeral: true });
    }

    // ------------------ RULES PANEL ------------------
    else if (tipo === 'rules') {
      const embed = new EmbedBuilder()
        .setTitle("📜 Server Rules — iDayss's Services")
        .setColor(0xE63946)
        .setDescription(
          "**Welcome to the server! Please read the rules carefully:**\n\n" +
          "1. 🤝 Respect all members\n" +
          "2. 🚫 No spam or flooding channels\n" +
          "3. 🔞 No inappropriate content\n" +
          "4. 🛒 No scams — violators will be banned\n" +
          "5. 📣 No unauthorized advertising\n" +
          "6. 🎮 Talk in the correct channels\n" +
          "7. 👮 Follow staff instructions\n" +
          "8. 🔒 Do not share personal information\n\n" +
          "*Breaking the rules may result in: warn, mute, kick, or ban.*"
        )
        .setFooter({ text: "iDayss's Services • Rules" })
        .setTimestamp();

      await interaction.channel.send({ embeds: [embed] });
      return interaction.reply({ content: '✅ Rules panel sent!', ephemeral: true });
    }

    // ------------------ PARTNERSHIP PANEL ------------------
    else if (tipo === 'partnership') {
      const embed = new EmbedBuilder()
        .setTitle("🤝 Partnership — iDayss's Services")
        .setDescription(
          "**Do you want to partner with us?**\n\n" +
          "📋 Requirements:\n" +
          "• Minimum **100 members**\n" +
          "• Active server\n" +
          "• Content not prohibited by Discord\n\n" +
          "Click the button below to submit your partnership request!"
        )
        .setColor(0x5865F2)
        .setFooter({ text: "iDayss's Services • Partnership" });

      const btn = new ButtonBuilder()
        .setCustomId('request_partnership')
        .setLabel('📋 Partnership Request')
        .setStyle(ButtonStyle.Primary);

      await interaction.channel.send({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(btn)]
      });

      return interaction.reply({ content: '✅ Partnership panel sent!', ephemeral: true });
    }

    // ------------------ VOUCHES PANEL ------------------
    else if (tipo === 'vouches') {
      const embed = new EmbedBuilder()
        .setTitle("⭐ Vouches — iDayss's Services")
        .setDescription(
          "**Have you purchased an account from us?**\n\n" +
          "Leave a review in this channel!\n\n" +
          "📝 **Suggested format:**\n" +
          "```\n" +
          "⭐ Voucher for: [staff name]\n" +
          "📦 Purchased: [account description]\n" +
          "💬 Comment: [your experience]\n" +
          "```\n\n" +
          "*Thank you for trusting iDayss's Services!*"
        )
        .setColor(0xFFD700)
        .setFooter({ text: "iDayss's Services • Vouches" });

      await interaction.channel.send({ embeds: [embed] });
      return interaction.reply({ content: '✅ Vouches panel sent!', ephemeral: true });
    }
  },
};
