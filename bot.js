// 🕒 Define o fuso horário correto
process.env.TZ = 'America/Sao_Paulo';

// 🔒 Carrega variáveis do .env
require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const express = require('express');

// 🚫 Verifica se o token existe
if (!process.env.TOKEN) {
  console.error("❌ ERRO: Token não encontrado no arquivo .env");
  process.exit(1);
}

// 🤖 Cria o cliente do bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// 🏠 IDs fixos
const guildId = '1424280217731596310';
const channelId = '1424679986853314630';

// 📋 Cargos a serem listados
const cargos = [
  { name: 'OWNER', roleId: '1424282082636595313' },
  { name: 'C.E.O', roleId: '1424282087241810020' },
  { name: 'RESPONSAVEL • STAFF', roleId: '1424282091142512680' },
  { name: 'RESPONSAVEL • TICKETS', roleId: '1424282103209525248' },
  { name: 'EQUIPE • SUPERVISOR', roleId: '1424282104623005748' },
  { name: 'EQUIPE • COORDENADOR', roleId: '1424282106040942622' },
  { name: 'EQUIPE • ADMIN GERAL', roleId: '1424282107232124928' },
  { name: 'EQUIPE • ADM', roleId: '1424282108385558578' },
  { name: 'EQUIPE • DIRETOR', roleId: '1424282109710962740' },
  { name: 'EQUIPE • TICKET', roleId: '1424282110990225408' },
  { name: 'EQUIPE • MOD', roleId: '1424282113489895544' },
  { name: 'EQUIPE • SUPORTE', roleId: '1424282114555117702' },
];

// 🔄 Emoji animado
const emojiAnimado = '<a:5564LoadingColor:1424653199914045450>';

// 🔁 Função para atualizar as mensagens
async function atualizarMensagens(guild, channel) {
  console.log('🔄 Atualizando mensagens...');
  await guild.members.fetch();

  const mensagens = await channel.messages.fetch({ limit: 100 });
  const mensagensBot = mensagens.filter(m => m.author.id === client.user.id);

  const membrosJaListados = new Set();

  for (const c of cargos) {
    const role = guild.roles.cache.get(c.roleId);
    if (!role) continue;

    const membrosFiltrados = role.members.filter(m => {
      if (m.id === client.user.id || membrosJaListados.has(m.id)) return false;
      membrosJaListados.add(m.id);
      return true;
    });

    const membrosTexto = membrosFiltrados.size
      ? membrosFiltrados.map(m => `• <@${m.id}>`).join('\n')
      : 'Nenhum membro';

    const embed = new EmbedBuilder()
      .setColor(role.color || 0x2b2d31) // <- agora pega a cor REAL do cargo
      .setTitle(`${role.name} – [${membrosFiltrados.size}] membros`)
      .setDescription(
        `<@&${role.id}>\n\n${membrosTexto}\n\n${emojiAnimado} Atualizado automaticamente | Última alteração: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`
      );

    const mensagemExistente = mensagensBot.find(
      m => m.embeds[0]?.title?.startsWith(role.name)
    );

    try {
      if (mensagemExistente) {
        await mensagemExistente.edit({ embeds: [embed] });
        console.log(`✏️ Editado: ${role.name}`);
      } else {
        await channel.send({ embeds: [embed] });
        console.log(`🆕 Criado: ${role.name}`);
      }
    } catch (err) {
      console.error(`❌ Erro ao atualizar ${c.name}:`, err);
    }
  }

  console.log('✅ Atualização concluída.');
}

// 🚀 Quando o bot ficar online
client.once('ready', async () => {
  console.log(`✅ Logado como ${client.user.tag}!`);
  try {
    const guild = await client.guilds.fetch(guildId);
    const channel = await client.channels.fetch(channelId);

    await atualizarMensagens(guild, channel);
    setInterval(() => atualizarMensagens(guild, channel), 60000);
  } catch (err) {
    console.error('❌ Erro ao buscar servidor/canal:', err);
  }
});

// 🔑 Login do bot
client.login(process.env.TOKEN);

// 🌍 Servidor web para o Render
const server = express();
server.all('/', (req, res) => res.send('Bot is running!'));
server.listen(3000, () => console.log('🌐 Servidor web ativo na porta 3000'));
