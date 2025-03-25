import { Chat } from "@/widgets/chat/container/chat";

export default function HomePage() {
  return (
    <div className="h-dvh bg-base-200">
      <div className="flex items-center justify-center pt-8 px-4">
        <Chat />
      </div>
    </div>
  );
}
