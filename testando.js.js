require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

// Inicializa o bot
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once('ready', async () => {
  console.log(`✅ Bot logado como ${client.user.tag}`);

  try {
    const channel = await client.channels.fetch('1424282235896332399'); // ID do canal
    console.log('📢 Canal encontrado!');

    await channel.send('Teste de emoji animado...');
    await channel.send('<a:5564LoadingColor:1424653199914045450>'); // coloca o ID novo aqui se você tiver
    console.log('✅ Mensagem enviada!');
  } catch (err) {
    console.error('❌ Erro ao tentar enviar mensagem:', err);
  }

  // Encerra o bot após o teste
  setTimeout(() => process.exit(0), 5000);
});

client.login(process.env.TOKEN);
