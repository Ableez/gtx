import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  pgEnum,
  pgTableCreator,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `greatex_${name}`);

// Enum definitions
export const assetTypeEnum = pgEnum("asset_type", ["CRYPTO", "GIFTCARD"]);
export const tradeStatusEnum = pgEnum("trade_status", [
  "PENDING",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
]);
export const currencyEnum = pgEnum("currency_type", [
  "NGN",
  "USD",
  "EUR",
  "GBP",
  "AUD",
  "CAD",
  "JPY",
]);
export const chatTypeEnum = pgEnum("chat_type", [
  "TRADE",
  "SUPPORT",
  "GENERAL",
]);
export const messageTypeEnum = pgEnum("message_type", ["STANDARD", "CARD"]);

export const user = createTable(
  "user",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    username: varchar("username", { length: 255 }),
    firstName: varchar("first_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    imageUrl: varchar("image_url", { length: 255 }),
    profileImageUrl: varchar("profile_image_url", { length: 255 }),
    birthday: timestamp("birthday"),
    gender: varchar("gender"),
    passwordEnabled: boolean("password_enabled").notNull().default(true),
    twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
    externalId: varchar("external_id", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    lastSignInAt: timestamp("last_sign_in_at"),
    disabled: boolean("disabled").notNull().default(false),
    deleted: boolean("deleted").notNull().default(false),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    // Indexes for user lookups
    emailIdx: index("user_email_idx").on(table.email),
    usernameIdx: index("user_username_idx").on(table.username),
    externalIdIdx: index("user_external_id_idx").on(table.externalId),
    // Composite index for user search
    nameSearchIdx: index("user_name_search_idx").on(
      table.firstName,
      table.lastName
    ),
  })
);

export const asset = createTable(
  "asset",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    type: assetTypeEnum("type").notNull(),
    name: varchar("name").notNull(),
    coverImage: varchar("cover_image"),
    description: varchar("description"),
    quote: varchar("quote"),
    category: varchar("category"),
    featured: boolean("featured").notNull().default(false),
    popular: boolean("popular").notNull().default(false),
    tradeCount: integer("trade_count").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    // Index for asset type filtering
    typeIdx: index("asset_type_idx").on(table.type),
    // Index for asset search
    nameIdx: index("asset_name_idx").on(table.name),
  })
);

export const trade = createTable(
  "trade",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    userId: varchar("user_id").notNull(),
    assetId: uuid("asset_id").notNull(),
    currency: currencyEnum("currency").notNull().default("USD"),
    status: tradeStatusEnum("status").notNull(),
    chatId: uuid("chat_id").notNull(),
    amountInCURRENCY: varchar("amount_in_currency"),
    amountInNGN: varchar("amount_in_naira"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    // Indexes for trade lookups and filtering
    userIdIdx: index("trade_user_id_idx").on(table.userId),
    assetIdIdx: index("trade_asset_id_idx").on(table.assetId),
    statusIdx: index("trade_status_idx").on(table.status),
    // Composite index for user's trades by status
    userStatusIdx: index("trade_user_status_idx").on(
      table.userId,
      table.status
    ),
    // Index for price range queries
    amountIdx: index("trade_amount_idx").on(table.amountInCURRENCY),
    // Composite index for time-based queries per user
    userTimeIdx: index("trade_user_time_idx").on(table.userId, table.createdAt),
  })
);

export const chat = createTable(
  "chat",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    type: chatTypeEnum("type").notNull(),
    userId: varchar("userId").notNull(),
    assetId: uuid("asset_id"),
    lastMessageId: uuid("last_message_id"),
    tradeId: uuid("trade_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    // Indexes for chat lookups
    userIdIdx: index("chat_user_id_idx").on(table.userId),
    assetIdIdx: index("chat_asset_id_idx").on(table.assetId),
    // Composite index for user's chats by type
    userTypeIdx: index("chat_user_type_idx").on(table.userId, table.type),
    // Index for recent chats
    updateTimeIdx: index("chat_update_time_idx").on(table.updatedAt),
  })
);

export const message = createTable(
  "message",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    chatId: uuid("chat_id").notNull(),
    text: varchar("text").notNull(),
    type: messageTypeEnum("type").notNull().default("STANDARD"),
    mediaId: varchar("media_id"),
    sender: varchar("sender").notNull(),
    recipient: varchar("recipient"),
    deleted: boolean("deleted").notNull().default(false),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    // Indexes for message lookups
    chatIdIdx: index("message_chat_id_idx").on(table.chatId),
    // Composite index for chat messages ordered by time
    chatTimeIdx: index("message_chat_time_idx").on(
      table.chatId,
      table.createdAt
    ),
    // Index for media messages
    mediaIdx: index("message_media_idx").on(table.mediaId),
  })
);

export const media = createTable(
  "media",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    ownerId: varchar("user_id").notNull(),
    url: varchar("url").notNull(),
    type: varchar("type", { length: 50 }).notNull(),
    fileName: varchar("file_name").notNull(),
    size: decimal("size", { precision: 10, scale: 0 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    // Indexes for media lookups
    ownerIdIdx: index("media_owner_id_idx").on(table.ownerId),
    typeIdx: index("media_type_idx").on(table.type),
    // Composite index for user's media by type
    ownerTypeIdx: index("media_owner_type_idx").on(table.ownerId, table.type),
  })
);

// Relations remain the same but with updated table references
export const usersRelations = relations(user, ({ many }) => ({
  chats: many(chat),
  trades: many(trade),
  messages: many(message),
  media: many(media),
}));

export const chatRelations = relations(chat, ({ many, one }) => ({
  messages: many(message),
  lastMessage: one(message, {
    fields: [chat.lastMessageId],
    references: [message.id],
  }),
  media: many(media),
  user: one(user, {
    fields: [chat.userId],
    references: [user.id],
  }),
  asset: one(asset, {
    fields: [chat.assetId],
    references: [asset.id],
  }),
  trade: one(trade, {
    fields: [chat.tradeId],
    references: [trade.id],
  }),
}));

export const messageRelations = relations(message, ({ many, one }) => ({
  media: many(media),
  chat: one(chat, { fields: [message.chatId], references: [chat.id] }),
}));

export const tradeRelations = relations(trade, ({ one }) => ({
  user: one(user, {
    fields: [trade.userId],
    references: [user.id],
  }),
  asset: one(asset, {
    fields: [trade.assetId],
    references: [asset.id],
  }),
  chat: one(chat, {
    fields: [trade.chatId],
    references: [chat.id],
  }),
}));

export const mediaRelations = relations(media, ({ one }) => ({
  user: one(user, { fields: [media.ownerId], references: [user.id] }),
}));

// User Types
export type UserSelect = InferSelectModel<typeof user>;
export type UserInsert = InferInsertModel<typeof user>;

// Asset Types
export type AssetSelect = InferSelectModel<typeof asset>;
export type AssetInsert = InferInsertModel<typeof asset>;

// Trade Types
export type TradeSelect = InferSelectModel<typeof trade>;
export type TradeInsert = InferInsertModel<typeof trade>;

// Chat Types
export type ChatSelect = InferSelectModel<typeof chat>;
export type ChatInsert = InferInsertModel<typeof chat>;

// Message Types
export type MessageSelect = InferSelectModel<typeof message>;
export type MessageInsert = InferInsertModel<typeof message>;

// Media Types
export type MediaSelect = InferSelectModel<typeof media>;
export type MediaInsert = InferInsertModel<typeof media>;

// Enum Types
export type AssetType = (typeof assetTypeEnum.enumValues)[number];
export type TradeStatus = (typeof tradeStatusEnum.enumValues)[number];
export type ChatType = (typeof chatTypeEnum.enumValues)[number];

// Extended Types with Relations
export type UserWithRelations = UserSelect & {
  chats?: ChatSelect[];
  trades?: TradeSelect[];
  messages?: MessageSelect[];
  media?: MediaSelect[];
};

export type ChatWithRelations = ChatSelect & {
  messages?: MessageSelect[];
  lastMessage?: MessageSelect;
  media?: MediaSelect[];
  user?: UserSelect;
  asset?: AssetSelect;
};

export type MessageWithRelations = MessageSelect & {
  media?: MediaSelect[];
  user?: UserSelect;
  chat?: ChatSelect;
};

export type TradeWithRelations = TradeSelect & {
  user?: UserSelect;
  asset?: AssetSelect;
  chat?: ChatSelect;
};

export type MediaWithRelations = MediaSelect & {
  user?: UserSelect;
};

// Utility types for partial inserts/updates
export type PartialUserInsert = Partial<UserInsert>;
export type PartialAssetInsert = Partial<AssetInsert>;
export type PartialTradeInsert = Partial<TradeInsert>;
export type PartialChatInsert = Partial<ChatInsert>;
export type PartialMessageInsert = Partial<MessageInsert>;
export type PartialMediaInsert = Partial<MediaInsert>;

// Types for search/filter parameters
export type UserSearchParams = {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  externalId?: string;
};

export type AssetSearchParams = {
  type?: AssetType;
  name?: string;
  category?: string;
};

export type TradeSearchParams = {
  userId?: string;
  assetId?: string;
  status?: TradeStatus;
  minAmount?: number;
  maxAmount?: number;
  dateFrom?: Date;
  dateTo?: Date;
};

export type ChatSearchParams = {
  userId?: string;
  type?: ChatType;
  assetId?: string;
};

export type MessageSearchParams = {
  chatId?: string;
  userId?: string;
  type?: string;
  dateFrom?: Date;
  dateTo?: Date;
  includeDeleted?: boolean;
};

export type MediaSearchParams = {
  ownerId?: string;
  type?: string;
  fileName?: string;
};
