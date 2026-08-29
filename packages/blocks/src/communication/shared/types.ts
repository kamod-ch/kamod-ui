export type ChatDeliveryStatus = "pending" | "sent" | "delivered" | "read" | "failed";

export type ChatAuthor = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type ChatMessage = {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
  status?: ChatDeliveryStatus;
  kind?: "text" | "system";
};

export type ChatConversation = {
  id: string;
  title: string;
  peer: ChatAuthor;
  preview: string;
  updatedAt: string;
  unread?: number;
};

export type InboxFolder = {
  id: string;
  label: string;
  count?: number;
};

export type InboxLabel = {
  id: string;
  label: string;
};

export type InboxMessage = {
  id: string;
  folderId: string;
  from: string;
  to?: string;
  subject: string;
  snippet: string;
  body: string;
  createdAt: string;
  read: boolean;
  starred: boolean;
  labelIds?: string[];
};

export type AiChatRole = "user" | "assistant" | "system";

export type AiChatBlock =
  | { type: "text"; text: string }
  | { type: "code"; text: string; language?: string };

export type AiChatMessage = {
  id: string;
  role: AiChatRole;
  content: string | AiChatBlock[];
  createdAt: string;
  streaming?: boolean;
};

export type AiChatThread = {
  id: string;
  title: string;
  updatedAt: string;
};

export type AiChatModel = {
  id: string;
  label: string;
};

export type CommunicationLayout = "auto" | "split" | "stack";

export type InboxPane = "folders" | "list" | "reader";
