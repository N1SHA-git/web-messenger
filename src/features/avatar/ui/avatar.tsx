'use client';
import { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import { userRepository } from '@/entities/user/repositories/user';
import { Skeleton } from '@/shared/ui/skeleton';

type AvatarProps = {
  userAvatar: string | undefined;
  isLoading: boolean;
  userId: number;
};

export function Avatar({ userAvatar, isLoading, userId }: AvatarProps) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result as string;
      setSelectedImg(base64Image);
      await userRepository.updateAvatar(userId, base64Image);
    };
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {isLoading ? (
          <Skeleton className="size-32 rounded-full border-4 border-white/80" />
        ) : (
          <Image
            src={selectedImg || userAvatar || '/avatar.png'}
            alt="Profile"
            className="size-32 rounded-full object-cover border-4 border-white/80"
            width={128}
            height={128}
          />
        )}
        <label
          htmlFor="avatar-upload"
          className={`
                  absolute bottom-0 right-0
                  bg-zinc-300 hover:scale-105
                  p-2 rounded-full cursor-pointer
                  transition-all duration-200
                  ${isLoading ? 'animate-pulse pointer-events-none' : ''}
                `}
        >
          <Camera className="w-5 h-5 text-darker" />
          <input
            type="file"
            id="avatar-upload"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isLoading}
          />
        </label>
      </div>
      <p className="text-sm text-zinc-400">
        {isLoading
          ? 'Uploading...'
          : 'Click the camera icon to update your photo'}
      </p>
    </div>
  );
}
