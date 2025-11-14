import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const chats = pgTable(
  'chats',
  {
    id: uuid().defaultRandom().primaryKey(),
    title: text('title'),
    userId: text('user_id').notNull(),
    ...timestamps,
  },
  (t) => {
    return [index('user_id_index_on_chats').on(t.userId)];
  }
);

export const messageRoleEnum = pgEnum('message_role', ['user', 'assistant']);
export const messageStatusEnum = pgEnum('message_status', ['INIT', 'DONE']);
export const messages = pgTable(
  'messages',
  {
    id: uuid().defaultRandom().primaryKey(),
    chatId: uuid('chat_id')
      .notNull()
      .references(() => chats.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    position: integer('position').notNull(),
    role: messageRoleEnum('role').notNull(),
    status: messageStatusEnum('status').notNull(),
    ...timestamps,
  },
  (t) => {
    return [index('chat_id_index_on_messages').on(t.chatId)];
  }
);

export const chatsRelations = relations(chats, ({ many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));
