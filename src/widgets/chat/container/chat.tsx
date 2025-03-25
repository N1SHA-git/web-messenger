'use client'
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ChatContainer, NoChatSelected, Sidebar } from "@/entities/chat/ui";

export function Chat() {
  const { selectedUser } = useSelector((state: RootState) => state.chat);
  return (
    <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
      <div className="flex h-full rounded-lg overflow-hidden">
        <Sidebar />

        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
      </div>
    </div>
  );
}
