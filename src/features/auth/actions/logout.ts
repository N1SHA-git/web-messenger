"use server";
import { sessionService } from "@/entities/user/server";

export async function logoutAction() {
  await sessionService.deleteSession(); // Удаление сессии после выхода пользователя
}
