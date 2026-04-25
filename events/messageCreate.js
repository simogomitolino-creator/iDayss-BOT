const { EmbedBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    // Ignora bot e messaggi senza immagini
    if (message.author.bot) return;

    // Prendi la Map dei pending dall'evento interactionCreate
    const interactionEvent = client.eventModules?.get('interactionCreate');
    if (!interactionEvent) return;
    const pendingAnnunci = interactionEvent.getPendingAnnunci();

    const data = pendingAnnunci.get(message.author.id);
    if (!data) return;

    // Controlla se il messaggio ha un'immagine
    const image = message.attachments.find(a => a.contentType?.startsWith('image/'));
    if (!image) return;

    const accCh = message.guild?.channels.cache.get(process.env.ACCOUNTS_CHANNEL_ID);
    if (!accCh) return;

    // Aggiungi l'immagine all'embed
    data.embed.setImage(image.url);

    await accCh.send({ embeds: [data.embed], components: [data.row] });
    pendingAnnunci.delete(message.author.id);

    // Elimina il messaggio con l'immagine dal canale corrente (opzionale, per pulizia)
    await message.delete().catch(() => {});

    await message.channel.send({ content: `✅ <@${message.author.id}> Annuncio pubblicato con immagine in ${accCh}!` })
      .then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
  },
};
