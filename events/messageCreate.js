require('dotenv').config();

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;

    // Cerca nei dati pending di tutti gli eventi
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

    // Controlla che il messaggio sia nel canale temporaneo giusto
    if (message.channel.id !== data.imgChannelId) return;

    // Controlla se c'è un'immagine
    const image = message.attachments.find(a =>
      a.contentType && a.contentType.startsWith('image/')
    );

    if (!image) {
      await message.reply('❌ Please send an **image** file (jpg, png, gif, etc.)!');
      return;
    }

    // Trova il canale accounts
    const accCh = message.guild.channels.cache.get(process.env.ACCOUNTS_CHANNEL_ID);
    if (!accCh) {
      await message.reply('❌ Accounts channel not found! Check ACCOUNTS_CHANNEL_ID.');
      return;
    }

    // Aggiungi immagine all'embed
    data.embed.setImage(image.url);

    // Pubblica nel canale account
    await accCh.send({
      embeds: [data.embed],
      components: [data.row],
    });

    pendingAnnunci.delete(message.author.id);

    await message.reply('✅ Listing published with image in ' + accCh + '!');

    // Cancella il canale temporaneo dopo 3 secondi
    setTimeout(() => message.channel.delete().catch(() => {}), 3000);
  },
};
