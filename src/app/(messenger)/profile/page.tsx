"use client";

import { AccountInfo, ProfileField, Avatar } from "@/entities/user/ui/index";
import { RootState } from "@/store/store";
import { Mail, User } from "lucide-react";
import { useSelector } from "react-redux";

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.user);
  
  return (
    <div className="max-w-2xl mx-auto p-4 py-8">
      <div className="bg-base-300 rounded-xl p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold ">Profile</h1>
          <p className="mt-2">Your profile information</p>
        </div>

        <Avatar />

        <div className="space-y-6">
          <ProfileField
            label="Full Name"
            placeHolder={user?.username}
            icon={<User className="w-4 h-4" />}
          />
          <ProfileField
            label="Email Address"
            placeHolder={user?.email}
            icon={<Mail className="w-4 h-4" />}
          />
        </div>

        <AccountInfo created_at={user?.created_at?.split("T")[0]} />
      </div>
    </div>
  );
}
