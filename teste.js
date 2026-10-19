// ============================================
// AVISOS: edite só esta parte quando precisar
// Formato da data: "AAAA-MM-DD" (com zeros)
// ============================================
const diasSemBarbearia = [
  // { data: "2026-10-20", motivo: "Barbeiro indisponível" },
];

// ============================================

const nomesDias = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado"
];

function temBarbearia(dia) {
  return dia === 2 || dia === 4;
}

function formatarData(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return ano + "-" + mes + "-" + dia;
}

function buscarExcecao(data) {
  const dataTexto = formatarData(data);
  return diasSemBarbearia.find(function (item) {
    return item.data === dataTexto;
  });
}

function mostrar(elementoId, rotulo, data) {
  const elemento = document.getElementById(elementoId);
  const numeroDia = data.getDay();
  const nomeDia = nomesDias[numeroDia];
  const dataTexto = data.toLocaleDateString("pt-BR");
  const excecao = buscarExcecao(data);
  const cabecalho = "<b>" + rotulo + "</b><br>" + nomeDia + ", " + dataTexto + "<br>";

  if (excecao) {
    const motivo = excecao.motivo ? "<br><small>" + excecao.motivo + "</small>" : "";
    elemento.innerHTML = cabecalho + "Não tem barbearia" + motivo;
    elemento.classList.add("nao-tem");
  } else if (temBarbearia(numeroDia)) {
    elemento.innerHTML = cabecalho + "TEM barbearia";
    elemento.classList.add("tem");
  } else {
    elemento.innerHTML = cabecalho + "Não tem barbearia";
    elemento.classList.add("nao-tem");
  }
}

const hoje = new Date();
const amanha = new Date();
amanha.setDate(hoje.getDate() + 1);

mostrar("hoje", "Hoje", hoje);
mostrar("amanha", "Amanhã", amanha);