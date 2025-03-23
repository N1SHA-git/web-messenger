"use client";

import { Avatar } from "@/features/avatar";
import { RootState } from "@/store/store";
import { Mail, User } from "lucide-react";
import { useSelector } from "react-redux";

export default function ProfilePage() {
  const { user } = useSelector(
    (state: RootState) => state.user,
  );

  return (
    <div className="max-w-2xl mx-auto p-4 py-8">
      <div className="bg-base-300 rounded-xl p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold ">Profile</h1>
          <p className="mt-2">Your profile information</p>
        </div>

        <Avatar />

        <div className="space-y-6">
          <Field
            label="Full Name"
            placeHolder={user?.username}
            icon={<User className="w-4 h-4" />}
          />
          <Field
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

function Field({
  label,
  placeHolder,
  icon,
}: {
  label: string;
  placeHolder: string | undefined;
  icon: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-sm text-zinc-400 flex items-center gap-2">
        {icon}
        {label}
      </div>

      <p className="px-4 py-2.5 bg-base-200 rounded-lg border border-white/80">
        {placeHolder}
      </p>
    </div>
  );
}

function AccountInfo({ created_at }: { created_at: string | undefined }) {
  return (
    <div className="mt-6 bg-base-300 rounded-xl p-6">
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
