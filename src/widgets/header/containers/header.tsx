"use client";
import Link from "next/link";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { routes } from "@/kernel/routes";
import { logoutAction } from "@/features/auth/actions/logout";

export function Header() {
  return (
    <header className="border-b border-base-300 w-full backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <Logo />

          <nav className="flex items-center gap-3">
            <NavLink
              route={routes.settings()}
              text="Settings"
              icon={<Settings className="size-5" />}
            />

            <NavLink
              route={routes.profile()}
              text="Profile"
              icon={<User className="size-5" />}
            />

            <LogoutButton />
          </nav>
        </div>
      </div>
    </header>
  );
}

function Logo() {
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

function NavLink({
  route,
  text,
  icon,
}: {
  route: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={route} className="btn btn-sm gap-2 transition-colors">
      {icon}
      <span className="hidden sm:inline">{text}</span>
    </Link>
  );
}

function LogoutButton() {
  return (
    <button
      className="flex gap-2 hover:text-red-500 transition-colors items-center"
      onClick={() => logoutAction()}
    >
      <LogOut className="size-5" />
      <span className="hidden sm:inline">Logout</span>
    </button>
  );
}
