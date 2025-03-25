import { Settings, User } from "lucide-react";
import { routes } from "@/kernel/routes";
import { Logo, LogoutButton, NavLink } from "../ui";

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
