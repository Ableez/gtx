// USER CHAT RELATED

import { v4 as uuid } from "uuid";

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
  time: Date;
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
  started: boolean;
  cardDetails: {
    id: string;
    name: string;
    vendor: string;
    subcategory: string;
    price: number;
    ecode?: number;
    rate: string;
  };
  accountDetails: {
    accountName: string;
    accountNumber: number;
    bankName: string;
  };
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
  created_at: Date;
  updated_at: Date;
}

export type ConversationCollections = {
  id: string;
  data: Conversation;
}[];
