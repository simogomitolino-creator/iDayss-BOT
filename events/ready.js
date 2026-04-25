module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Bot online come ${client.user.tag}`);
    client.user.setActivity("iDayss's Services 🛒", { type: 3 }); // WATCHING
  },
};
