# MySpace — Dashboard Pessoal | Dark Premium

Um dashboard pessoal para organizar sua rotina, acompanhar tarefas, registrar ideias e funcionar como seu bloco de notas digital, com estética **Dark Premium** inspirada na organização horizontal da Netflix, no minimalismo do Notion e na precisão utilitária do Linear.

---

## 🎨 Conceito Visual & Design System

- **Dark Premium:** Paleta de tons grafite escuro e preto fosco (`#090a0d`, `#11131a`, `#141620`, `#1e2230`) com bordas discretas (`#1f2230`).
- **Inspiração Netflix:** Fileiras horizontais de cards com indicadores visuais de progresso, prazos e status para os projetos em andamento (*"Continuar de onde parei"*).
- **Inspiração Notion:** Bloco de notas minimalista sem distrações, com suporte a cabeçalhos (H1, H2, H3), listas com marcadores e numéricas, checklists (`- [ ]`), citações (`>`), blocos de código e salvamento automático instantâneo.
- **Inspiração Linear:** Tipografia refinada (Google Fonts *Inter*), atalhos de teclado ágeis (`Ctrl + K`, `T`, `N`, `Esc`, `?`), chips de prioridade (Alta, Média, Baixa), micro-interações fluidas e badge de status.

---

## 🚀 Funcionalidades Principais

### 1. Tela Inicial (Home)
- **Topbar:** Saudação dinâmica contextualizada por horário ("Bom dia", "Boa tarde", "Boa noite"), data atual por extenso, busca global, botão "+ Novo" e indicador de progresso diário.
- **Continuar de onde parei:** Fileira horizontal rolável de projetos em andamento com barra de progresso, contador de tarefas e cálculo de dias restantes.
- **Hoje:** Foco diário com tarefas de prioridade, horários, checkbox com feedback visual e input rápido para adicionar tarefas direto no fluxo.
- **Minha semana:** Visualização compacta dos próximos 7 dias com indicadores de tarefas e prazos de projetos.
- **Acesso rápido:** 6 cards diretos para Bloco de Notas, Calendário, Lista de Tarefas, Projetos, Minha Rotina e Arquivo.
- **Anotações Rápidas & Caixa de Entrada:** Scratchpad acessível na Home para capturar pensamentos e links soltos sem trocar de contexto.

### 2. Gestão de Tarefas
- Filtros por: **Todas**, **Hoje**, **Esta Semana**, **Atrasadas** e **Concluídas**.
- Filtros por **Categoria** (Trabalho, Pessoal, Estudos, Finanças, Saúde, Ideias) e **Prioridade** (Alta, Média, Baixa).
- Alternância entre **Lista Tradicional** e **Quadro Kanban** (Pendente, Em Andamento, Concluída).
- Ordenação por data, prioridade ou status.
- Modal completo para edição de detalhes, prazos, horários, categorias e projetos vinculados.

### 3. Bloco de Notas Minimalista
- Painel dividido com busca em tempo real por título e conteúdo.
- Abas rápidas: Todas as Notas, Fixadas, Rápidas e Caixa de Entrada.
- Barra de formatação Markdown: H1, H2, H3, Negrito, Itálico, Listas, Checklists, Citações e Código.
- Alternância instantânea entre **Modo de Edição** e **Visualização Formatada**.
- Salvamento automático contínuo com badge de confirmação ("Salvo").
- Fixação no topo (Pin), arquivamento e lixeira.

### 4. Projetos & Objetivos
- Apresentação em vitrine visual com badges coloridos por área.
- **Página de Detalhe do Projeto:** Ao clicar em qualquer projeto, abre uma página consolidada com:
  - Métricas e barra de progresso em tempo real;
  - Tarefas vinculadas (com adição rápida inline e toggle de conclusão);
  - Anotações vinculadas;
  - Prazos e cronograma;
  - Edição de dados do projeto.

### 5. Calendário & Agenda
- Navegação mensal com indicador de tarefas e prazos de projetos por dia.
- Painel lateral do dia selecionado com lista detalhada de entregas.
- Agendamento direto de novas tarefas para o dia clicado.

### 6. Minha Rotina & Hábitos
- Rastreamento diário de rituais divididos por período: **Manhã**, **Tarde** e **Noite**.
- Contadores de sequência (*streaks*) e pontuação de consistência.

### 7. Arquivo & Lixeira
- Aba de tarefas e notas arquivadas (com opção de desarquivar).
- Lixeira com recuperação de notas ou exclusão permanente.

### 8. Persistência de Dados & Backup
- Todos os dados são persistidos no `localStorage` do navegador.
- Inclui dados de demonstração realistas prontos para uso.
- Modal de Configurações com opções para:
  - Alterar seu nome de exibição;
  - **Exportar Backup Completo em JSON**;
  - **Importar Backup JSON**;
  - Restaurar dados de exemplo;
  - Limpar todos os dados.

---

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
| :--- | :--- |
| `Ctrl + K` / `Cmd + K` | Abrir busca global instantânea |
| `T` | Criar nova tarefa rápida |
| `N` | Criar nova anotação |
| `?` | Exibir guia de atalhos |
| `Esc` | Fechar modais e janelas abertas |

---

## 🛠️ Tecnologias Utilizadas

- **React 19**
- **TypeScript**
- **Vite 8**
- **Tailwind CSS 3**
- **Lucide Icons**
- **Canvas Confetti**
- **Google Fonts (Inter)**

---

## 💻 Como Rodar Localmente

1. Abra o terminal na pasta do projeto:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse no navegador:
   `http://localhost:5173/`
