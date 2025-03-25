"use client";
import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { updateProfile } from "@/store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";

export function Avatar() {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const { user, isUpdatingProfile } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result as string;
      setSelectedImg(base64Image);
      await dispatch(updateProfile(base64Image));
    };
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {isUpdatingProfile ? (
          <div className="skeleton size-32 rounded-full object-cover border-4 border-white/80"></div>
        ) : (
          <Image
            src={selectedImg || user?.avatar_url || "/avatar.png"}
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
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
        >
          <Camera className="w-5 h-5 text-base-200" />
          <input
            type="file"
            id="avatar-upload"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUpdatingProfile}
          />
        </label>
      </div>
      <p className="text-sm text-zinc-400">
        {isUpdatingProfile
          ? "Uploading..."
          : "Click the camera icon to update your photo"}
      </p>
    </div>
  );
}
