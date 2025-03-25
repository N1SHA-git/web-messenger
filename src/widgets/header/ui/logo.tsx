import { routes } from "@/kernel/routes";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href={routes.home()}
      className="flex items-center gap-2.5 hover:opacity-80 transition-all"
    >
      <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <MessageSquare className="size-5 text-primary" />
      </div>
      <h1 className="text-lg font-bold">Chatty</h1>
    </Link>
  );
}
