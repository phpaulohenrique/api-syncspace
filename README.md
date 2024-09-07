# SyncSpace API

## Visão Geral

Esta API permite a gestão de usuários, solicitações de amizade e relacionamentos de amizade. As principais funcionalidades incluem criação de usuários, envio e gestão de solicitações de amizade, e gerenciamento de amizades confirmadas.

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

[ ] Remover uma amizade existente.

[x] Garantir que uma amizade só pode existir entre dois usuários que tenham aceitado uma solicitação de amizade.

## Regras de Negócio

[x] Um usuário não pode enviar uma solicitação de amizade para si mesmo.

[x] Não pode haver mais de uma solicitação de amizade pendente entre dois usuários.

[x] Quando uma solicitação de amizade é aceita, ela deve ser removida da tabela `FriendRequests` e a amizade deve ser criada na tabela `Friendships`.

[x] Se uma solicitação de amizade for rejeitada, ela deve permanecer na tabela `FriendRequests` com o status `REJECTED`.

