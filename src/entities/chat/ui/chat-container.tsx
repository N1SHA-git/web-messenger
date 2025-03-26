"use client";
import { useEffect, useRef } from "react";

import { MessageInput } from "./message-input";
import { MessageSkeleton } from "./message-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { ChatHeader } from "./chat-header";
import Image from "next/image";
import { getMessages } from "@/store/slices/chatSlice";
import { formatMessageTime } from "@/shared/lib/utils";
import {
  subscribeToMessages,
  unsubscribeFromMessages,
} from "@/store/slices/chatSlice";

export function ChatContainer() {
  const { messages, isMessagesLoading, selectedUser } = useSelector(
    (state: RootState) => state.chat,
  );
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(getMessages());

    dispatch(subscribeToMessages());

    return () => {
      dispatch(unsubscribeFromMessages());
    };
  }, [dispatch, selectedUser?.id]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  if (!user?.id) return;

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat ${message.sender_id === user.id ? "chat-end" : "chat-start"}`}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <Image
                  src={
                    message.sender_id === user.id
                      ? user?.avatar_url || "/avatar.png"
                      : selectedUser?.avatar_url || "/avatar.png"
                  }
                  alt="profile pic"
                  width={40}
                  height={40}
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.created_at)}
              </time>
            </div>
            <div
              className="chat-bubble flex flex-c
            ol"
            >
              {message.image && (
                <Image
                  src={message.image}
                  alt="Attachment"
                  width={200}
                  height={200}
                  className="sm:max-w-[200px] h-auto rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
}
