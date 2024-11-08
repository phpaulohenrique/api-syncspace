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

[x] Remover uma amizade existente.

[x] Garantir que uma amizade só pode existir entre dois usuários que tenham aceitado uma solicitação de amizade.

### 4. Conversas por Mensagem entre Amigos

- **Enviar Mensagem**: Um usuário pode enviar uma mensagem para outro usuário que esteja na sua lista de amigos.
- **Listar Conversas**: Listar todas as mensagens trocadas entre dois amigos, ordenadas por data.
- **Status de Mensagem**: Implementar o status de leitura para cada mensagem (`LIDA` ou `NÃO_LIDA`).
- **Apagar Mensagem**: Permitir que um usuário apague uma mensagem enviada, removendo-a apenas de sua visão.
- **Bloquear Mensagens**: Um usuário pode bloquear outro para impedir o recebimento de mensagens; mensagens bloqueadas não devem aparecer para o destinatário.

### Mensagens entre Amigos


## Regras de Negócio

[x] Um usuário não pode enviar uma solicitação de amizade para si mesmo.

[x] Não pode haver mais de uma solicitação de amizade pendente entre dois usuários.

[x] Quando uma solicitação de amizade é aceita, ela deve ser removida da tabela `FriendRequests` e a amizade deve ser criada na tabela `Friendships`.

[x] Se uma solicitação de amizade for rejeitada, ela deve permanecer na tabela `FriendRequests` com o status `REJECTED`.

[x] Apenas amigos podem trocar mensagens**: Somente usuários que já são amigos podem iniciar uma conversa por mensagem.

[ ] Mensagem não duplicada**: Para evitar spam, um usuário não pode enviar a mesma mensagem para o mesmo amigo várias vezes seguidas sem uma resposta.

[x] Tamanho da Mensagem**: Cada mensagem deve ter no máximo 500 caracteres para garantir legibilidade.

[ ] Mensagem Expirada**: Mensagens podem ser automaticamente excluídas após 30 dias.

[ ] Notificação de Leitura**: O status de leitura (`LIDA`) deve ser atualizado quando o destinatário visualizar a mensagem.

[ ] Confidencialidade de Conversas**: Mensagens apagadas por um usuário não devem ser restauradas, mesmo se a outra parte ainda as tiver visíveis.