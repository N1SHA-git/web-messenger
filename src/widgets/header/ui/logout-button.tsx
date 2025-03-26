"use client";
import { logoutAction } from "@/features/auth/actions/logout";
import { logout } from "@/store/slices/userSlice";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";

export function LogoutButton() {
  const dispatch = useDispatch();
  return (
    <button
      className="flex gap-2 hover:text-red-500 transition-colors items-center"
      onClick={() => {
        dispatch(logout());
        logoutAction();
      }}
    >
      <LogOut className="size-5" />
      <span className="hidden sm:inline">Logout</span>
    </button>
  );
}
