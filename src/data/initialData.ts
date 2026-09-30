import { Task, Note, Project, RoutineHabit } from '../types';

// Helper to get formatted date string (YYYY-MM-DD)
export const getRelativeDate = (offsetDays: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Oportunidade Profissional Sênior',
    description: 'Evolução de carreira, atualização de portfólio, networking e preparação para processos seletivos.',
    category: 'Carreira',
    deadline: getRelativeDate(45),
    status: 'em_andamento',
    progress: 75,
    icon: 'Briefcase',
    color: '#6366f1',
    createdAt: getRelativeDate(-20),
    updatedAt: getRelativeDate(-1),
  },
  {
    id: 'proj-2',
    name: 'Desenvolver Plataforma Tech',
    description: 'Construção de uma aplicação SaaS moderna com arquitetura limpa e UI dark premium.',
    category: 'Projetos Pessoais',
    deadline: getRelativeDate(30),
    status: 'em_andamento',
    progress: 55,
    icon: 'Code2',
    color: '#8b5cf6',
    createdAt: getRelativeDate(-15),
    updatedAt: getRelativeDate(0),
  },
  {
    id: 'proj-3',
    name: 'Estudo Aprofundado de Rust & Go',
    description: 'Domínio de concorrência, sistemas distribuídos e algoritmos de alto desempenho.',
    category: 'Estudos',
    deadline: getRelativeDate(60),
    status: 'em_andamento',
    progress: 40,
    icon: 'BookOpen',
    color: '#3b82f6',
    createdAt: getRelativeDate(-30),
    updatedAt: getRelativeDate(-2),
  },
  {
    id: 'proj-4',
    name: 'Organização Financeira & Portfólio',
    description: 'Rebalanceamento de ativos, planejamento orçamentário anual e reserva estratégica.',
    category: 'Finanças',
    deadline: getRelativeDate(18),
    status: 'em_andamento',
    progress: 85,
    icon: 'Wallet',
    color: '#10b981',
    createdAt: getRelativeDate(-12),
    updatedAt: getRelativeDate(0),
  },
  {
    id: 'proj-5',
    name: 'Rotina de Saúde & Alta Performance',
    description: 'Constância em treinos de musculação, controle do sono e alimentação balanceada.',
    category: 'Saúde',
    deadline: getRelativeDate(90),
    status: 'em_andamento',
    progress: 70,
    icon: 'Activity',
    color: '#f43f5e',
    createdAt: getRelativeDate(-40),
    updatedAt: getRelativeDate(0),
  },
  {
    id: 'proj-6',
    name: 'Laboratório de Ideias & Conteúdo',
    description: 'Produção de ensaios técnicos, anotações de pesquisa e experimentos de produtos.',
    category: 'Ideias',
    deadline: getRelativeDate(120),
    status: 'em_pausa',
    progress: 30,
    icon: 'Lightbulb',
    color: '#f59e0b',
    createdAt: getRelativeDate(-25),
    updatedAt: getRelativeDate(-5),
  },
];

export const INITIAL_TASKS: Task[] = [
  // Today's tasks
  {
    id: 'task-1',
    title: 'Revisar arquitetura do sistema e pipelines de dados',
    description: 'Validar padrões de injeção de dependência e otimizar queries.',
    date: getRelativeDate(0),
    time: '10:00',
    priority: 'alta',
    category: 'Trabalho',
    status: 'concluida',
    projectId: 'proj-2',
    createdAt: getRelativeDate(-1),
    completedAt: getRelativeDate(0),
  },
  {
    id: 'task-2',
    title: 'Planejar sprint semanal e alinhar entregas prioritárias',
    description: 'Mapear impedimentos e listar os 3 objetivos principais da semana.',
    date: getRelativeDate(0),
    time: '11:30',
    priority: 'alta',
    category: 'Trabalho',
    status: 'em_andamento',
    projectId: 'proj-1',
    createdAt: getRelativeDate(-1),
  },
  {
    id: 'task-3',
    title: 'Treino de Força (Membros Superiores) + 20min Cardio',
    description: 'Manter a carga progressiva e hidratação regular.',
    date: getRelativeDate(0),
    time: '18:00',
    priority: 'media',
    category: 'Saúde',
    status: 'pendente',
    projectId: 'proj-5',
    createdAt: getRelativeDate(0),
  },
  {
    id: 'task-4',
    title: 'Leitura de 25 páginas sobre concorrência em Go',
    description: 'Fazer anotações no bloco de notas sobre canais e mutexes.',
    date: getRelativeDate(0),
    time: '21:30',
    priority: 'baixa',
    category: 'Estudos',
    status: 'pendente',
    projectId: 'proj-3',
    createdAt: getRelativeDate(0),
  },

  // Overdue task
  {
    id: 'task-5',
    title: 'Atualizar planilha de aportes e rendimentos mensais',
    description: 'Conferir extratos e lançar proventos recebidos.',
    date: getRelativeDate(-1),
    time: '17:00',
    priority: 'alta',
    category: 'Finanças',
    status: 'pendente',
    projectId: 'proj-4',
    createdAt: getRelativeDate(-3),
  },

  // Upcoming week tasks
  {
    id: 'task-6',
    title: 'Refatorar currículo e atualizar recomendações no LinkedIn',
    description: 'Destacar conquistas mensuráveis e impacto técnico.',
    date: getRelativeDate(1),
    time: '14:00',
    priority: 'alta',
    category: 'Carreira',
    status: 'pendente',
    projectId: 'proj-1',
    createdAt: getRelativeDate(-1),
  },
  {
    id: 'task-7',
    title: 'Construir protótipo da API com testes integrados',
    description: 'Cobrir cenários de falha e autenticação JWT.',
    date: getRelativeDate(2),
    time: '15:30',
    priority: 'media',
    category: 'Projetos Pessoais',
    status: 'pendente',
    projectId: 'proj-2',
    createdAt: getRelativeDate(-1),
  },
  {
    id: 'task-8',
    title: 'Consulta médica de rotina e exames preventivos',
    description: 'Levar os resultados dos últimos exames de sangue.',
    date: getRelativeDate(3),
    time: '09:00',
    priority: 'alta',
    category: 'Saúde',
    status: 'pendente',
    projectId: 'proj-5',
    createdAt: getRelativeDate(-2),
  },
  {
    id: 'task-9',
    title: 'Revisão orçamentária para o próximo trimestre',
    description: 'Definir metas de poupança e cortar assinaturas em desuso.',
    date: getRelativeDate(4),
    time: '19:00',
    priority: 'media',
    category: 'Finanças',
    status: 'pendente',
    projectId: 'proj-4',
    createdAt: getRelativeDate(-2),
  },
  {
    id: 'task-10',
    title: 'Escrever artigo sobre Clean Architecture e DDD',
    description: 'Rascunhar os tópicos essenciais e exemplos práticos.',
    date: getRelativeDate(5),
    priority: 'baixa',
    category: 'Ideias',
    status: 'pendente',
    projectId: 'proj-6',
    createdAt: getRelativeDate(-4),
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Princípios de Design de Software & Arquitetura',
    content: `# Princípios de Arquitetura Limpa

A simplicidade e a separação de responsabilidades são as maiores garantias de longevidade de um sistema.

### Diretrizes Centrais
- **Independência de frameworks:** O core do domínio não deve saber qual banco de dados ou UI está rodando.
- **Testabilidade:** Regras de negócio devem poder ser testadas sem UI, banco de dados ou servidores externos.
- **Imutabilidade e clareza:** Menos efeitos colaterais e código previsível.

> *"Qualquer tolo pode escrever código que um computador entenda. Bons programadores escrevem código que humanos podem entender."* — Martin Fowler

### Próximos Passos
- [x] Mapear entidades do domínio
- [ ] Definir contratos de repositório
- [ ] Implementar middleware de tratamento de erros`,
    category: 'Estudos',
    folder: 'Engenharia',
    pinned: true,
    archived: false,
    deleted: false,
    projectId: 'proj-3',
    createdAt: getRelativeDate(-10),
    updatedAt: getRelativeDate(-1),
  },
  {
    id: 'note-2',
    title: 'Plano Estratégico de Carreira 2026 / 2027',
    content: `# Roadmap de Carreira & Liderança Técnica

Consolidação técnica e expansão de liderança.

### Pilares de Foco
1. **Profundidade em Engenharia de Software:** Domínio completo de sistemas distribuídos e concorrência.
2. **Comunicação e Mentoria:** Escrever artigos técnicos e orientar engenheiros em formação.
3. **Visão de Produto:** Ligar decisões de engenharia diretamente ao impacto financeiro do negócio.

### Metas do Trimestre
- [x] Atualizar perfil profissional e portfólio
- [ ] Escrever 3 artigos técnicos de alto impacto
- [ ] Fazer networking com 5 referências da área`,
    category: 'Carreira',
    folder: 'Carreira',
    pinned: true,
    archived: false,
    deleted: false,
    projectId: 'proj-1',
    createdAt: getRelativeDate(-15),
    updatedAt: getRelativeDate(-2),
  },
  {
    id: 'note-3',
    title: 'Anotações do Livro: Hábitos Atômicos',
    content: `# Resumo & Insights Práticos

Pequenas mudanças diárias de 1% geram resultados exponenciais ao longo de meses.

### As 4 Leis da Mudança de Comportamento:
1. **Tornar claro:** Defina onde e quando irá executar a ação (intenção de implementação).
2. **Tornar atraente:** Associe um hábito necessário com um que você já gosta.
3. **Tornar fácil:** Reduza o atrito inicial (regra dos 2 minutos).
4. **Tornar satisfatório:** Recompensa imediata e rastreamento visível de consistência.`,
    category: 'Pessoal',
    folder: 'Leituras',
    pinned: false,
    archived: false,
    deleted: false,
    createdAt: getRelativeDate(-25),
    updatedAt: getRelativeDate(-10),
  },
  {
    id: 'note-quick-1',
    title: 'Anotação Rápida: Estudar Rust Borrow Checker',
    content: 'Revisar ownership e tempos de vida (lifetimes) em Rust no final de semana.',
    category: 'Estudos',
    pinned: false,
    archived: false,
    deleted: false,
    isQuickNote: true,
    createdAt: getRelativeDate(0),
    updatedAt: getRelativeDate(0),
  },
  {
    id: 'note-inbox-1',
    title: 'Ideia: CLI de automação de commits semânticos',
    content: 'Criar uma ferramenta rápida em terminal que sugere convenções baseadas no git diff.',
    category: 'Ideias',
    pinned: false,
    archived: false,
    deleted: false,
    isInbox: true,
    createdAt: getRelativeDate(-1),
    updatedAt: getRelativeDate(-1),
  }
];

export const INITIAL_HABITS: RoutineHabit[] = [
  {
    id: 'habit-1',
    title: 'Hidratação (2.5L de água)',
    timeOfDay: 'manha',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    completedDates: [getRelativeDate(-2), getRelativeDate(-1), getRelativeDate(0)],
    streak: 14,
  },
  {
    id: 'habit-2',
    title: 'Treino de Força ou Cardio',
    timeOfDay: 'tarde',
    daysOfWeek: [1, 2, 3, 4, 5],
    completedDates: [getRelativeDate(-2), getRelativeDate(-1)],
    streak: 8,
  },
  {
    id: 'habit-3',
    title: 'Leitura Focada (20 minutos)',
    timeOfDay: 'noite',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    completedDates: [getRelativeDate(-2), getRelativeDate(-1)],
    streak: 21,
  },
  {
    id: 'habit-4',
    title: 'Planejamento do Dia Seguinte',
    timeOfDay: 'noite',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    completedDates: [getRelativeDate(-3), getRelativeDate(-2), getRelativeDate(-1)],
    streak: 5,
  }
];
