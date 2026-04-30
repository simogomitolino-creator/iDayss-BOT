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

    // Scarica l'immagine e la re-uploada direttamente nel canale dell'annuncio
    // In questo modo l'URL rimane valido anche dopo la cancellazione del canale temporaneo
    const { AttachmentBuilder } = require('discord.js');
    const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args)).catch(() => null);

    let sentMsg;
    try {
      // Prova a scaricare e re-uploadare
      const res = fetch ? await fetch(image.url) : null;
      if (res && res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        const ext = image.name.split('.').pop() || 'png';
        const attachment = new AttachmentBuilder(buffer, { name: 'account.' + ext });
        data.embed.setImage('attachment://account.' + ext);
        sentMsg = await accCh.send({ embeds: [data.embed], components: [data.row], files: [attachment] });
      } else {
        throw new Error('fetch failed');
      }
    } catch (e) {
      // Fallback: usa il proxy URL di Discord che dura più a lungo
      const proxyUrl = image.proxyURL || image.url;
      data.embed.setImage(proxyUrl);
      sentMsg = await accCh.send({ embeds: [data.embed], components: [data.row] });
    }

    pendingAnnunci.delete(message.author.id);
    await message.reply('✅ Listing published in ' + accCh + '!');

    // Cancella il canale temporaneo dopo 4 secondi
    // L'immagine è già nel canale accounts quindi l'URL non dipende più da questo canale
    setTimeout(() => message.channel.delete().catch(() => {}), 4000);
  },
};
