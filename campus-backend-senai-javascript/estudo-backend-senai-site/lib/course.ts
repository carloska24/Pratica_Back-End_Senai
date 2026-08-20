export type CourseModule = {
  id: string;
  title: string;
  status: "concluido" | "andamento" | "planejado";
  progress: number;
  hours: string;
  xp: number;
  topics: string[];
  note?: string;
};

export const completedModules: CourseModule[] = [
  {
    id: "M01",
    title: "Fundamentos JavaScript",
    status: "concluido",
    progress: 100,
    hours: "7h",
    xp: 700,
    topics: ["console.log", "let e const", "tipos de dados", "operadores", "atribuição"],
    note: "Conteúdo já estudado em lógica e agora migrado para a sintaxe correta de JavaScript."
  },
  {
    id: "M02",
    title: "Estruturas de decisão",
    status: "concluido",
    progress: 100,
    hours: "8h",
    xp: 900,
    topics: ["if", "if / else", "else if", "switch", "comparações", "operador módulo (%)"],
    note: "Switch consolidado com planos, calculadora e menu bancário, agora reescritos em JavaScript."
  },
  {
    id: "M03",
    title: "Laços de repetição — while",
    status: "concluido",
    progress: 100,
    hours: "8h",
    xp: 1050,
    topics: ["while", "contador", "while + if", "acumulador", "pares e ímpares", "condição de parada"],
    note: "Marco de aprendizagem: contador, acumulador e ações dentro das chaves deixaram de ser apenas sintaxe e passaram a ter uma função mental clara."
  },
  {
    id: "M04",
    title: "Laços de repetição — for",
    status: "concluido",
    progress: 100,
    hours: "6h",
    xp: 850,
    topics: ["for", "inicialização", "condição", "incremento", "decremento", "for + if"],
    note: "A estrutura do for foi consolidada como início → condição → ação → atualização."
  },
  {
    id: "M05",
    title: "Repetição avançada",
    status: "concluido",
    progress: 100,
    hours: "8h",
    xp: 1250,
    topics: ["contador de ocorrências", "acumulador", "múltiplos", "soma condicional", "responsabilidade das variáveis"],
    note: "Marco de aprendizagem: diferença definitiva entre a caixinha que percorre, a que conta e a que soma."
  },
  {
    id: "M06",
    title: "Laços aninhados",
    status: "andamento",
    progress: 72,
    hours: "5h",
    xp: 720,
    topics: ["for dentro de for", "linha e coluna", "ordem de execução", "console.log", "limite dinâmico"],
    note: "Fundamentos compreendidos. Exercícios com três níveis de repetição permanecem como revisão futura para não atropelar a progressão."
  },
  {
    id: "M07",
    title: "Funções",
    status: "andamento",
    progress: 64,
    hours: "10h",
    xp: 980,
    topics: ["function", "parâmetros", "argumentos", "return", "função chamando função", "escopo", "contrato de entrada"],
    note: "Módulo atual. A lógica estudada em métodos foi migrada para funções JavaScript, sem public/static/void/main."
  }
];

export const plannedModules: CourseModule[] = [
  { id: "M08", title: "Arrays", status: "planejado", progress: 0, hours: "8h", xp: 950, topics: ["índices", "length", "push/pop", "percurso", "busca", "soma e média"] },
  { id: "M09", title: "Objetos JavaScript", status: "planejado", progress: 0, hours: "8h", xp: 1050, topics: ["chave/valor", "propriedades", "métodos", "acesso", "objetos aninhados"] },
  { id: "M10", title: "Strings, Math e Date", status: "planejado", progress: 0, hours: "7h", xp: 850, topics: ["strings", "template literals", "Math", "Date", "formatação"] },
  { id: "M11", title: "Arrays modernos", status: "planejado", progress: 0, hours: "10h", xp: 1200, topics: ["forEach", "map", "filter", "find", "some/every", "reduce"] },
  { id: "M12", title: "JavaScript moderno", status: "planejado", progress: 0, hours: "10h", xp: 1250, topics: ["arrow functions", "destructuring", "spread", "rest", "default params", "optional chaining"] },
  { id: "M13", title: "Módulos e organização", status: "planejado", progress: 0, hours: "8h", xp: 1000, topics: ["import", "export", "ES Modules", "separação de arquivos", "responsabilidades"] },
  { id: "M14", title: "Assincronismo", status: "planejado", progress: 0, hours: "12h", xp: 1500, topics: ["callbacks", "Promises", "async/await", "tratamento de erro", "event loop"] },
  { id: "M15", title: "Node.js fundamentos", status: "planejado", progress: 0, hours: "12h", xp: 1500, topics: ["runtime Node", "npm", "package.json", "process", "fs", "variáveis de ambiente"] },
  { id: "M16", title: "HTTP e APIs REST", status: "planejado", progress: 0, hours: "10h", xp: 1400, topics: ["HTTP", "request/response", "métodos HTTP", "status codes", "JSON", "REST"] },
  { id: "M17", title: "Express.js", status: "planejado", progress: 0, hours: "14h", xp: 1800, topics: ["servidor", "rotas", "req/res", "middleware", "Router", "erros"] },
  { id: "M18", title: "Arquitetura de API", status: "planejado", progress: 0, hours: "14h", xp: 1850, topics: ["controllers", "services", "repositories", "DTOs", "validação", "configuração"] },
  { id: "M19", title: "Banco de dados SQL", status: "planejado", progress: 0, hours: "14h", xp: 1800, topics: ["PostgreSQL", "CRUD", "SELECT", "JOIN", "constraints", "transações"] },
  { id: "M20", title: "Persistência no Node", status: "planejado", progress: 0, hours: "12h", xp: 1700, topics: ["driver PostgreSQL", "queries parametrizadas", "migrations", "ORM como etapa posterior"] },
  { id: "M21", title: "Testes, segurança e autenticação", status: "planejado", progress: 0, hours: "16h", xp: 2200, topics: ["testes", "JWT", "hash de senha", "autorização", "validação", "boas práticas"] },
  { id: "M22", title: "Docker + Projeto Backend final", status: "planejado", progress: 0, hours: "30h", xp: 5000, topics: ["Docker", "API", "banco", "testes", "segurança", "deploy", "documentação"] }
];

export const currentLesson = {
  module: "M07 · Funções",
  lesson: "Função + if + return + boolean",
  next: "Resolver os 6 desafios e reconstruir Desafio01_Pedido.js sem consultar a solução",
  checkpoint: "Parâmetro = caixinha de entrada; argumento = valor enviado; return entrega um resultado para quem chamou a função."
};
