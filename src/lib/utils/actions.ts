"use server";
import { addDoc, collection } from "firebase/firestore";
import { giftcards } from "../data/giftcards";
import { db } from "./firebase";
import { cookies } from "next/headers";
import { v4 as uuid } from "uuid";
import { redirect } from "next/navigation";
import { Conversation } from "../../../chat";

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
  const userFrCookie = cookies().get("user");

  if (userFrCookie === undefined || userFrCookie === null) {
    return {
      link: "/",
      logged: false,
      error: "You must be logged in.",
      proceed: false,
    };
  }

  const user = JSON.parse(userFrCookie?.value || "user")?.providerData[0];

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

  const subcategoryData = data.subCategory.find(
    (c) => c.value === subcategoryValue
  );

  const cardInfo = {
    cardTitle: data.name,
    price: `$${price}`,
    subcategory: `${subcategoryData?.title}`,
  };

  try {
    const messagesRef = collection(db, "Messages");
    const createdChat = await addDoc(messagesRef, {
      transaction: {
        started: false,
        cardDetails: {
          id: data.id,
          name: data.name,
          vendor: data.name,
          subcategory: cardInfo.subcategory,
          price: cardInfo.price,
        },
      },
      messages: [
        {
          id: uuid(),
          type: "text",
          deleted: false,
          deleted_at: null, //date
          sender: {
            username: user.displayName,
            uid: user.uid,
          },
          recipient: "admin",
          content: {
            text: `Trade a ${cardInfo.price} ${cardInfo.cardTitle} ${cardInfo.subcategory} gift card`,
            media: {
              caption: "",
              url: "",
              metadata: {
                media_name: "",
                media_size: "",
                media_type: "",
              }, //?optional
            },
          },
          timeStamp: new Date(),
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
        id: "", // Message ref id
        content: {
          sender: {
            username: "",
            uid: "",
          },
          text: "",
          media: {
            url: "",
            metadata: {
              media_name: "",
              media_size: "",
              media_type: "",
            }, //?optional
          },
        },
      },
      user: {
        username: "",
        uid: "",
        email: "",
      },
      created_at: new Date(),
      updated_at: new Date(),
    });

    const link = `${createdChat.id}`;

    // redirect(`${createdChat.id}`);
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
      error: error,
      proceed: false,
    };
  }
};
