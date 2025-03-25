import { UserId } from "@/kernel/ids";

export type UserEntity = {
  id: UserId;
  username: string;
  email: string;
  password?: string;
  avatar_url?: string;
  created_at?: string;
  last_online?: string;
};

export type SessionEntity = {
  userId: UserId;
  expiresAt: Date;
};
