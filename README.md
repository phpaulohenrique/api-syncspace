# SyncSpace API

## Overview

This API enables the management of users, friend requests, and friendships. Key functionalities include user creation, sending and managing friend requests, and handling confirmed friendships.

## Features

### 1. User Management

- Create, update, list, and delete users.
- Each user must have a unique email.

### 2. Friend Requests

[x] Send a friend request from one user to another.

[x] List all pending friend requests for a user.

[x] Accept or reject friend requests.

[x] Prevent users from sending a friend request to themselves or sending multiple pending requests to the same user.

### 3. Friendship Management

[x] Convert an accepted friend request into a friendship.

[x] List all friends of a user.

[x] Remove an existing friendship.

[x] Ensure that a friendship can only exist between two users who have accepted a friend request.

### 4. Messaging Between Friends

- **Send Message**: A user can send a message to another user in their friends list.
- **List Conversations**: List all messages exchanged between two friends, sorted by date.
- **Message Status**: Implement read status for each message (`READ` or `UNREAD`).
- **Delete Message**: Allow a user to delete a sent message, removing it only from their view.

## Business Rules / Feat

[x] A user cannot send a friend request to themselves.

[x] There cannot be more than one pending friend request between two users.

[x] When a friend request is accepted, it must be removed from the `FriendRequests` table, and a friendship must be created in the `Friendships` table.

[x] If a friend request is rejected, it must remain in the `FriendRequests` table with the status `REJECTED`.

[x] **Only friends can exchange messages**: Only users who are friends can start a message conversation.

[x] **Message Length**: Each message must have a maximum of 500 characters to ensure readability.

[x] **Read Notification**: The read status (`READ`) must be updated when the recipient views the message.

[x] **Conversation Confidentiality**: Deleted messages by a user should not be restored, even if the other party still has them visible.

[] Send images (S3)

[] Auth with JWT token

[] Repository pattern

[] Refactor

[] Change ids to use UUID

[] Add Tests