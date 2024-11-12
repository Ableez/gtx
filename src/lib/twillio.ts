import { env } from "@/env";
import twilio from "twilio";
// Download the helper library from https://www.twilio.com/docs/node/install

// Find your Account SID and Auth Token at twilio.com/console

// and set the environment variables. See http://twil.io/secure

const accountSid = env.TWILIO_ACCOUNT_SID;

const authToken = env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export const sendNewChatNotification = async (to: string, text: string) => {
  try {
    const msg = await client.messages.create({
      body: text,
      from: env.TWILIO_PHONE_NUMBER,
      to: to,
      forceDelivery: true,
    });

    console.log("[TWILLIO_SUCCESS]:[SEND_NEW_CHAT_NOTIFICATION]", msg);
  } catch (error) {
    console.error("[TWILLIO_ERROR]:[SEND_NEW_CHAT_NOTIFICATION]", error);
  }
};
