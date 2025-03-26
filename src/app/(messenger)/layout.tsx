"use client";

import { Loader } from "@/shared/ui/loader";
import { fetchUser } from "@/store/slices/userSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Header } from "@/widgets";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Layout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialized = useSelector(
    (state: RootState) => state.user.isInitialized,
  );

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchSession = async (signal: AbortSignal) => {
      try {
        const res = await fetch("/api/session", { signal });
        if (!res.ok) throw new Error("Ошибка запроса");
        const data = await res.json();
        if (data.userId) {
          await dispatch(fetchUser(data.userId));
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Ошибка при получении сессии:", error);
        }
      }
    };

    fetchSession(signal);

    return () => controller.abort(); // Отменяем запрос при размонтировании
  }, [dispatch]);

  if (!isInitialized) return <Loader />;

  return (
    <main className="min-h-screen">
      <Header />
      {children}
    </main>
  );
}
