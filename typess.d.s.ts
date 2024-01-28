// type ChatMessage = {
//   media: string;
//   seen_at?: {
//     seconds: number;
//     nanoseconds: number;
//   };
//   text: string;
//   sender: string;
// };

// type UserData = {
//   username: string;
//   id: string;
//   email: string;
// };

// type LastMessage = {
//   media: boolean;
//   timeStamp: {
//     seconds: number;
//     nanoseconds: number;
//   };
//   text: string;
//   sender: string;
//   read: boolean;
// };

// type ChatData = {
//   messages: ChatMessage[];
//   transactions: Record<string, unknown>;
//   user: UserData;
//   lastMessage: LastMessage;
// };

// type ChatObject = {
//   id: string;
//   data: ChatData;
// };

// type ReportType = "feedback" | "report";
// type CauseType = "transaction" | "technical" | "chat" | "feedback";

// type ReportData = {
//   link: string;
//   type: ReportType;
//   cause: CauseType;
//   details: {
//     subject: string;
//     body: string;
//   };
//   date: {
//     nanoseconds: number;
//     seconds: number;
//   };
//   user: {
//     uid: string;
//     username: string;
//     email: string;
//   };
//   read: boolean;
//   transactionId: string;
//   data?: CauseType extends "transaction"
//     ? {
//         chatId: string;
//         subcategory: string;
//         link: string;
//         amount: number;
//         status: string;
//         vendor: string;
//         date: {
//           seconds: number;
//           nanoseconds: number;
//         };
//         product: string;
//         isApproved: boolean;
//         user: {
//           uid: string;
//           username: string;
//           email: string;
//         };
//         payment: {
//           details: {
//             accountNumber: string;
//             bank: string;
//             accountName: string;
//           };
//         };
//       }
//     : undefined;
// };

// type PaymentDetails = {
//   accountName: string;
//   accountNumber: string;
//   bank: string;
// };

// type DateObject = {
//   seconds: number;
//   nanoseconds: number;
// };

// type User = {
//   email: string;
//   username: string;
//   uid: string;
// };

// type Transaction = {
//   chatId: string;
//   user: User;
//   link: string;
//   isApproved: boolean;
//   product: string;
//   vendor: string;
//   date: {
//     nanoseconds: number;
//     seconds: number;
//   };
//   amount: number;
//   payment: {
//     details: PaymentDetails;
//   };
//   subcategory: string;
//   status: string;
//   referenceId: string;
// };

// type Message = {
//   id: string;
//   user_id: string;
//   messages: {
//     sender: string;
//     text: string;
//     sent_at: Date;
//     media: string;
//   }[];
//   lastMessage: {
//     timeStamp: {
//       seconds: number;
//       nanoseconds: number;
//     };
//     media: boolean;
//     text: string;
//   };
//   transactions: string[];
//   transactionPrompted: boolean;
// };

// type UserData = {
//   payment?: {
//     accountName: string;
//     bank: string;
//     accountNumber: string;
//   }[];
//   imageUrl: null;
//   email: string;
//   savedPayments: boolean;
//   id: string;
//   username: string;
//   role: string;
// };

// type Feedback = {
//   approved: boolean;
//   user: {
//     username: string;
//     profileUrl: string;
//   };
//   content: {
//     stars: number;
//     review: string;
//   };
// };

// type ReviewContent = {
//   stars: number;
//   review: string;
// };

// type ReviewData = {
//   user: {
//     id: UserId;
//     username: Username;
//     photoUrl: string;
//   };
//   date: Date;
//   approved: boolean;
//   content: ReviewContent;
//   link?: string; // Optional link
// };

// type CachedUser = {
//   uid: string;
//   displayName: string;
//   email: string;
//   photoURL: string | null;
//   emailVerified: boolean;
// };

// type FireStoreUser = {
//   email: string;
//   username: string;
//   payment: {
//     accountNumber: string;
//     bank: string;
//     accountName: string;
//   }[];
//   imageUrl: string; // Optional property
//   id: string;
//   role: "user" | "admin" | "other"; // Example of a type with multiple options
//   savedPayments: boolean;
// };


// type SelectCardSubcategoryParams = {
//   price: number;
//   subcategory: string;
// };


// type GiftCard = {
//   id: string;
//   popular: boolean;
//   name: string;
//   image: string;
//   title: string;
//   description: string;
//   listings: { dollar: number }[];
//   coverImage: string;
//   subCategory: { value: string; title: string }[];
// };

// interface CookieUser {
//   uid: string;
//   displayName: string;
//   email: string;
//   photoURL: string;
//   emailVerified: boolean;
// }