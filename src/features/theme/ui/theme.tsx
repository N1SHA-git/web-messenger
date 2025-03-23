"use client";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { THEMES } from "@/shared/constans";
import { setTheme } from "@/store/slices/themeSlice";

export function Theme() {
  return (
    <>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Theme</h2>
        <p className="text-sm text-base-content/70">
          Choose a theme for your chat interface
        </p>
      </div>

      <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {THEMES.map((t) => (
          <ThemePreview key={t} theme={t} />
        ))}
      </div>
    </>
  );
}

function ThemePreview({ theme }: { theme: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const globalTheme = useSelector((state: RootState) => state.theme.theme);
  return (
    <button
      className={`
        group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
        ${globalTheme === theme ? "bg-base-200" : "hover:bg-base-200/50"}
      `}
      onClick={() => dispatch(setTheme(theme))}
    >
      <div
        className="relative h-8 w-full rounded-md overflow-hidden"
        data-theme={theme}
      >
        <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
          <div className="rounded bg-primary"></div>
          <div className="rounded bg-secondary"></div>
          <div className="rounded bg-accent"></div>
          <div className="rounded bg-neutral"></div>
        </div>
      </div>

      <span className="text-[11px] font-medium truncate w-full text-center">
        {theme.charAt(0).toUpperCase() + theme.slice(1)}
      </span>
    </button>
  );
}
