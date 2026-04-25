const {
  SlashCommandBuilder, EmbedBuilder, ActionRowBuilder,
  ButtonBuilder, ButtonStyle, PermissionFlagsBits
} = require('discord.js');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Send server panels [STAFF]')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(opt =>
      opt.setName('tipo')
        .setDescription('Which panel to send?')
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
          .setTitle('🎫 Ticket System — iDayss\'s Service')
          .setDescription(
            '**Need support?**\n\n' +
            '🛒 Want to buy an account?\n' +
            '❓ Have a question?\n' +
            '⚠️ Have a problem?\n\n' +
            'Click the button below to open a private ticket with our staff!'
          )
          .setColor(0xE63946)
          .setFooter({ text: 'iDayss\'s Service • Support System' });

        const btnTicket = new ButtonBuilder()
          .setCustomId('open_ticket')
          .setLabel('🎫 Open a Ticket')
          .setStyle(ButtonStyle.Danger);

        const btnBoost = new ButtonBuilder()
          .setCustomId('order_boost')
          .setLabel('🚀 Order Boost')
          .setStyle(ButtonStyle.Primary);

        await interaction.channel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(btnTicket, btnBoost)] });
        await interaction.editReply({ content: 'Ticket panel sent!' });

      } else if (tipo === 'rules') {
        const embed = new EmbedBuilder()
          .setTitle('📜 Rules — iDayss\'s Service')
          .setColor(0xE63946)
          .setDescription(
            '> Welcome to **iDayss\'s Service**! Please read the rules carefully before participating.\n\n' +
            '**〔 1 〕** 🤝 **Be respectful** — Treat all members with respect. Harassment, insults or toxic behaviour will not be tolerated.\n\n' +
            '**〔 2 〕** 🚫 **No spam** — Do not flood chats with repeated messages, links or unnecessary mentions.\n\n' +
            '**〔 3 〕** 🔞 **No NSFW content** — Any inappropriate, explicit or offensive content is strictly forbidden.\n\n' +
            '**〔 4 〕** 🛒 **No scamming** — Any attempt to scam other members will result in an immediate permanent ban.\n\n' +
            '**〔 5 〕** 📣 **No unauthorized advertising** — Do not promote other servers or services without staff permission.\n\n' +
            '**〔 6 〕** 🎮 **Use the right channels** — Keep conversations and content in their appropriate channels.\n\n' +
            '**〔 7 〕** 👮 **Respect the staff** — Follow staff instructions at all times. If you disagree, open a ticket.\n\n' +
            '**〔 8 〕** 🔒 **Protect your privacy** — Never share personal information such as passwords or payment details.\n\n' +
            '**〔 9 〕** 🌐 **English or Italian only** — Please communicate only in English or Italian in public channels.\n\n' +
            '> ⚠️ *Breaking the rules may result in a warn, mute, kick or permanent ban depending on severity.*'
          )
          .setFooter({ text: 'iDayss\'s Service • Rules' })
          .setTimestamp();

        await interaction.channel.send({ embeds: [embed] });
        await interaction.editReply({ content: 'Rules panel sent!' });

      } else if (tipo === 'partnership') {
        const embed = new EmbedBuilder()
          .setTitle('🤝 Partnership — iDayss\'s Service')
          .setDescription(
            '> Looking to grow together? Partner up with **iDayss\'s Service**!\n\n' +
            '**📋 Requirements:**\n\n' +
            '**〔 1 〕** 👥 Minimum **100 members**\n\n' +
            '**〔 2 〕** 📊 Active and healthy community\n\n' +
            '**〔 3 〕** ✅ Server must follow Discord\'s Terms of Service\n\n' +
            '**〔 4 〕** 🚫 No NSFW, hate speech or harmful content\n\n' +
            '**〔 5 〕** 🔁 Must be willing to post our ad in return\n\n' +
            '> 📩 *Click the button below to submit your partnership request. Our staff will review it shortly.*'
          )
          .setColor(0x5865F2)
          .setFooter({ text: 'iDayss\'s Service • Partnership' });

        const btn = new ButtonBuilder()
          .setCustomId('request_partnership')
          .setLabel('Request Partnership')
          .setStyle(ButtonStyle.Primary);

        await interaction.channel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(btn)] });
        await interaction.editReply({ content: 'Partnership panel sent!' });

      } else if (tipo === 'vouches') {
        const embed = new EmbedBuilder()
          .setTitle('⭐ Vouches — iDayss\'s Service')
          .setDescription(
            '> Did you purchase an account from us? Leave a review!\n\n' +
            'Use the **/vouch** command to leave your feedback.\n\n' +
            'Thank you for trusting **iDayss\'s Service**!'
          )
          .setColor(0xFFD700)
          .setFooter({ text: 'iDayss\'s Service • Vouches' });

        await interaction.channel.send({ embeds: [embed] });
        await interaction.editReply({ content: 'Vouches panel sent!' });
      }

    } catch (err) {
      console.error('Errore /setup:', err);
      try {
        await interaction.editReply({ content: 'Error: ' + err.message });
      } catch {
        await interaction.reply({ content: 'Error: ' + err.message, ephemeral: true });
      }
    }
  },
};
