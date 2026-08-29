import type {
  AiChatMessage,
  AiChatModel,
  AiChatThread,
  ChatAuthor,
  ChatConversation,
  ChatMessage,
  InboxFolder,
  InboxLabel,
  InboxMessage,
} from "./types";

export const previewAuthors: Record<string, ChatAuthor> = {
  self: { id: "self", name: "You" },
  ada: { id: "ada", name: "Ada Lovelace" },
};

export const previewMessages: ChatMessage[] = [
  {
    id: "m1",
    authorId: "ada",
    body: "Can you review the checkout flow?",
    createdAt: "2026-08-14T16:02:00.000Z",
    status: "read",
  },
  {
    id: "m2",
    authorId: "self",
    body: "Yes — I will send notes after lunch.",
    createdAt: "2026-08-14T16:04:00.000Z",
    status: "delivered",
  },
];

export const previewConversations: ChatConversation[] = [
  {
    id: "c1",
    title: "Ada Lovelace",
    peer: previewAuthors.ada!,
    preview: "Can you review the checkout flow?",
    updatedAt: "2026-08-14T16:04:00.000Z",
    unread: 1,
  },
  {
    id: "c2",
    title: "Grace Hopper",
    peer: { id: "grace", name: "Grace Hopper" },
    preview: "Compiler notes attached.",
    updatedAt: "2026-08-13T11:00:00.000Z",
  },
];

export const previewFolders: InboxFolder[] = [
  { id: "inbox", label: "Inbox", count: 2 },
  { id: "archive", label: "Archive", count: 0 },
];

export const previewLabels: InboxLabel[] = [
  { id: "work", label: "Work" },
  { id: "billing", label: "Billing" },
];

export const previewInboxMessages: InboxMessage[] = [
  {
    id: "mail-1",
    folderId: "inbox",
    from: "Ada Lovelace",
    to: "You",
    subject: "Checkout review",
    snippet: "Can you look at the payment step?",
    body: "The payment step should not persist CVC. Please confirm.",
    createdAt: "2026-08-14T15:00:00.000Z",
    read: false,
    starred: false,
    labelIds: ["work"],
  },
  {
    id: "mail-2",
    folderId: "inbox",
    from: "Billing",
    subject: "Invoice 441",
    snippet: "Your invoice is ready.",
    body: "Invoice 441 is attached as a summary. No PAN is included.",
    createdAt: "2026-08-13T09:00:00.000Z",
    read: true,
    starred: true,
    labelIds: ["billing"],
  },
];

export const previewAiThreads: AiChatThread[] = [
  { id: "t1", title: "PCI notes", updatedAt: "2026-08-14T12:00:00.000Z" },
  { id: "t2", title: "Streaming abort", updatedAt: "2026-08-14T10:00:00.000Z" },
];

export const previewAiModels: AiChatModel[] = [
  { id: "atlas", label: "Atlas" },
  { id: "helix", label: "Helix" },
];

export const previewAiMessages: AiChatMessage[] = [
  {
    id: "a1",
    role: "user",
    content: "Show a TypeScript snippet.",
    createdAt: "2026-08-14T12:00:00.000Z",
  },
  {
    id: "a2",
    role: "assistant",
    content: [
      { type: "text", text: "Code is plain text, never HTML:" },
      { type: "code", language: "ts", text: 'export const ping = () => "pong";' },
    ],
    createdAt: "2026-08-14T12:00:05.000Z",
  },
];
