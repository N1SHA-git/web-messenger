import { UserId } from "@/kernel/ids";
import { messagesRepository } from "../repositories/messages";
import { MessageData } from "../domain";

export async function send_message(
  receiver_id: UserId,
  message_data: MessageData,
  sender_id: UserId,
) {
  const message = messagesRepository.postMessage(
    receiver_id,
    message_data,
    sender_id,
  );
  return message;
}
