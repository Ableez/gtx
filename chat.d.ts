// USER CHAT RELATED

import { v4 as uuid } from "uuid";

interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

enum MessageInterfaceinterfac {
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
  time: null | any;
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
  interface: MessageInterfaceinterfa;
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
  };
  accountDetails: {
    accountName: string;
    accountNumber: number;
    bankName: string;
  };
}

interface Conversation {
  id: string;
  transaction: Transaction;
  messages: Message[];
  lastMessage: {
    id: string;
    content: {
      sender: Sender;
      text: string;
      media?: {
        url: string;
        metadata?: MediaMeta;
      };
    };
  };
  user: {
    username: string;
    uid: string;
    email: string;
  };
  created_at: Date;
  updated_at: Date;
}

// // Example usage
// const conversation: Conversation = {
//   id: uuid(),
//   transaction: {
//     started: false,
//     cardDetails: {
//       id: "",
//       name: "",
//       vendor: "",
//       subcategory: "",
//       price: 0,
//     },
//     accountDetails: {
//       accountName: "",
//       accountNumber: 0,
//       bankName: "",
//     },
//   },
//   messages: [
//     {
//       id: uuid(),
//       edited_at: null,
//       deleted: false,
//       timeStamp: { seconds: 0, nanoseconds: 0 },
//       content: {
//         text: "",
//         media: {
//           caption: "",
//           url: "",
//           metadata: {
//             media_name: "",
//             media_size: "",
//             media_interface: ,
//           },
//         },
//       },
//       quoted_message: null,
//       interface: MessageInterfaceinterface.TE,
//       recipient: "",
//       edited: false,
//       deleted_at: null,
//       sender: {
//         uid: "",
//         username: "",
//       },
//       read_receipt: {
//         time: null,
//         delivery_status: "",
//         status: false,
//       },
//     },
//   ],
//   lastMessage: {
//     id: "",
//     content: {
//       sender: {
//         uid: "",
//         username: "",
//       },
//       text: "",
//       media: {
//         url: "",
//         metadata: {
//           media_name: "",
//           media_size: "",
//           media_interface: ,
//         },
//       },
//     },
//   },
//   user: {
//     username: "",
//     uid: "",
//     email: "",
//   },
//   created_at: new Date(),
//   updated_at: new Date(),
// };
