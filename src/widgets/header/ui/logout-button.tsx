"use client";
import { logoutAction } from "@/features/auth/actions/logout";
import { LogOut } from "lucide-react";

export  function LogoutButton() {
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
