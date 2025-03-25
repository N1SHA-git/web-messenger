import { MessageId, UserId } from "@/kernel/ids";

export type MessageEntity = {
  id: MessageId;
  sender_id: UserId;
  receiver_id: UserId;
  text?: string;
  image?: string;
  created_at: string;
};

export type MessageData = {
  text?: string | null;
  image?: string | null;
};
