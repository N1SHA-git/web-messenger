import { chatRepository } from "../repositories/chat";
import { UserId } from "@/kernel/ids";

export async function getUsersForSidebar(loggedInUserId: UserId) {
  const users = await chatRepository.fetchUsers(loggedInUserId);
  return users;
}
