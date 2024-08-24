# Requisitos da API de Amizades

## Visão Geral

Esta API permite a gestão de usuários, solicitações de amizade e relacionamentos de amizade. As principais funcionalidades incluem criação de usuários, envio e gestão de solicitações de amizade, e gerenciamento de amizades confirmadas.

## Modelos

### 1. Users

**Campos:**
- `id`: Identificador único do usuário (UUID ou número inteiro).
- `name`: Nome do usuário (string, obrigatório).
- `email`: Email do usuário (string, único, obrigatório).
- `createdAt`: Data de criação do usuário (timestamp).
- `updatedAt`: Data de atualização do usuário (timestamp).

**Endpoints:**
- `GET /users`: Lista todos os usuários.
- `GET /users/:id`: Obtém um usuário específico pelo ID.
- `POST /users`: Cria um novo usuário.
- `PUT /users/:id`: Atualiza um usuário existente.
- `DELETE /users/:id`: Remove um usuário.

### 2. FriendRequests

**Campos:**
- `id`: Identificador único da solicitação de amizade (UUID ou número inteiro).
- `senderId`: ID do usuário que enviou a solicitação (relacionamento com `Users`).
- `receiverId`: ID do usuário que recebeu a solicitação (relacionamento com `Users`).
- `status`: Status da solicitação (`PENDING`, `ACCEPTED`, `REJECTED`).
- `createdAt`: Data de criação da solicitação (timestamp).
- `updatedAt`: Data de atualização da solicitação (timestamp).

**Endpoints:**
- `GET /friend-requests`: Lista todas as solicitações de amizade.
- `GET /friend-requests/:id`: Obtém uma solicitação de amizade específica pelo ID.
- `POST /friend-requests`: Cria uma nova solicitação de amizade.
- `PUT /friend-requests/:id`: Atualiza uma solicitação de amizade existente (pode ser para aceitar ou rejeitar).
- `DELETE /friend-requests/:id`: Remove uma solicitação de amizade.

### 3. Friendships

**Campos:**
- `id`: Identificador único da amizade (UUID ou número inteiro).
- `userIdInitiated`: ID do usuário que iniciou a amizade (relacionamento com `Users`).
- `userIdReceived`: ID do usuário que recebeu a amizade (relacionamento com `Users`).
- `createdAt`: Data de criação da amizade (timestamp).

**Endpoints:**
- `GET /friendships`: Lista todas as amizades.
- `GET /friendships/:id`: Obtém uma amizade específica pelo ID.
- `POST /friendships`: Cria uma nova amizade (somente após aceitar uma solicitação de amizade).
- `DELETE /friendships/:id`: Remove uma amizade.

## Funcionalidades

### 1. Gerenciamento de Usuários

- Criar, atualizar, listar e remover usuários.
- Cada usuário deve ter um email único.

### 2. Solicitações de Amizade

[x] Enviar uma solicitação de amizade de um usuário para outro.
[x] Listar todas as solicitações de amizade pendentes de um usuário.
[x] Aceitar ou rejeitar solicitações de amizade.
[x] Impedir que um usuário envie uma solicitação para si mesmo ou envie múltiplas solicitações pendentes para o mesmo usuário.

### 3. Gerenciamento de Amizades

[x] Converter uma solicitação de amizade aceita em uma amizade.
[x] Listar todos os amigos de um usuário.
- Remover uma amizade existente.
[x] Garantir que uma amizade só pode existir entre dois usuários que tenham aceitado uma solicitação de amizade.

## Regras de Negócio

[x] **Um usuário não pode enviar uma solicitação de amizade para si mesmo.**
[x] **Não pode haver mais de uma solicitação de amizade pendente entre dois usuários.**
[x] **Quando uma solicitação de amizade é aceita, ela deve ser removida da tabela `FriendRequests` e a amizade deve ser criada na tabela `Friendships`.**
[x] **Se uma solicitação de amizade for rejeitada, ela deve permanecer na tabela `FriendRequests` com o status `REJECTED`.**

