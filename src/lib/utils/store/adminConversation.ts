import { create } from "zustand";
import type { Conversation, Message } from "../../../../chat";
import { produce } from "immer";

type State = {
  conversation: Conversation | undefined;
};

type Actions = {
  addMessage: (message: Message) => void;
  updateConversation: (conversation: Conversation) => void;
};

export const adminCurrConversationStore = create<State & Actions>((set) => ({
  conversation: undefined,
  addMessage: (message) =>
    set(
      produce((draft) => {
        if (draft.conversation) {
          return {
            ...draft.conversation.messages,
            message,
          };
        } else {
          return message;
        }
      })
    ),

  updateConversation: (conversation) => {
    set({ conversation });
  },
}));
