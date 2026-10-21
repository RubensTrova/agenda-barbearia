// ===== PREENCHA ESTES DOIS VALORES =====
const URL_FICHAS = "https://script.google.com/macros/s/AKfycbzMwr98GDVdScBJjsu7-t5nitrgxj9eBEX20K4NfoPbkQnC4CjbJrJ0oJ6SEhdu_TXTyA/exec";
const NUMERO_WHATSAPP = "Digite seu telefone"; // número que recebe as fichas (só dígitos)
// ========================================

// Mude para true só para testar em dias sem barbearia
const MODO_TESTE = false;

function chaveHoje() {
  return "ficha-" + new Date().toLocaleDateString("pt-BR");
}

async function carregarVagas() {
  const texto = document.getElementById("vagas-texto");
  try {
    const resposta = await fetch(URL_FICHAS);
    const dados = await resposta.json();

    if (dados.restantes > 0) {
      texto.textContent = "Restam " + dados.restantes + " de " + dados.total + " fichas";
    } else {
      texto.textContent = "Fichas esgotadas por hoje";
      document.getElementById("btn-ficha").disabled = true;
    }
  } catch (erro) {
    texto.textContent = "Não foi possível ver as vagas agora.";
  }
}

function mostrarResultado(dados) {
  const mensagem =
    "Olá, me chamo " + dados.nome +
    ", sou o número " + dados.numero +
    " na " + dados.servico.toLowerCase() + ".";
    
    document.getElementById("nome-ficha").textContent = dados.nome;
  document.getElementById("numero-ficha").textContent = dados.numero;
  document.getElementById("servico-ficha").textContent = dados.servico;
  document.getElementById("link-whatsapp").href =
    "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(mensagem);

  document.getElementById("formulario-ficha").hidden = true;
  document.getElementById("resultado-ficha").hidden = false;
}

async function pegarFicha() {
  const nome = document.getElementById("f-nome").value.trim();
  const telefone = document.getElementById("f-telefone").value.trim();
  const matricula = document.getElementById("f-matricula").value.trim();
  const marcado = document.querySelector('input[name="servico"]:checked');
  const msg = document.getElementById("msg-ficha");
  const botao = document.getElementById("btn-ficha");

  if (!nome || !telefone || !matricula) {
    msg.textContent = "Preencha nome, telefone e matrícula.";
    return;
  }
  if (!marcado) {
    msg.textContent = "Escolha Barbearia ou Manicure.";
    return;
  }

  botao.disabled = true;
  msg.textContent = "Pegando sua ficha...";

  const url =
    URL_FICHAS + "?acao=pegar" +
    "&nome=" + encodeURIComponent(nome) +
    "&telefone=" + encodeURIComponent(telefone) +
    "&matricula=" + encodeURIComponent(matricula) +
    "&servico=" + encodeURIComponent(marcado.value);

  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();

    if (dados.ok) {
      localStorage.setItem(chaveHoje(), JSON.stringify(dados));
      msg.textContent = "";
      mostrarResultado(dados);
    } else {
      msg.textContent = dados.erro;
      botao.disabled = false;
    }
  } catch (erro) {
    msg.textContent = "Erro de conexão. Tente de novo.";
    botao.disabled = false;
  }

  carregarVagas();
}

function novaFicha() {
  localStorage.removeItem(chaveHoje());

  document.getElementById("f-nome").value = "";
  document.getElementById("f-telefone").value = "";
  document.getElementById("f-matricula").value = "";

  const marcado = document.querySelector('input[name="servico"]:checked');
  if (marcado) {
    marcado.checked = false;
  }

  document.getElementById("msg-ficha").textContent = "";
  document.getElementById("resultado-ficha").hidden = true;
  document.getElementById("formulario-ficha").hidden = false;
  document.getElementById("btn-ficha").disabled = false;

  carregarVagas();
}

// ----- Início: roda quando a página abre -----
const dataAtual = new Date();
const abertoHoje = MODO_TESTE ||
  (temBarbearia(dataAtual.getDay()) && !buscarExcecao(dataAtual));

if (abertoHoje) {
  document.getElementById("area-fichas").hidden = false;
  document.getElementById("btn-ficha").addEventListener("click", pegarFicha);
  document.getElementById("btn-outra").addEventListener("click", novaFicha);

  carregarVagas();
  setInterval(carregarVagas, 30000);

  const salva = localStorage.getItem(chaveHoje());
  if (salva) {
    mostrarResultado(JSON.parse(salva));
  }
}
