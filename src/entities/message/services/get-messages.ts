import { UserId } from "@/kernel/ids";
import { messagesRepository } from "../repositories/messages";

export async function get_messages(receiver_id: UserId, my_id: UserId) {
  const messages = messagesRepository.fetchMessages(receiver_id, my_id);
  return messages;
}
