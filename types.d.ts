import { Conversation } from "./chat";

export type ReportType = "feedback" | "report";
export type CauseType = "transaction" | "technical" | "chat" | "feedback";

export type ReportData = {
  link: string;
  type: ReportType;
  cause: CauseType;
  details: {
    subject: string;
    body: string;
  };
  date: Date;
  user: {
    uid: string;
    username: string;
    email: string;
  };
  read: boolean;
  transactionId: string;
  data?: CauseType extends "transaction"
    ? {
        chatId: string;
        subcategory: string;
        link: string;
        amount: number;
        status: string;
        vendor: string;
        date: Date;
        product: string;
        isApproved: boolean;
        user: {
          uid: string;
          username: string;
          email: string;
        };
        payment: {
          details: {
            accountNumber: string;
            bank: string;
            accountName: string;
          };
        };
      }
    : undefined;
};

export type CachedUser = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  emailVerified: boolean;
};

export type GiftCard = {
  id: string;
  popular: boolean;
  name: string;
  image: string;
  title: string;
  description: string;
  listings: { dollar: number }[];
  coverImage: string;
  subCategory: { value: string; title: string }[];
};
