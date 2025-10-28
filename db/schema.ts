import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const chats = pgTable('chats', {
  id: uuid().defaultRandom().primaryKey(),
  title: text('title'),
  userId: text('user_id').notNull(),
  ...timestamps,
});
