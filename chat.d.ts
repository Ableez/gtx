// USER CHAT RELATED

import { v4 as uuid } from "uuid";
import { Subcategory } from "./types";

interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

enum MessageInterfaceinterface {
  TEXT = "text",
  MEDIA = "media",
}

interface MediaMeta {
  media_size: string;
  media_name: string;
  media_interface: stri;
}

interface MediaContent {
  caption?: string;
  url: string;
  metadata: MediaMeta;
}

interface Sender {
  uid: string;
  username: string;
}

interface ReadReceipt {
  time: Timestamp;
  delivery_status: string;
  status: boolean;
}
interface Message {
  id: string;
  type: string;
  edited_at: null | any;
  deleted: boolean;
  timeStamp: Timestamp;
  content: {
    text: string;
    media: MediaContent;
  };
  card: {
    title: string;
    data: any;
  };
  quoted_message: {
    text: string;
    url: string;
    metadata: MediaMeta;
  } | null;
  recipient: string;
  edited: boolean;
  deleted_at: null | any;
  sender: Sender;
  read_receipt: ReadReceipt;
}

interface Transaction {
  id: string;
  started: boolean;
  cardDetails: {
    subcategory: Subcategory;
    popular: boolean;
    category: string;
    vendor: string;
    title: string;
    price: string;
    id: string;
    image: string;
    name: string;
    ecode: string;
    rate: string;
  };
  accountDetails: {
    accountName: string;
    accountNumber: number;
    bankName: string;
  };
  started: true;
  accepted: false;
  completed: false;
  status: "pending" | "done" | "cancelled" | "rejected" | "processing";
}

export interface TransactionRec {
  id: string;
  data: Transaction;
  chatId: string;
  userId: string;
  payment: {
    method: string;
    reference: string;
  };
  created_at: { seconds: number; nanoseconds: number };
  updated_at: { seconds: number; nanoseconds: number };
}

interface LastMessage {
  id: string;
  read_receipt: ReadReceipt;
  sender: string;
  content: {
    text: string;
    media: boolean;
  };
}
interface Conversation {
  id: string;
  transaction: Transaction;
  messages: Message[];
  lastMessage: LastMessage;
  user: {
    username: string;
    uid: string;
    email: string;
    photoUrl: string;
  };
  chatStatus: "closed" | "open";
  created_at: Timestamp;
  updated_at: Timestamp;
}

export type ConversationCollections = {
  id: string;
  data: Conversation;
}[];
