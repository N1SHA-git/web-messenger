'use client';
import { userRepository } from '@/entities/user/repositories/user';
import { UserEntity } from '@/entities/user/server';
import { Avatar } from '@/features/avatar';
import { UserId } from '@/kernel/ids';
import { Skeleton } from '@/shared/ui/skeleton';
import { Mail, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ProfilePageClient({ userId }: { userId: UserId }) {
  const [user, setUser] = useState<UserEntity | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { user: fetchedUser, errorMessage } = await userRepository.getUser(
        userId
      );
      if (fetchedUser) {
        setUser(fetchedUser);
      } else if (errorMessage) {
        console.error(errorMessage);
      }
      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  return (
    <div className="max-w-2xl mx-auto p-4 py-8">
      <div className="bg-auxiliary rounded-xl p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold ">Profile</h1>
          <p className="mt-2">Your profile information</p>
        </div>

        <Avatar
          userAvatar={user?.avatar_url}
          isLoading={isLoading}
          userId={userId}
        />

        <div className="space-y-6">
          <Field
            label="Full Name"
            placeHolder={user?.username}
            icon={<User className="w-4 h-4" />}
            isLoading={isLoading}
          />
          <Field
            label="Email Address"
            placeHolder={user?.email}
            icon={<Mail className="w-4 h-4" />}
            isLoading={isLoading}
          />
        </div>

        <AccountInfo created_at={user?.created_at?.split('T')[0]} />
      </div>
    </div>
  );
}

function Field({
  label,
  placeHolder,
  icon,
  isLoading,
}: {
  label: string;
  placeHolder: string | undefined;
  icon: React.ReactNode;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-sm text-zinc-400 flex items-center gap-2">
        {icon}
        {label}
      </div>
      {isLoading ? (
        <Skeleton className="px-4 py-2.5 rounded-lg border border-white/80">
          <p className="opacity-0">placeHolder</p>
        </Skeleton>
      ) : (
        <p className="px-4 py-2.5 bg-darker rounded-lg border border-white/80">
          {placeHolder}
        </p>
      )}
    </div>
  );
}

function AccountInfo({ created_at }: { created_at: string | undefined }) {
  return (
    <div className="mt-6 bg-auxiliary rounded-xl p-6">
      <h2 className="text-lg font-medium  mb-4">Account Information</h2>
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between py-2 border-b border-zinc-700">
          <span>Member Since</span>
          <span>{created_at}</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span>Account Status</span>
          <span className="text-green-500">Active</span>
        </div>
      </div>
    </div>
  );
}
