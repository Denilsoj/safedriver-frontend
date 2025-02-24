# Sistema de Gerenciamento de Motoristas

Uma aplicação full-stack para registrar e gerenciar motoristas utilizando tecnologias web modernas.

## 🚀 Visão Geral

Este projeto implementa um sistema abrangente de gerenciamento de motoristas com funcionalidades para registro, listagem e edição de informações dos motoristas. Ele usa uma stack tecnológica moderna com Next.js para o frontend e Fastify com Prisma para o backend.

## 🛠️ Stack Tecnológica

### Frontend

- **Next.js** - Framework React com renderização do lado do servidor
- **React Query** - Busca de dados e gerenciamento de estado
- **Zod** - Validação de esquema
- **TailwindCSS** - Framework CSS utilitário
- **ShadCN/UI** - Biblioteca de componentes UI

### Backend

- **Fastify** - Framework web de alto desempenho
- **Prisma** - ORM para operações com banco de dados
- **PostgreSQL** - Banco de dados relacional

### Infraestrutura

- **Bun.js** - Ambiente de execução JavaScript e gerenciador de pacotes
- **Biome** - Formatação de código e linting
- **Docker** - Containerização
- **Turborepo** - Gerenciamento de monorepo

## 🏗️ Estrutura do Projeto

O projeto segue uma estrutura de monorepo usando o Turborepo:

```
├── apps/
│   ├── web/           # Aplicação frontend Next.js
│   └── api/           # API backend Fastify
├── packages/
│   ├── ui/            # Componentes UI compartilhados
│   ├── validation/    # Esquemas de validação compartilhados
│   └── config/        # Configuração compartilhada
├── docker-compose.yml
└── turbo.json
```

## 🚦 Começando

### Pré-requisitos

- Docker e Docker Compose
- Git

### Instalação e Configuração

1. Clone o repositório:

   ```bash
   git clone https://github.com/seuusuario/sistema-gerenciamento-motoristas.git
   cd sistema-gerenciamento-motoristas
   ```

2. Inicie a aplicação usando Docker:

   ```bash
   docker-compose up -d
   ```

3. Acesse a aplicação:
   - Frontend: <http://localhost:3000>
   - API: <http://localhost:8000>

### Configuração Manual de Desenvolvimento

Se preferir rodar a aplicação sem Docker:

1. Instale as dependências:

   ```bash
   bun install
   ```

2. Configure o banco de dados:

   ```bash
   cd apps/api
   bun prisma migrate dev
   ```

3. Inicie os servidores de desenvolvimento:

   ```bash
   bun run dev
   ```

## 🔑 Principais Funcionalidades

### Registro de Motoristas

- Formulário completo com validação de todos os campos obrigatórios
- Upload de arquivos para CNH e documentação do veículo
- Autocompletar endereço baseado no CEP

### Listagem de Motoristas

- Exibição paginada de motoristas registrados
- Filtros por nome, CPF e status
- Indicadores visuais para motoristas ativos/inativos

### Edição de Motoristas

- Atualização das informações do motorista
- Substituição ou visualização de documentos enviados
- Alternância do status do motorista

## 🧩 Endpoints da API

| Método | Endpoint            | Descrição                         |
|--------|---------------------|-----------------------------------|
| POST   | `/motoristas`        | Registrar um novo motorista       |
| GET    | `/motoristas`        | Listar motoristas com filtros e paginação |
| GET    | `/motoristas/:id`    | Obter informações detalhadas de um motorista |
| PATCH  | `/motoristas/:id`    | Atualizar informações de um motorista |
| DELETE | `/motoristas/:id`    | Remover um motorista              |

## 🎨 Decisões de Design

### Paleta de Cores

A aplicação usa a paleta de cores da Vertice GR adaptada para o ShadCN/UI utilizando variáveis CSS. As cores primárias focam em tons de branco amarelo e rocho.

### Validação de Formulários

Todas as validações de formulários são implementadas utilizando esquemas Zod que forçam:

- Formato e unicidade do CPF
- Requisito de idade mínima (18 anos)
- Formato do número de telefone
- Validação de e-mail
- Verificação de campos obrigatórios

### Otimizações de Desempenho

- React Query para busca de dados com cache e revalidação em segundo plano
- Otimização de imagens para uploads de documentos
- Renderização do lado do servidor para carregamento inicial das páginas
- Paginação para lidar com grandes conjuntos de dados

## 🔄 Integração Contínua

O projeto usa GitHub Actions para integração contínua, realizando:

- Verificações de lint e formatação com Biome
- Testes unitários e de integração
- Verificação de builds

## 🚧 Melhorias Futuras

- Implementar autenticação de usuário e controle de acesso baseado em funções
- Adicionar um painel de controle com estatísticas dos motoristas
- Melhorar o visualizador de documentos com capacidade de zoom
- Adicionar funcionalidade de exportação de dados dos motoristas
- Implementar notificações em tempo real para alterações de status
- Adicionar suporte a múltiplos idiomas

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - consulte o arquivo LICENSE para mais detalhes.

## 👨‍💻 Autor

Desenvolvido como um teste técnico para a Vertice GR.
