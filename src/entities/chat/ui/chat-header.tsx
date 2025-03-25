"use client";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setSelectedUser } from "@/store/slices/chatSlice";
import Image from "next/image";

export function ChatHeader() {
  const { selectedUser } = useSelector((state: RootState) => state.chat);
  const { onlineUsers } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  if (!selectedUser) return;
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <Image
                src={selectedUser.avatar_url || "/avatar.png"}
                alt={selectedUser.username}
                width={40}
                height={40}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser?.username}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser.id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => dispatch(setSelectedUser(null))}>
          <X />
        </button>
      </div>
    </div>
  );
}
