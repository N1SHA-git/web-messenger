import { UserId } from '@/kernel/ids';

export type UserEntity = {
  id: UserId;
  username: string;
  email: string;
  password?: string;
  avatar_url?: File;
  status?: 'online' | 'offline';
  created_at?: Date;
  last_online?: Date;
};

export type SessionEntity = {
  userId: UserId;
  expiresAt: Date;
};
