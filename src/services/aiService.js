import Groq from "groq-sdk";

const apiKey = import.meta.env.VITE_GROQ_API_KEY || localStorage.getItem('minha_chave_groq');

const groq = new Groq({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true
});

export const obterRespostaIA = async (pergunta, dadosDoApp, perfil, historico = []) => {
  try {

    const perguntaLower = pergunta.toLowerCase();

    // procura animal citado
    const itemEncontrado = dadosDoApp.find(item =>
      perguntaLower.includes(item.nome.toLowerCase())
    );

    // HISTÓRICO curto
    const mensagensAnteriores = historico.slice(-3).map(msg => ({
      role: msg.autor === "user" ? "user" : "assistant",
      content: msg.texto
    }));

    // 🐦 SE ENCONTROU ANIMAL
    if (itemEncontrado) {

      const dados = `
Nome: ${itemEncontrado.nome}
Local: ${itemEncontrado.local}
Clima: ${Array.isArray(itemEncontrado.clima) ? itemEncontrado.clima.join(", ") : itemEncontrado.clima}
Horário: ${itemEncontrado.horario}
`;

      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
Você é a IA Guia do catálogo Heartopia 🦋

Seja fofo e simpático, mas objetivo.

Quando o usuário perguntar onde encontrar um animal, diga apenas:

🌿 Local: ...
🌦️ Clima: ...
🕒 Horário: ...

Use apenas os dados fornecidos.
Nunca invente informações.

Dados:
${dados}
`
          },
          ...mensagensAnteriores,
          { role: "user", content: pergunta }
        ]
      });

      return completion?.choices?.[0]?.message?.content;
    }

    // 💬 SE NÃO FOR SOBRE ANIMAL
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
Você é o Guia de Heartopia 🦋

Você é simpático, fofo e gosta de conversar.

Você ajuda jogadores a encontrar animais, mas também pode conversar normalmente, porém esse não é seu objetivo.

Se o usuário apenas cumprimentar, responda de forma amigável.
`
        },
        ...mensagensAnteriores,
        { role: "user", content: pergunta }
      ]
    });

    return completion?.choices?.[0]?.message?.content;

  } catch (erro) {
    console.error("Erro na IA:", erro);
    return "O Guia ficou confuso com o vento das borboletas... 🦋 Tente novamente!";
  }
};