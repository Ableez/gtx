import { Conversation, Timestamp } from "./chat";

export type ReportType = "feedback" | "report";
export type CauseType = "transactional" | "technical" | "chat" | "feedback";

export type ReportData = {
  link: string;
  type: ReportType;
  cause: CauseType;
  details: {
    subject: string;
    body: string;
  };
  date: Timestamp;
  user: {
    uid: string;
    username: string;
    email: string;
  };
  read: boolean;
  transactionId: string;
  data?: any;
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
  category: string;
  subcategory: Subcategory[];
};

export type Subcategory = {
  value: string;
  currency: string;
  image: string;
  country: string;
};

export type GiftcardNew = {
  package: string;
  image: string;
  category: string;
  countries: {
    name: string;
    image: string;
    packageName: string;
    currency: string;
    markup: number;
    items: {
      Local_Product_Value_Min: number;
      Local_Product_Value_Max: number;
      Cross_Rate: number;
      KUDA_IDENTIFIER: string;
      Amount_In_Naira: number;
      Rate: number;
    }[];
  }[];
}[];

interface AccountDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
}

interface User {
  imageUrl: string;
  savedPayments: boolean;
  role: string;
  email: string;
  payment: AccountDetails[];
  id: string;
  username: string;
}

export type ReviewContent = {
  stars: number;
  review: string;
};

export type ReviewData = {
  user: {
    id: string;
    username: string;
    photoUrl: string;
  };
  date: Timestamp;
  approved: boolean;
  content: ReviewContent;
  link?: string; // Optional link
};

export type Feedback = {
  approved: boolean;
  content: { review: string; stars: number };
  date: Timestamp;
  user: {
    photoUrl: string;
    username: string;
  };
};
