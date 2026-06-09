const db = require('../../lib/database'); // apne database path ke hisaab se

module.exports = {
  name: 'antilink',
  aliases: ['alink'],
  category: 'group',
  description: 'Antilink protection on/off or set action (delete/kick)',
  usage: '.antilink [on/off/set/get]',
  groupOnly: true,
  adminOnly: true,
  botAdminNeeded: true,
  execute: async (client, msg, args) => {
    const chatId = msg.key.remoteJid;
    if (!chatId.endsWith('@g.us')) return;

    let settings = db.getGroupSettings(chatId) || { antilink: false, antilinkAction: 'delete' };

    if (!args[0]) {
      return client.sendMessage(chatId, {
        text: `🔗 *Antilink Status*\nStatus: ${settings.antilink ? 'ON' : 'OFF'}\nAction: ${settings.antilinkAction || 'delete'}\n\n.antilink on/off\n.antilink set delete/kick`
      });
    }

    const opt = args[0].toLowerCase();

    if (opt === 'on') {
      settings.antilink = true;
      db.updateGroupSettings(chatId, settings);
      return client.sendMessage(chatId, { text: '✅ Antilink turned ON' });
    }
    if (opt === 'off') {
      settings.antilink = false;
      db.updateGroupSettings(chatId, settings);
      return client.sendMessage(chatId, { text: '❌ Antilink turned OFF' });
    }
    if (opt === 'set' && args[1]) {
      const action = args[1].toLowerCase();
      if (action !== 'delete' && action !== 'kick') return client.sendMessage(chatId, { text: 'Action must be delete or kick' });
      settings.antilinkAction = action;
      settings.antilink = true; // auto enable
      db.updateGroupSettings(chatId, settings);
      return client.sendMessage(chatId, { text: `⚙️ Action set to ${action}` });
    }
    if (opt === 'get') {
      return client.sendMessage(chatId, {
        text: `📋 *Config*\nAntilink: ${settings.antilink ? 'ON' : 'OFF'}\nAction: ${settings.antilinkAction || 'delete'}`
      });
    }
  }
};
