"use server"
import { sessionService } from '@/entities/user/server';
import {ProfilePageClient} from './profile-page-client';

export default async function ProfilePage() {
  // Вызов verifySession здесь допустим, так как это серверный компонент
  const { userId } = await sessionService.verifySession();

  return <ProfilePageClient userId={userId} />;
}
