"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { setTheme } from "@/store/slices/themeSlice";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const storedTheme = localStorage.getItem("chat-theme");
    if (storedTheme) {
      dispatch(setTheme(storedTheme));
    }
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("chat-theme", theme);
  }, [theme]);

  return <>{children}</>;
}
