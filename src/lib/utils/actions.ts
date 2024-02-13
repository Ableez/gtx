"use server";
import { addDoc, collection } from "firebase/firestore";
import { giftcards } from "../data/giftcards";
import { db } from "./firebase";
import { cookies } from "next/headers";
import { v4 as uuid } from "uuid";
import { GiftCard } from "../../../types";
import { User } from "firebase/auth";

export const getCardData = (id: string | undefined): GiftCard | null => {
  if (!id) {
    return null;
  }

  const data = giftcards.find((card) => {
    return card.id === id;
  });

  if (data) {
    return data;
  }

  return null;
};

export const startChat = async (data: GiftCard, formData: FormData) => {
  const cachedUser = cookies().get("user")?.value;
  const user = cachedUser ? (JSON.parse(cachedUser) as User) : null;

  if (!user) {
    return {
      link: "/",
      logged: false,
      error: "You must be logged in.",
      proceed: false,
    };
  }

  const price = formData.get("price");
  const subcategoryValue = formData.get("subcategory");

  // validate the above fields and return if they are empty or invalid
  if (!price || !subcategoryValue) {
    return {
      link: "/",
      logged: false,
      error: "Please fill in all fields.",
      proceed: false,
    };
  }

  const subcategoryData = data.subcategory.find(
    (c) => c.value === subcategoryValue
  );

  const cardInfo = {
    cardTitle: data.name,
    price: `$${price}`,
    subcategory: subcategoryData,
  };

  try {
    const msg = {
      id: uuid(),
      timeStamp: new Date(),
    };

    const messagesRef = collection(db, "Messages");
    const createdChat = await addDoc(messagesRef, {
      chatStatus: "open",
      transaction: {
        started: false,
        cardDetails: {
          ...data,
          id: data.id,
          name: data.name,
          vendor: data.name,
          subcategory: cardInfo.subcategory,
          price: cardInfo.price,
        },
      },
      messages: [
        {
          id: msg.id,
          type: "card",
          deleted: false,
          sender: {
            username: user?.displayName,
            uid: user?.uid,
          },
          recipient: "admin",
          card: {
            title: "card_detail",
            data: {
              id: data.id,
              image: data.image,
              name: data.name,
              vendor: data.name,
              subcategory: cardInfo.subcategory,
              price: cardInfo.price,
            },
          },
          timeStamp: msg.timeStamp,
          edited: false,
          edited_at: null, //date
          read_receipt: {
            delivery_status: "sent", // "not_sent" | "sent" | "delivered" | "seen"
            status: false,
            time: null, //date
          },
          quoted_message: {
            text: "",
            url: "",
            metadata: {
              media_name: "",
              media_size: "",
              media_type: "",
            },
          }, // or null,
        },
      ],
      lastMessage: {
        id: msg.id,
        sender: "user",
        content: {
          text: `Trade a ${cardInfo.price} ${cardInfo.cardTitle} ${cardInfo.subcategory?.value} gift card`,
          media: false,
        },
        read_receipt: {
          delivery_status: "sent",
          status: false,
          time: msg.timeStamp,
        },
      },
      user: {
        username: user?.displayName,
        uid: user?.uid,
        email: user?.email,
        photoUrl: user?.photoURL || "",
      },
      created_at: msg.timeStamp,
      updated_at: msg.timeStamp,
    });

    const link = `${createdChat.id}`;

    return {
      link,
      logged: true,
      error: "",
      proceed: true,
    };
  } catch (error) {
    console.log(error);
    return {
      link: "",
      logged: true,
      error: "Internal error",
      proceed: false,
    };
  }
};
