require('dotenv').config();

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;

    // Trova la Map dei pending
    let pendingAnnunci = null;
    for (const [, mod] of client.eventModules) {
      if (typeof mod.getPendingAnnunci === 'function') {
        pendingAnnunci = mod.getPendingAnnunci();
        break;
      }
    }
    if (!pendingAnnunci) return;

    const data = pendingAnnunci.get(message.author.id);
    if (!data) return;

    // Solo nel canale temporaneo corretto
    if (message.channel.id !== data.imgChannelId) return;

    // Controlla immagine
    const image = message.attachments.find(a =>
      a.contentType && a.contentType.startsWith('image/')
    );

    if (!image) {
      await message.reply('❌ Please send an **image** file (jpg, png, gif, etc.)!');
      return;
    }

    // Usa il canale tier salvato, oppure fallback su ACCOUNTS_CHANNEL_ID
    const channelId = data.tierChId || process.env.ACCOUNTS_CHANNEL_ID;
    const accCh = message.guild.channels.cache.get(channelId);
    if (!accCh) {
      await message.reply('❌ Channel not found! Check your TIER channel IDs in the variables.');
      return;
    }

    // Aggiungi immagine all'embed e pubblica
    data.embed.setImage(image.url);
    await accCh.send({ embeds: [data.embed], components: [data.row] });

    pendingAnnunci.delete(message.author.id);
    await message.reply('✅ Listing published in ' + accCh + '!');

    // Cancella canale temporaneo dopo 3 secondi
    setTimeout(() => message.channel.delete().catch(() => {}), 3000);
  },
};
