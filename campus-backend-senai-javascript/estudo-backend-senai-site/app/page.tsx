"use client";

import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  BarChart3,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Code2,
  Compass,
  FileCode2,
  Flame,
  GraduationCap,
  LayoutDashboard,
  LockKeyhole,
  Medal,
  Play,
  Radar,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Upload,
  UserRound,
  XCircle,
  RotateCcw,
  LibraryBig,
  BookMarked
} from "lucide-react";
import { completedModules, plannedModules, currentLesson, CourseModule } from "@/lib/course";
import Classroom from "@/components/Classroom";
import PracticeArena from "@/components/PracticeArena";
import { courseLibrary } from "@/lib/courseLibrary";
import { readArrayLength, readMasteredModules, readSequentialIntegers, readUniqueIntegers, readUniqueStrings } from "@/lib/progress";

type View = "dashboard" | "trilha" | "aula" | "laboratorio" | "arena" | "conquistas" | "perfil";

const nav: { id: View; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { id: "dashboard", label: "Visão geral", icon: LayoutDashboard },
  { id: "trilha", label: "Grade curricular", icon: GraduationCap },
  { id: "aula", label: "Sala de aula", icon: BookOpen },
  { id: "laboratorio", label: "Laboratório", icon: Code2 },
  { id: "arena", label: "Arena de desafios", icon: Trophy },
  { id: "conquistas", label: "Conquistas", icon: Medal },
  { id: "perfil", label: "Desempenho", icon: BarChart3 },
];

const starterCode = `// Aula atual · Funções JavaScript
// Objetivo: receber uma idade e devolver uma resposta booleana.

function verificarMaioridade(idade) {
    // A condição usa o valor recebido no parâmetro idade.
    if (idade >= 18) {
        return true;
    }

    return false;
}

// 20 é o argumento enviado para a função.
const resultado = verificarMaioridade(20);
console.log(resultado);`;

const functionMissionFile = "Desafio01_Pedido.js";
const functionMissionCode = `// MISSÃO FINAL M07 · FUNÇÕES
// Complete as três funções sem consultar a solução da biblioteca.

function calcularSubtotal(preco, quantidade) {
    // devolva preco * quantidade
}

function calcularDesconto(subtotal, percentual) {
    // devolva o valor do desconto
}

function calcularTotalPedido(preco, quantidade, percentualDesconto) {
    // 1. valores inválidos devem devolver 0
    // 2. chame as duas funções anteriores
    // 3. devolva subtotal - desconto
}

const total = calcularTotalPedido(50, 3, 10);
console.log("Total do pedido:", total);`;

const arrayMissionFile = "DesafioFinal_Arrays.js";
const arrayMissionCode = `// MISSÃO FINAL M08 · ARRAYS
// Reconstrua as três funções usando for, if, return, length e push.

function possuiCodigo(codigos, codigoProcurado) {
    // percorra o array e devolva true quando encontrar
}

function calcularMedia(notas) {
    // array vazio deve devolver 0
    // percorra as notas, some e devolva soma / length
}

function registrarCodigo(codigos, novoCodigo) {
    // não permita códigos duplicados
    // adicione o novo código no final e devolva true
}

const codigos = [101, 205, 310, 411];
console.log("Encontrou 310:", possuiCodigo(codigos, 310));
console.log("Média:", calcularMedia([8, 7.5, 9, 6.5]));`;

const objectMissionFile = "DesafioFinal_Objetos.js";
const objectMissionCode = `// MISSÃO FINAL M09 · OBJETOS
// Use objetos, arrays, for, if, return e push para cuidar de um pedido.

function calcularTotalPedido(pedido) {
    // percorra pedido.itens e some preco * quantidade
    // um pedido sem itens deve devolver 0
}

function resumirPedido(pedido) {
    // devolva um novo objeto com:
    // codigo, cliente, quantidadeItens e total
}

function registrarItem(pedido, novoItem) {
    // não permita dois itens com o mesmo codigo
    // adicione o item e devolva true; se for duplicado, devolva false
}

const pedido = {
    codigo: "PED-104",
    cliente: { nome: "Carlos", cidade: "São Paulo" },
    itens: [
        { codigo: "TEC-01", descricao: "Teclado", preco: 249.50, quantidade: 1 },
        { codigo: "MOU-02", descricao: "Mouse", preco: 89.75, quantidade: 2 }
    ]
};

console.log("Total:", calcularTotalPedido(pedido));
console.log("Resumo:", resumirPedido(pedido));`;

const dataMissionFile = "DesafioFinal_Dados.js";
const dataMissionCode = `// MISSÃO FINAL M10 · STRINGS, MATH E DATE
// Transforme dados brutos em valores previsíveis para o Backend.

function normalizarEmail(email) {
    // retire espaços externos e converta para letras minúsculas
}

function calcularPrecoFinal(preco, percentualDesconto) {
    // aplique o desconto e arredonde o resultado para centavos
}

function criarRegistro(produto, dataIso) {
    // devolva: CODIGO | nome sem espaços | R$ 0.00 | data ISO em UTC
    // use trim(), toFixed(2), new Date() e toISOString()
}

const produto = { codigo: "P-104", nome: "  Teclado  ", preco: 249.90 };
console.log(criarRegistro(produto, "2026-08-20T15:30:00.000Z"));`;

const modernArrayMissionFile = "DesafioFinal_ArraysModernos.js";
const modernArrayMissionCode = `// MISSÃO FINAL M11 · ARRAYS MODERNOS
// Use filter, map, find, every e reduce. Nesta missão, não reconstrua com for.

function selecionarDisponiveis(produtos) {
    // ativo === true e estoque > 0
}

function criarEtiquetas(produtos) {
    // devolva: CODIGO - NOME EM MAIÚSCULAS
}

function buscarPorCodigo(produtos, codigo) {
    // use find e devolva null quando não encontrar
}

function todosPrecosValidos(produtos) {
    // use every: todos os preços devem ser maiores que zero
}

function calcularValorEstoque(produtos) {
    // use reduce com valor inicial 0: preco * estoque de cada produto
}

const produtos = [
    { codigo: "P01", nome: "Teclado", preco: 249.50, estoque: 2, ativo: true },
    { codigo: "P02", nome: "Mouse", preco: 89.75, estoque: 4, ativo: true },
    { codigo: "P03", nome: "Cabo", preco: 10, estoque: 0, ativo: true }
];

console.log(selecionarDisponiveis(produtos));`;

const modernJavaScriptMissionFile = "DesafioFinal_JavaScriptModerno.js";
const modernJavaScriptMissionCode = `// MISSÃO FINAL M12 · JAVASCRIPT MODERNO
// Use arrow, destructuring, spread, rest, defaults, optional chaining e ??.

const criarEtiqueta = (produto) => {
    // devolva: CODIGO - NOME EM MAIÚSCULAS
};

function atualizarProduto(produto, alteracoes) {
    // devolva um novo objeto sem alterar produto
}

function somarValores(...valores) {
    // some todos com reduce; nenhum valor deve devolver 0
}

function criarResumoUsuario({ nome = "Visitante", endereco } = {}) {
    // cidade deve usar endereco?.cidade e o fallback "Não informada"
    // devolva { nome, cidade }
}

const produto = { codigo: "P01", nome: "Teclado", estoque: 8 };
console.log(criarEtiqueta(produto));`;

const courseItemIds = new Set(courseLibrary.flatMap(module => module.items.map(item => item.id)));

function useCampusProgress() {
  const [progress, setProgress] = useState({ reviews: 0, examples: 0, challenges: 0, attempts: 0, m07Mastered: false, m08Mastered: false, m09Mastered: false, m10Mastered: false, m11Mastered: false, m12Mastered: false });

  useEffect(() => {
    const refresh = () => {
      const mastered = readMasteredModules();
      setProgress({
        reviews: readUniqueStrings("campus-course-library", courseItemIds).length,
        examples: readUniqueIntegers("campus-function-examples", 1, 20).length,
        challenges: readSequentialIntegers("campus-practice-challenges", 6).length,
        attempts: readArrayLength("campus-lab-attempts"),
        m07Mastered: mastered.includes("M07"),
        m08Mastered: mastered.includes("M08"),
        m09Mastered: mastered.includes("M09"),
        m10Mastered: mastered.includes("M10"),
        m11Mastered: mastered.includes("M11"),
        m12Mastered: mastered.includes("M12"),
      });
    };
    refresh();
    window.addEventListener("campus-progress-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("campus-progress-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return progress;
}

type CampusProgress = ReturnType<typeof useCampusProgress>;

function getCourseModuleView(module: CourseModule, progress: CampusProgress): CourseModule {
  if (module.id === "M07" && progress.m07Mastered) return { ...module, status: "concluido", progress: 100, note: "Domínio comprovado no Laboratório: os quatro casos de teste da missão final foram aprovados." };
  if (module.id === "M08" && progress.m08Mastered) return { ...module, status: "concluido", progress: 100, note: "Domínio comprovado no Laboratório: os seis casos da missão de Arrays foram aprovados." };
  if (module.id === "M08" && progress.m07Mastered) return { ...module, status: "andamento", progress: 72, note: "Arrays liberado: quatro aulas visuais, três exercícios e um desafio final disponível no Laboratório." };
  if (module.id === "M09" && progress.m09Mastered) return { ...module, status: "concluido", progress: 100, note: "Domínio comprovado no Laboratório: os seis casos da missão de Objetos foram aprovados." };
  if (module.id === "M09" && progress.m08Mastered) return { ...module, status: "andamento", progress: 72, note: "Objetos JavaScript liberado: quatro aulas visuais, três exercícios e uma missão final disponível no Laboratório." };
  if (module.id === "M10" && progress.m10Mastered) return { ...module, status: "concluido", progress: 100, note: "Domínio comprovado no Laboratório: os seis casos da missão de Strings, Math e Date foram aprovados." };
  if (module.id === "M10" && progress.m09Mastered) return { ...module, status: "andamento", progress: 72, note: "Strings, Math e Date liberado: quatro aulas visuais, três exercícios e uma missão final disponível no Laboratório." };
  if (module.id === "M11" && progress.m11Mastered) return { ...module, status: "concluido", progress: 100, note: "Domínio comprovado no Laboratório: os oito casos da missão de Arrays modernos foram aprovados." };
  if (module.id === "M11" && progress.m10Mastered) return { ...module, status: "andamento", progress: 72, note: "Arrays modernos liberado: cinco aulas visuais, quatro exercícios e uma missão final disponível no Laboratório." };
  if (module.id === "M12" && progress.m12Mastered) return { ...module, status: "concluido", progress: 100, note: "Domínio comprovado no Laboratório: os oito casos da missão de JavaScript moderno foram aprovados." };
  if (module.id === "M12" && progress.m11Mastered) return { ...module, status: "andamento", progress: 72, note: "JavaScript moderno liberado: cinco aulas visuais, quatro exercícios e uma missão final disponível no Laboratório." };
  if (module.id === "M13" && progress.m12Mastered) return { ...module, note: "Próximo ponto de retomada: Módulos e organização com import, export e ES Modules." };
  return module;
}

function StatusPill({ status }: { status: CourseModule["status"] }) {
  const map = {
    concluido: ["Concluído", "ok"],
    andamento: ["Em andamento", "warn"],
    planejado: ["Planejado", "muted"]
  } as const;
  return <span className={`status status-${map[status][1]}`}>{map[status][0]}</span>;
}

function ProgressRing({ value }: { value: number }) {
  const deg = Math.round(value * 3.6);
  return (
    <div className="progress-ring" style={{ background: `conic-gradient(var(--accent) ${deg}deg, var(--line) ${deg}deg)` }}>
      <div className="progress-ring-inner"><strong>{value}%</strong><span>curso</span></div>
    </div>
  );
}

function Dashboard({ setView }: { setView: (v: View) => void }) {
  const modules = [...completedModules, ...plannedModules];
  const total = modules.length;
  const totalItems = courseLibrary.reduce((sum, module) => sum + module.items.length, 0);
  const progress = useCampusProgress();
  const moduleViews = modules.map(module => getCourseModuleView(module, progress));
  const verifiedFinished = moduleViews.filter(module => module.status === "concluido").length;
  const courseProgress = Math.round(moduleViews.reduce((sum, module) => sum + module.progress, 0) / total);
  const activeLesson = progress.m12Mastered ? {
    module: "M13 · Módulos e organização",
    lesson: "Cada arquivo com uma responsabilidade",
    checkpoint: "Sintaxe moderna consolidada: a próxima etapa separará funções e contratos entre arquivos JavaScript.",
    next: "Retomar futuramente pelo M13: import, export e ES Modules",
    index: "13.01",
  } : progress.m11Mastered ? {
    module: "M12 · JavaScript moderno",
    lesson: "A mesma função, uma escrita mais curta",
    checkpoint: "Callbacks dominados com function: agora a sintaxe moderna poderá encurtar o código sem esconder seu significado.",
    next: "Iniciar M12 comparando função tradicional e arrow function",
    index: "12.01",
  } : progress.m10Mastered ? {
    module: "M11 · Arrays modernos",
    lesson: "Percorrer com intenção",
    checkpoint: "Dados primitivos preparados: agora cada método de array expressará uma intenção específica sobre coleções.",
    next: "Iniciar M11 comparando for clássico e forEach",
    index: "11.01",
  } : progress.m09Mastered ? {
    module: "M10 · Strings, Math e Date",
    lesson: "Texto também é dado de negócio",
    checkpoint: "Objetos dominados: agora vamos transformar, calcular e formatar seus valores com precisão.",
    next: "Iniciar o M10 pela anatomia e transformação de strings",
    index: "10.01",
  } : progress.m08Mastered ? {
    module: "M09 · Objetos JavaScript",
    lesson: "Uma entidade com várias características",
    checkpoint: "Objeto reúne propriedades nomeadas; cada propriedade associa uma chave a um valor.",
    next: "Abrir a Aula01 e explorar produto.codigo, produto.nome e produto.preco",
    index: "09.01",
  } : progress.m07Mastered ? {
    module: "M08 · Arrays",
    lesson: "Uma lista dentro de uma caixinha",
    checkpoint: "Índice é o endereço do elemento; o primeiro índice é 0 e o último é length - 1.",
    next: "Abrir a Aula01 de Arrays na biblioteca do curso",
    index: "08.01",
  } : { ...currentLesson, index: "07.07" };

  return (
    <div className="view-grid dashboard-view">
      <section className="hero-panel panel panel-dark">
        <div className="eyebrow">FORMAÇÃO PREPARATÓRIA · JAVASCRIPT BACKEND</div>
        <div className="hero-copy">
          <div>
            <h1>JavaScript como linguagem principal.<br/>Lógica sólida para chegar ao Backend.</h1>
            <p>Um curso paralelo de estudos para reforçar lógica, praticar JavaScript e avançar dos fundamentos até Node.js, APIs e banco de dados.</p>
          </div>
          <div className="hero-side">
            <div className="language-seal"><b>JS</b><span>JavaScript<br/>Backend Track</span></div>
            <ProgressRing value={courseProgress} />
          </div>
        </div>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => setView("aula")}><Play size={17}/> {progress.m12Mastered ? "Revisar M12" : "Continuar aula"}</button>
          <button className="btn btn-ghost-dark" onClick={() => setView("trilha")}><Compass size={17}/> Ver grade completa</button>
        </div>
      </section>

      <section className="metric-strip panel">
        <div className="metric"><span>Itens revisados</span><strong>{progress.reviews}/{totalItems}</strong><small>marcados por você na biblioteca</small></div>
        <div className="metric"><span>Exemplos de funções</span><strong>{progress.examples}/20</strong><small>mini-aulas concluídas</small></div>
        <div className="metric"><span>Desafios resolvidos</span><strong>{progress.challenges}/6</strong><small>respostas confirmadas na arena</small></div>
        <div className="metric"><span>Módulos concluídos</span><strong>{verifiedFinished}/{total}</strong><small>{progress.attempts} tentativa(s) registrada(s) no laboratório</small></div>
      </section>

      <section className="current-card panel">
        <div className="section-heading">
          <div><span className="eyebrow">AGORA</span><h2>{activeLesson.module}</h2></div>
          <span className="badge-live">{progress.m12Mastered ? <BookMarked size={13}/> : <CircleDot size={13}/>} {progress.m12Mastered ? "Próxima retomada" : "Aula ativa"}</span>
        </div>
        <div className="lesson-row">
          <div className="lesson-index">{activeLesson.index}</div>
          <div className="lesson-main"><strong>{activeLesson.lesson}</strong><p>{activeLesson.checkpoint}</p></div>
          <button className="icon-btn" aria-label={progress.m12Mastered ? "Ver M13 na grade curricular" : "Abrir aula atual"} title={progress.m12Mastered ? "Ver M13 na grade curricular" : "Abrir aula atual"} onClick={() => setView(progress.m12Mastered ? "trilha" : "aula")}><ChevronRight/></button>
        </div>
        <div className="checkpoint"><BrainCircuit size={18}/><span><b>Próximo checkpoint:</b> {activeLesson.next}</span></div>
      </section>

      <section className="milestones panel">
        <div className="section-heading"><div><span className="eyebrow">MARCOS</span><h2>O que já virou conhecimento</h2></div></div>
        <div className="milestone-list">
          <div className="milestone-item"><div className="milestone-icon"><CheckCircle2/></div><div><strong>Switch deixou de ser barreira</strong><p>Casos, ordem e decisão consolidados com exemplos práticos.</p></div></div>
          <div className="milestone-item"><div className="milestone-icon"><CheckCircle2/></div><div><strong>O “clique das caixinhas”</strong><p>Contador, quantidade e soma passaram a ter responsabilidades diferentes.</p></div></div>
          <div className="milestone-item"><div className="milestone-icon"><CheckCircle2/></div><div><strong>Blocos {`{}`} como ações</strong><p>Você passou a ler as chaves como “o que acontece aqui dentro”.</p></div></div>
        </div>
      </section>

      <section className="quick-actions panel">
        <div className="section-heading"><div><span className="eyebrow">ATALHOS</span><h2>Entre direto no trabalho</h2></div></div>
        <div className="quick-grid">
          <button onClick={() => setView("laboratorio")}><Code2/><span><b>Corrigir código</b><small>cole ou carregue um .js</small></span></button>
          <button onClick={() => setView("arena")}><Target/><span><b>Treinar lógica</b><small>desafios gamificados</small></span></button>
          <button onClick={() => setView("conquistas")}><Award/><span><b>Ver conquistas</b><small>marcos e badges</small></span></button>
          <button onClick={() => setView("perfil")}><Radar/><span><b>Analisar evolução</b><small>forças e lacunas</small></span></button>
        </div>
      </section>

      <section className="learning-map panel">
        <div className="section-heading"><div><span className="eyebrow">MAPA DA FORMAÇÃO</span><h2>Onde você está e o que vem depois</h2></div><button className="btn btn-soft" onClick={() => setView("trilha")}>Abrir grade completa <ChevronRight size={16}/></button></div>
        <div className="learning-map-track">
          <article className="map-stage done"><span>M01–M02</span><strong>Fundamentos + decisões</strong><p>Variáveis, operadores, if/else e switch.</p><CheckCircle2/></article>
          <article className="map-stage done"><span>M03–M05</span><strong>Repetição + lógica</strong><p>while, for, contador e acumulador.</p><CheckCircle2/></article>
          <article className={`map-stage ${progress.m07Mastered ? "done" : "current"}`}><span>M06–M07</span><strong>Estrutura + funções</strong><p>{progress.m07Mastered ? "Funções comprovadas em quatro casos de teste." : "Laços aninhados e funções JavaScript em consolidação."}</p>{progress.m07Mastered ? <CheckCircle2/> : <CircleDot/>}</article>
          <article className={`map-stage ${progress.m08Mastered ? "done" : progress.m07Mastered ? "current" : "future"}`}><span>M08</span><strong>Arrays</strong><p>{progress.m08Mastered ? "Índices, percurso, mutação e busca comprovados." : progress.m07Mastered ? "Estruturas de dados em estudo e prática." : "Arrays entram depois que funções estiverem sólidas."}</p>{progress.m08Mastered ? <CheckCircle2/> : progress.m07Mastered ? <CircleDot/> : <LockKeyhole/>}</article>
          <article className={`map-stage ${progress.m09Mastered ? "done" : progress.m08Mastered ? "current" : "future"}`}><span>M09</span><strong>Objetos</strong><p>{progress.m09Mastered ? "Propriedades, métodos e estruturas aninhadas comprovados." : progress.m08Mastered ? "Entidades e pedidos em estudo e prática." : "Objetos entram depois do domínio de Arrays."}</p>{progress.m09Mastered ? <CheckCircle2/> : progress.m08Mastered ? <CircleDot/> : <LockKeyhole/>}</article>
          <article className={`map-stage ${progress.m10Mastered ? "done" : progress.m09Mastered ? "current" : "future"}`}><span>M10</span><strong>Dados primitivos</strong><p>{progress.m10Mastered ? "Textos, números e datas transformados com regras previsíveis." : progress.m09Mastered ? "Strings, Math e Date em estudo e prática." : "Esta etapa entra depois do domínio de Objetos."}</p>{progress.m10Mastered ? <CheckCircle2/> : progress.m09Mastered ? <CircleDot/> : <LockKeyhole/>}</article>
          <article className={`map-stage ${progress.m11Mastered ? "done" : progress.m10Mastered ? "current" : "future"}`}><span>M11</span><strong>Arrays modernos</strong><p>{progress.m11Mastered ? "Seleção, transformação, busca e redução comprovadas." : progress.m10Mastered ? "Callbacks e métodos declarativos em estudo." : "Esta etapa entra depois do domínio de dados primitivos."}</p>{progress.m11Mastered ? <CheckCircle2/> : progress.m10Mastered ? <CircleDot/> : <LockKeyhole/>}</article>
          <article className={`map-stage ${progress.m12Mastered ? "done" : progress.m11Mastered ? "current" : "future"}`}><span>M12</span><strong>JavaScript moderno</strong><p>{progress.m12Mastered ? "Sintaxe moderna aplicada com clareza e segurança." : progress.m11Mastered ? "Arrow, destructuring, spread, rest e acesso seguro em estudo." : "Esta etapa entra depois do domínio de Arrays modernos."}</p>{progress.m12Mastered ? <CheckCircle2/> : progress.m11Mastered ? <CircleDot/> : <LockKeyhole/>}</article>
        </div>
      </section>

      <section className="study-plan panel">
        <div className="section-heading"><div><span className="eyebrow">PLANO DE ESTUDO</span><h2>Como avançar nesta fase</h2></div></div>
        <div className="study-plan-grid">
          <article><span>01</span><div><strong>Compreender</strong><p>Leia a aula atual e acompanhe a história do computador sem tentar decorar JavaScript.</p></div></article>
          <article><span>02</span><div><strong>Reconhecer padrões</strong><p>Estude os 20 exemplos guiados e identifique entrada, processamento, saída e escopo.</p></div></article>
          <article><span>03</span><div><strong>Praticar</strong><p>Somente depois leve os exercícios para o laboratório e passe a construir sem olhar.</p></div></article>
        </div>
      </section>
    </div>
  );
}

function Curriculum() {
  const all = [...completedModules, ...plannedModules];
  const [selected, setSelected] = useState<CourseModule>(completedModules[6]);
  const progress = useCampusProgress();
  useEffect(() => {
    if (!progress.m12Mastered) return;
    const nextModule = all.find(module => module.id === "M13");
    if (nextModule) setSelected(nextModule);
  }, [progress.m12Mastered]);
  const selectedView = getCourseModuleView(selected, progress);
  return (
    <div className="curriculum-layout">
      <section className="panel curriculum-list">
        <div className="section-heading"><div><span className="eyebrow">GRADE CURRICULAR</span><h2>Formação Backend JavaScript</h2></div><span className="credit-tag">22 módulos</span></div>
        <div className="module-scroll">
          {all.map(m => { const view = getCourseModuleView(m, progress); return (
            <button key={m.id} className={`module-row ${selected.id === m.id ? "selected" : ""}`} onClick={() => setSelected(m)}>
              <div className="module-code">{view.id}</div>
              <div className="module-copy"><strong>{view.title}</strong><span>{view.topics.slice(0, 3).join(" · ")}</span></div>
              <div className="module-meta"><StatusPill status={view.status}/><b>{view.progress}%</b></div>
            </button>
          ); })}
        </div>
      </section>
      <aside className="panel module-detail">
        <div className="detail-top"><span className="module-code large">{selectedView.id}</span><StatusPill status={selectedView.status}/></div>
        <h2>{selectedView.title}</h2>
        <p className="detail-note">{selectedView.note ?? "Conteúdo planejado para a próxima etapa da formação."}</p>
        <div className="detail-progress"><div><span>Progresso</span><b>{selectedView.progress}%</b></div><div className="bar"><i style={{ width: `${selectedView.progress}%` }}/></div></div>
        <div className="detail-stats"><div><span>Carga estimada</span><b>{selectedView.hours}</b></div><div><span>XP</span><b>{selectedView.xp}</b></div></div>
        <h3>Conteúdos</h3>
        <div className="topic-list">{selectedView.topics.map(t => <div key={t}><CheckCircle2 size={16}/><span>{t}</span></div>)}</div>
      </aside>
    </div>
  );
}


function evaluateJavaScript(code: string) {
  const checks = [
    { ok: /\b(function\s+\w+|const\s+\w+\s*=\s*\([^)]*\)\s*=>|const\s+\w+\s*=\s*\w+\s*=>)/.test(code), label: "Função JavaScript identificada" },
    { ok: /\b(let|const)\s+\w+/.test(code), label: "Variável com let ou const encontrada" },
    { ok: /\b(if|switch|for|while)\b/.test(code), label: "Estrutura lógica encontrada" },
    { ok: /console\.log\s*\(/.test(code), label: "Saída com console.log encontrada" },
    { ok: (code.match(/\{/g)?.length ?? 0) === (code.match(/\}/g)?.length ?? 0), label: "Chaves balanceadas" },
    { ok: !/System\.out|public\s+static|\bint\s+\w+|\bdouble\s+\w+/.test(code), label: "Sem sintaxe Java misturada" }
  ];
  const score = Math.round(checks.filter(c => c.ok).length / checks.length * 100);
  return { checks, score };
}

type ExecutionTest = { name: string; ok: boolean; expected: string; received: string };
type ExecutionResult = { logs: string[]; tests: ExecutionTest[]; error?: string; timedOut?: boolean };
type MissionId = "M07" | "M08" | "M09" | "M10" | "M11" | "M12";

const missionTests: Record<MissionId, string> = {
  M07: `
const __tests = [];
const __record = (name, expected, action) => {
  try {
    const received = action();
    __tests.push({ name, ok: Object.is(received, expected), expected: String(expected), received: String(received) });
  } catch (error) {
    __tests.push({ name, ok: false, expected: String(expected), received: error instanceof Error ? error.message : String(error) });
  }
};

if (typeof calcularSubtotal !== "function" || typeof calcularDesconto !== "function" || typeof calcularTotalPedido !== "function") {
  __tests.push({ name: "Três funções declaradas", ok: false, expected: "3 funções", received: "Função ausente" });
} else {
  __record("Subtotal de 50 x 3", 150, () => calcularSubtotal(50, 3));
  __record("Desconto de 10% sobre 150", 15, () => calcularDesconto(150, 10));
  __record("Total do pedido", 135, () => calcularTotalPedido(50, 3, 10));
  __record("Preço inválido devolve zero", 0, () => calcularTotalPedido(0, 3, 10));
}
`,
  M08: `
const __tests = [];
const __record = (name, expected, action) => {
  try {
    const received = action();
    __tests.push({ name, ok: Object.is(received, expected), expected: String(expected), received: String(received) });
  } catch (error) {
    __tests.push({ name, ok: false, expected: String(expected), received: error instanceof Error ? error.message : String(error) });
  }
};

if (typeof possuiCodigo !== "function" || typeof calcularMedia !== "function" || typeof registrarCodigo !== "function") {
  __tests.push({ name: "Três funções declaradas", ok: false, expected: "3 funções", received: "Função ausente" });
} else {
  __record("Encontra código no meio", true, () => possuiCodigo([101, 205, 310, 411], 310));
  __record("Código ausente devolve false", false, () => possuiCodigo([101, 205, 310, 411], 999));
  __record("Média das quatro notas", 7.75, () => calcularMedia([8, 7.5, 9, 6.5]));
  __record("Array vazio devolve zero", 0, () => calcularMedia([]));
  __record("Registra código novo", "true|101,205,310,411,512", () => {
    const lista = [101, 205, 310, 411];
    return String(registrarCodigo(lista, 512)) + "|" + lista.join(",");
  });
  __record("Impede código duplicado", "false|101,205,310,411", () => {
    const lista = [101, 205, 310, 411];
    return String(registrarCodigo(lista, 310)) + "|" + lista.join(",");
  });
}
`,
  M09: `
const __tests = [];
const __record = (name, expected, action) => {
  try {
    const received = action();
    __tests.push({ name, ok: Object.is(received, expected), expected: String(expected), received: String(received) });
  } catch (error) {
    __tests.push({ name, ok: false, expected: String(expected), received: error instanceof Error ? error.message : String(error) });
  }
};

const __pedidoBase = () => ({
  codigo: "PED-104",
  cliente: { nome: "Carlos", cidade: "São Paulo" },
  itens: [
    { codigo: "TEC-01", descricao: "Teclado", preco: 249.50, quantidade: 1 },
    { codigo: "MOU-02", descricao: "Mouse", preco: 89.75, quantidade: 2 }
  ]
});

if (typeof calcularTotalPedido !== "function" || typeof resumirPedido !== "function" || typeof registrarItem !== "function") {
  __tests.push({ name: "Três funções declaradas", ok: false, expected: "3 funções", received: "Função ausente" });
} else {
  __record("Calcula o total dos itens", 429, () => calcularTotalPedido(__pedidoBase()));
  __record("Pedido vazio devolve zero", 0, () => calcularTotalPedido({ codigo: "PED-VAZIO", cliente: { nome: "Ana" }, itens: [] }));
  __record("Resume propriedades aninhadas", "PED-104|Carlos|2|429", () => {
    const resumo = resumirPedido(__pedidoBase());
    return [resumo.codigo, resumo.cliente, resumo.quantidadeItens, resumo.total].join("|");
  });
  __record("Registra um item novo", "true|3|CAB-03", () => {
    const pedidoTeste = __pedidoBase();
    const resultado = registrarItem(pedidoTeste, { codigo: "CAB-03", descricao: "Cabo", preco: 25, quantidade: 1 });
    return String(resultado) + "|" + pedidoTeste.itens.length + "|" + pedidoTeste.itens[2]?.codigo;
  });
  __record("Impede código duplicado", "false|2", () => {
    const pedidoTeste = __pedidoBase();
    const resultado = registrarItem(pedidoTeste, { codigo: "MOU-02", descricao: "Outro mouse", preco: 100, quantidade: 1 });
    return String(resultado) + "|" + pedidoTeste.itens.length;
  });
  __record("Usa a quantidade de cada item", 748.5, () => calcularTotalPedido({
    codigo: "PED-QTD",
    cliente: { nome: "Bia" },
    itens: [
      { codigo: "A", preco: 100, quantidade: 3 },
      { codigo: "B", preco: 149.50, quantidade: 3 }
    ]
  }));
}
`,
  M10: `
const __tests = [];
const __record = (name, expected, action) => {
  try {
    const received = action();
    __tests.push({ name, ok: Object.is(received, expected), expected: String(expected), received: String(received) });
  } catch (error) {
    __tests.push({ name, ok: false, expected: String(expected), received: error instanceof Error ? error.message : String(error) });
  }
};

if (typeof normalizarEmail !== "function" || typeof calcularPrecoFinal !== "function" || typeof criarRegistro !== "function") {
  __tests.push({ name: "Três funções declaradas", ok: false, expected: "3 funções", received: "Função ausente" });
} else {
  __record("Normaliza e-mail recebido", "carlos@email.com", () => normalizarEmail("  CARLOS@EMAIL.COM  "));
  __record("Mantém e-mail já normalizado", "ana@teste.com", () => normalizarEmail("ana@teste.com"));
  __record("Arredonda desconto para centavos", 16.99, () => calcularPrecoFinal(19.99, 15));
  __record("Calcula preço final exato", 224.91, () => calcularPrecoFinal(249.90, 10));
  __record("Cria registro ISO previsível", "P-104 | Teclado | R$ 249.90 | 2026-08-20T15:30:00.000Z", () => criarRegistro(
    { codigo: "P-104", nome: "  Teclado  ", preco: 249.90 },
    "2026-08-20T15:30:00.000Z"
  ));
  __record("Converte fuso para UTC", "X-9 | Mouse | R$ 89.50 | 2027-01-05T08:15:30.000Z", () => criarRegistro(
    { codigo: "X-9", nome: " Mouse ", preco: 89.5 },
    "2027-01-05T05:15:30-03:00"
  ));
}
`,
  M11: `
const __tests = [];
const __record = (name, expected, action) => {
  try {
    const received = action();
    __tests.push({ name, ok: Object.is(received, expected), expected: String(expected), received: String(received) });
  } catch (error) {
    __tests.push({ name, ok: false, expected: String(expected), received: error instanceof Error ? error.message : String(error) });
  }
};
const __catalogo = () => [
  { codigo: "P01", nome: "Teclado", preco: 249.50, estoque: 2, ativo: true },
  { codigo: "P02", nome: "Mouse", preco: 89.75, estoque: 4, ativo: true },
  { codigo: "P03", nome: "Cabo", preco: 10, estoque: 0, ativo: true },
  { codigo: "P04", nome: "Suporte", preco: 100, estoque: 1, ativo: false }
];

if (typeof selecionarDisponiveis !== "function" || typeof criarEtiquetas !== "function" || typeof buscarPorCodigo !== "function" || typeof todosPrecosValidos !== "function" || typeof calcularValorEstoque !== "function") {
  __tests.push({ name: "Cinco funções declaradas", ok: false, expected: "5 funções", received: "Função ausente" });
} else {
  __record("Usa os cinco métodos modernos", true, () => {
    const fontes = [selecionarDisponiveis, criarEtiquetas, buscarPorCodigo, todosPrecosValidos, calcularValorEstoque].map(fn => fn.toString()).join(" ");
    return ["filter", "map", "find", "every", "reduce"].every(metodo => fontes.includes("." + metodo + "("));
  });
  __record("Seleciona somente disponíveis", "P01,P02", () => selecionarDisponiveis(__catalogo()).map(produto => produto.codigo).join(","));
  __record("Cria etiquetas sem perder posições", "P01 - TECLADO|P02 - MOUSE|P03 - CABO|P04 - SUPORTE", () => criarEtiquetas(__catalogo()).join("|"));
  __record("Encontra produto pelo código", "Mouse", () => buscarPorCodigo(__catalogo(), "P02")?.nome);
  __record("Busca ausente devolve null", null, () => buscarPorCodigo(__catalogo(), "X99"));
  __record("Aceita catálogo com preços válidos", true, () => todosPrecosValidos(__catalogo()));
  __record("Rejeita preço igual a zero", false, () => todosPrecosValidos([{ codigo: "X", preco: 0 }]));
  __record("Reduz o valor total do estoque", 958, () => calcularValorEstoque(__catalogo()));
}
`,
  M12: `
const __tests = [];
const __record = (name, expected, action) => {
  try {
    const received = action();
    __tests.push({ name, ok: Object.is(received, expected), expected: String(expected), received: String(received) });
  } catch (error) {
    __tests.push({ name, ok: false, expected: String(expected), received: error instanceof Error ? error.message : String(error) });
  }
};

if (typeof criarEtiqueta !== "function" || typeof atualizarProduto !== "function" || typeof somarValores !== "function" || typeof criarResumoUsuario !== "function") {
  __tests.push({ name: "Quatro funções declaradas", ok: false, expected: "4 funções", received: "Função ausente" });
} else {
  __record("Usa a sintaxe moderna estudada", true, () => {
    const etiqueta = criarEtiqueta.toString();
    const atualizar = atualizarProduto.toString();
    const somar = somarValores.toString();
    const resumo = criarResumoUsuario.toString();
    return etiqueta.includes("=>") && atualizar.includes("...") && somar.includes("...") && resumo.includes("?.") && resumo.includes("??") && /\\{\\s*nome\\s*=/.test(resumo);
  });
  __record("Cria etiqueta com arrow function", "P01 - TECLADO", () => criarEtiqueta({ codigo: "P01", nome: "Teclado" }));
  __record("Combina produto e alterações", "P01|5|true", () => {
    const atualizado = atualizarProduto({ codigo: "P01", estoque: 2, ativo: false }, { estoque: 5, ativo: true });
    return [atualizado.codigo, atualizado.estoque, atualizado.ativo].join("|");
  });
  __record("Preserva o objeto original", "2|false", () => {
    const original = { codigo: "P01", estoque: 2 };
    const atualizado = atualizarProduto(original, { estoque: 8 });
    return original.estoque + "|" + String(original === atualizado);
  });
  __record("Soma quantidade variável de valores", 10, () => somarValores(1, 2, 3, 4));
  __record("Rest vazio devolve zero", 0, () => somarValores());
  __record("Resume usuário completo", "Carlos|Campinas", () => {
    const resumo = criarResumoUsuario({ nome: "Carlos", endereco: { cidade: "Campinas" } });
    return resumo.nome + "|" + resumo.cidade;
  });
  __record("Protege dados ausentes com padrões", "Visitante|Não informada", () => {
    const resumo = criarResumoUsuario();
    return resumo.nome + "|" + resumo.cidade;
  });
}
`,
};

function runJavaScriptLocally(code: string, mission: MissionId | null): Promise<ExecutionResult> {
  return new Promise(resolve => {
    const tests = mission ? missionTests[mission] : "const __tests = [];";

    const workerSource = `
const __sendResult = self.postMessage.bind(self);
const __logs = [];
const __format = value => {
  if (typeof value === "string") return value;
  try { return JSON.stringify(value); } catch { return String(value); }
};
console.log = (...values) => __logs.push(values.map(__format).join(" "));
console.error = (...values) => __logs.push("ERRO: " + values.map(__format).join(" "));
self.fetch = () => Promise.reject(new Error("Rede desativada neste laboratório"));
self.XMLHttpRequest = undefined;
self.WebSocket = undefined;
self.EventSource = undefined;
self.importScripts = () => { throw new Error("Importação externa desativada"); };

try {
${code}
${tests}
  __sendResult({ kind: "campus-result", logs: __logs, tests: __tests });
} catch (error) {
  __sendResult({ kind: "campus-result", logs: __logs, tests: [], error: error instanceof Error ? error.message : String(error) });
}`;

    const url = URL.createObjectURL(new Blob([workerSource], { type: "text/javascript" }));
    const worker = new Worker(url);
    let finished = false;
    const finish = (result: ExecutionResult) => {
      if (finished) return;
      finished = true;
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(result);
    };
    const timeout = window.setTimeout(() => finish({ logs: [], tests: [], timedOut: true, error: "Execução interrompida após 1,5 segundo. Verifique se existe um loop infinito." }), 1500);

    worker.onmessage = event => {
      if (event.data?.kind !== "campus-result") return;
      window.clearTimeout(timeout);
      finish(event.data);
    };
    worker.onerror = event => {
      window.clearTimeout(timeout);
      finish({ logs: [], tests: [], error: event.message || "Não foi possível executar o código." });
    };
  });
}

function Lab() {
  const progress = useCampusProgress();
  const [code, setCode] = useState(starterCode);
  const [fileName, setFileName] = useState("ExercicioAtual.js");
  const [analysis, setAnalysis] = useState<ReturnType<typeof evaluateJavaScript> | null>(null);
  const [execution, setExecution] = useState<ExecutionResult | null>(null);
  const [running, setRunning] = useState(false);
  const handleFile = async (file?: File) => {
    if (!file) return;
    setCode(await file.text());
    setFileName(file.name);
    setAnalysis(null);
    setExecution(null);
  };
  const loadMission = (missionCode: string, missionFile: string) => {
    setCode(missionCode);
    setFileName(missionFile);
    setAnalysis(null);
    setExecution(null);
  };
  const currentMission = fileName === functionMissionFile
    ? { module: "M07" as MissionId, expectedTests: 4 }
    : fileName === arrayMissionFile
      ? { module: "M08" as MissionId, expectedTests: 6 }
      : fileName === objectMissionFile
        ? { module: "M09" as MissionId, expectedTests: 6 }
        : fileName === dataMissionFile
          ? { module: "M10" as MissionId, expectedTests: 6 }
          : fileName === modernArrayMissionFile
            ? { module: "M11" as MissionId, expectedTests: 8 }
            : fileName === modernJavaScriptMissionFile
              ? { module: "M12" as MissionId, expectedTests: 8 }
              : null;
  const executeCode = async () => {
    setRunning(true);
    setExecution(null);
    const result = await runJavaScriptLocally(code, currentMission?.module ?? null);
    setExecution(result);
    if (currentMission) {
      const passed = result.tests.length === currentMission.expectedTests && result.tests.every(test => test.ok);
      try {
        const savedAttempts = JSON.parse(localStorage.getItem("campus-lab-attempts") ?? "[]");
        const attempts = Array.isArray(savedAttempts) ? savedAttempts : [];
        attempts.push({ module: currentMission.module, fileName, passed, passedTests: result.tests.filter(test => test.ok).length, totalTests: result.tests.length, createdAt: new Date().toISOString() });
        localStorage.setItem("campus-lab-attempts", JSON.stringify(attempts.slice(-50)));

        if (passed) {
          const mastered = readMasteredModules();
          if (!mastered.includes(currentMission.module)) localStorage.setItem("campus-module-mastery", JSON.stringify([...mastered, currentMission.module]));
        }
        window.dispatchEvent(new Event("campus-progress-changed"));
      } catch {}
    }
    setRunning(false);
  };
  const missionPassed = Boolean(currentMission && execution?.tests.length === currentMission.expectedTests && execution.tests.every(test => test.ok));
  return (
    <div className="lab-layout">
      <section className="panel editor-panel">
        <div className="editor-toolbar"><div><span className="dot red"/><span className="dot amber"/><span className="dot green"/><b title={fileName}>{fileName}</b></div><label className="btn btn-soft"><Upload size={16}/> Carregar .js<input hidden type="file" accept=".js,.mjs,.txt" onChange={e => handleFile(e.target.files?.[0])}/></label></div>
        <div className="editor-wrap"><Editor height="100%" defaultLanguage="javascript" value={code} onChange={v => setCode(v ?? "")} theme="vs-dark" options={{ minimap: { enabled: false }, fontSize: 16, lineHeight: 25, roundedSelection: false, padding: { top: 18 }, wordWrap: "on" }}/></div>
      </section>
      <aside className="panel review-panel">
        <div className="section-heading"><div><span className="eyebrow">LABORATÓRIO JAVASCRIPT</span><h2>Revisão estrutural</h2></div><ShieldCheck/></div>
        <p className="review-intro">Analise a estrutura ou execute o código localmente em um Worker isolado do navegador. Cada missão final possui casos de teste próprios e limite automático de tempo.</p>
        <div className="mission-picker" aria-label="Missões finais disponíveis">
          <button className={`btn mission-loader ${fileName === functionMissionFile ? "active" : ""}`} onClick={() => loadMission(functionMissionCode, functionMissionFile)}><Target size={16}/><span><b>M07 · Funções</b><small>4 casos de teste</small></span></button>
          <button className={`btn mission-loader ${fileName === arrayMissionFile ? "active" : ""}`} disabled={!progress.m07Mastered} onClick={() => loadMission(arrayMissionCode, arrayMissionFile)}>{progress.m07Mastered ? <Target size={16}/> : <LockKeyhole size={16}/>}<span><b>M08 · Arrays</b><small>{progress.m07Mastered ? "6 casos de teste" : "conclua M07"}</small></span></button>
          <button className={`btn mission-loader ${fileName === objectMissionFile ? "active" : ""}`} disabled={!progress.m08Mastered} onClick={() => loadMission(objectMissionCode, objectMissionFile)}>{progress.m08Mastered ? <Target size={16}/> : <LockKeyhole size={16}/>}<span><b>M09 · Objetos</b><small>{progress.m08Mastered ? "6 casos de teste" : "conclua M08"}</small></span></button>
          <button className={`btn mission-loader ${fileName === dataMissionFile ? "active" : ""}`} disabled={!progress.m09Mastered} onClick={() => loadMission(dataMissionCode, dataMissionFile)}>{progress.m09Mastered ? <Target size={16}/> : <LockKeyhole size={16}/>}<span><b>M10 · Dados</b><small>{progress.m09Mastered ? "6 casos de teste" : "conclua M09"}</small></span></button>
          <button className={`btn mission-loader ${fileName === modernArrayMissionFile ? "active" : ""}`} disabled={!progress.m10Mastered} onClick={() => loadMission(modernArrayMissionCode, modernArrayMissionFile)}>{progress.m10Mastered ? <Target size={16}/> : <LockKeyhole size={16}/>}<span><b>M11 · Arrays modernos</b><small>{progress.m10Mastered ? "8 casos de teste" : "conclua M10"}</small></span></button>
          <button className={`btn mission-loader ${fileName === modernJavaScriptMissionFile ? "active" : ""}`} disabled={!progress.m11Mastered} onClick={() => loadMission(modernJavaScriptMissionCode, modernJavaScriptMissionFile)}>{progress.m11Mastered ? <Target size={16}/> : <LockKeyhole size={16}/>}<span><b>M12 · JavaScript moderno</b><small>{progress.m11Mastered ? "8 casos de teste" : "conclua M11"}</small></span></button>
        </div>
        <div className="lab-action-grid"><button className="btn btn-primary" onClick={() => setAnalysis(evaluateJavaScript(code))}><ShieldCheck size={16}/> Analisar estrutura</button><button className="btn btn-run" disabled={running} onClick={executeCode}><Play size={16}/> {running ? "Executando..." : "Executar código"}</button></div>
        {execution && <div className="execution-result">
          <div className="execution-heading"><span className="eyebrow">EXECUÇÃO LOCAL</span><strong>{execution.timedOut ? "Tempo excedido" : execution.error ? "Execução com erro" : execution.tests.length ? `${execution.tests.filter(test => test.ok).length}/${execution.tests.length} testes passaram` : "Código executado"}</strong></div>
          {execution.error && <div className="execution-error"><XCircle size={16}/><span>{execution.error}</span></div>}
          {execution.tests.length > 0 && <div className="execution-tests">{execution.tests.map(test => <div key={test.name} className={test.ok ? "pass" : "fail"}>{test.ok ? <CheckCircle2/> : <XCircle/>}<span><b>{test.name}</b><small>Esperado: {test.expected} · Recebido: {test.received}</small></span></div>)}</div>}
          <div className="console-output"><span>CONSOLE</span>{execution.logs.length ? execution.logs.map((line, index) => <code key={`${line}-${index}`}>{line}</code>) : <code>Nenhuma saída com console.log.</code>}</div>
        </div>}
        {missionPassed && currentMission && <div className="mastery-earned"><CheckCircle2 size={20}/><div><span>DOMÍNIO {currentMission.module} COMPROVADO</span><strong>{currentMission.module === "M07" ? "Funções concluídas. O módulo M08 · Arrays foi liberado na Sala de Aula." : currentMission.module === "M08" ? "Arrays concluídos. Você está pronto para iniciar M09 · Objetos JavaScript." : currentMission.module === "M09" ? "Objetos concluídos. A próxima etapa da formação é M10 · Strings, Math e Date." : currentMission.module === "M10" ? "Strings, Math e Date concluídos. A próxima etapa é M11 · Arrays modernos." : currentMission.module === "M11" ? "Arrays modernos concluídos. A próxima etapa é M12 · JavaScript moderno." : "JavaScript moderno concluído. O próximo ponto de retomada é M13 · Módulos e organização."}</strong></div></div>}
        <AnimatePresence mode="wait">
          {analysis ? <motion.div key="result" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="analysis-result">
            <div className="score-box"><span>Score estrutural</span><strong>{analysis.score}</strong><small>/ 100</small></div>
            <div className="analysis-checks">{analysis.checks.map(c => <div key={c.label} className={c.ok ? "pass" : "fail"}>{c.ok ? <CheckCircle2/> : <XCircle/>}<span>{c.label}</span></div>)}</div>
            <div className="review-note"><BrainCircuit/><p><b>Próxima camada:</b> runner Node.js isolado, casos de teste, captura de console, comparação de resultado e feedback pedagógico por missão.</p></div>
          </motion.div> : execution ? null : <div className="empty-review"><FileCode2/><strong>Seu feedback aparecerá aqui</strong><span>Carregue um ExercicioXX.js ou use o exemplo atual.</span></div>}
        </AnimatePresence>
      </aside>
    </div>
  );
}

function Achievements() {
  const progress = useCampusProgress();
  const badges: { title: string; description: string; icon: React.ComponentType<{ size?: number }>; earned: boolean }[] = [
    { title: "Base lógica", description: "Decisões, laços e responsabilidades das variáveis consolidados.", icon: BrainCircuit, earned: true },
    { title: "Caixinhas", description: "Contador, quantidade e soma separados mentalmente.", icon: LibraryBig, earned: true },
    { title: "Funções I", description: "Parâmetros, composição e retorno comprovados em 4/4 testes.", icon: Code2, earned: progress.m07Mastered },
    { title: "Coleções", description: "Índices, percurso, busca e mutação comprovados em 6/6 testes.", icon: BookMarked, earned: progress.m08Mastered },
    { title: "Modelo de domínio", description: "Objetos e estruturas aninhadas comprovados em 6/6 testes.", icon: Target, earned: progress.m09Mastered },
    { title: "Dado confiável", description: "Strings, números e datas tratados com previsibilidade.", icon: ShieldCheck, earned: progress.m10Mastered },
    { title: "Coleções modernas", description: "filter, map, find, every e reduce comprovados em 8/8 testes.", icon: Sparkles, earned: progress.m11Mastered },
    { title: "Sintaxe moderna", description: "Arrow, destructuring, spread, rest e acesso seguro comprovados.", icon: Award, earned: progress.m12Mastered },
    { title: "Arena completa", description: "Os seis desafios de leitura de funções foram resolvidos.", icon: Trophy, earned: progress.challenges === 6 },
    { title: "Revisor constante", description: "Doze itens do acervo foram revisitados nesta rodada.", icon: RotateCcw, earned: progress.reviews >= 12 },
  ];
  const earned = badges.filter(badge => badge.earned).length;
  return <div className="achievements-view"><section className="panel achievement-hero"><div><span className="eyebrow">CONQUISTAS · {earned}/{badges.length}</span><h1>Marcos que registram compreensão, não só presença.</h1></div><div className="trophy-mark"><Trophy/></div></section><section className="badge-grid">{badges.map(badge => { const Icon = badge.icon; return <article className={`panel badge-card ${badge.earned ? "" : "muted-card"}`} key={badge.title}><div className="badge-emoji"><Icon size={28}/></div><h3>{badge.title}</h3><p>{badge.description}</p><span>{badge.earned ? "Conquistado" : "Bloqueado"}</span></article>; })}</section></div>;
}

function Performance() {
  const progress = useCampusProgress();
  const skills = [
    ["Estruturas de decisão", 92], ["Laços de repetição", 88], ["Contador e acumulador", 94], ["Leitura de execução", 86], ["Laços aninhados", 72], ["Funções", progress.m07Mastered ? 100 : 64], ["Arrays", progress.m08Mastered ? 100 : progress.m07Mastered ? 72 : 0], ["Objetos", progress.m09Mastered ? 100 : progress.m08Mastered ? 72 : 0], ["Strings, Math e Date", progress.m10Mastered ? 100 : progress.m09Mastered ? 72 : 0], ["Arrays modernos", progress.m11Mastered ? 100 : progress.m10Mastered ? 72 : 0], ["JavaScript moderno", progress.m12Mastered ? 100 : progress.m11Mastered ? 72 : 0]
  ] as const;
  return <div className="performance-layout"><section className="panel performance-main"><div className="section-heading"><div><span className="eyebrow">DESEMPENHO</span><h2>Mapa de domínio</h2></div><Radar/></div><div className="skill-bars">{skills.map(([s,v])=><div className="skill" key={s}><div><span>{s}</span><b>{v}%</b></div><div className="bar"><i style={{width:`${v}%`}}/></div></div>)}</div></section><aside className="panel focus-panel"><span className="eyebrow">FOCO ATUAL</span><h2>Profundidade antes de velocidade.</h2><p>O padrão de aprendizagem que mais funcionou foi: visualizar a lógica, entender as “caixinhas”, acompanhar a execução e só então escrever JavaScript.</p><div className="focus-note"><BrainCircuit/><span>{progress.m12Mastered ? "JavaScript moderno comprovado em oito testes. Pausa registrada; próxima retomada no M13." : progress.m11Mastered ? "Arrays modernos comprovados em oito testes. Prioridade: concluir JavaScript moderno." : progress.m10Mastered ? "Dados primitivos comprovados. Prioridade: concluir a missão final de Arrays modernos." : progress.m09Mastered ? "Objetos comprovados. Prioridade: concluir a missão final de Strings, Math e Date." : progress.m08Mastered ? "Arrays comprovados. Prioridade: concluir a missão final de Objetos." : progress.m07Mastered ? "Funções comprovadas. Prioridade: concluir a missão final de Arrays." : "Prioridade: passar nos quatro testes da missão final de Funções."}</span></div></aside></div>;
}

export default function Home() {
  const [view, setView] = useState<View>("dashboard");
  const progress = useCampusProgress();
  const content = useMemo(() => {
    switch (view) {
      case "dashboard": return <Dashboard setView={setView}/>;
      case "trilha": return <Curriculum/>;
      case "aula": return <Classroom/>;
      case "laboratorio": return <Lab/>;
      case "arena": return <PracticeArena/>;
      case "conquistas": return <Achievements/>;
      case "perfil": return <Performance/>;
    }
  }, [view]);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">JS</div><div><strong>Campus Backend</strong><span>Curso aberto de JavaScript Backend</span></div></div>
        <nav aria-label="Navegação principal">{nav.map(item => { const Icon = item.icon; return <button key={item.id} aria-label={item.label} title={item.label} className={view===item.id?"active":""} onClick={()=>setView(item.id)}><Icon size={19} strokeWidth={1.9}/><span>{item.label}</span>{item.id==="aula"&&<i/>}</button>})}</nav>
        <div className="sidebar-card"><Flame/><div><span>Foco desta etapa</span><strong>{progress.m12Mastered ? "M13 · Módulos ES" : progress.m11Mastered ? "M12 · JavaScript moderno" : progress.m10Mastered ? "M11 · Arrays modernos" : progress.m09Mastered ? "M10 · Strings" : progress.m08Mastered ? "M09 · Objetos" : progress.m07Mastered ? "M08 · Arrays" : "M07 · Funções"}</strong></div></div>
        <div className="sidebar-footer"><div className="avatar">CP</div><div><strong>Carlos Pereira</strong><span>Fundamentos II</span></div></div>
      </aside>
      <section className="workspace">
        <header className="topbar"><div><span className="crumb">FORMAÇÃO / BACKEND JAVASCRIPT</span></div><div className="top-actions"><span className="semester">{progress.m12Mastered ? "M13 · Próxima retomada" : progress.m11Mastered ? "M12 · JavaScript moderno liberado" : progress.m10Mastered ? "M11 · Arrays modernos liberado" : progress.m09Mastered ? "M10 · Strings liberado" : progress.m08Mastered ? "M09 · Objetos liberado" : progress.m07Mastered ? "M08 · Arrays liberado" : "M07 · Funções"}</span><div className="xp-pill"><Sparkles size={15}/> Progresso local</div><div className="avatar small">CP</div></div></header>
        <div className="content-wrap"><AnimatePresence mode="wait"><motion.div key={view} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} transition={{duration:.18}} className="view-root">{content}</motion.div></AnimatePresence></div>
      </section>
    </main>
  );
}
