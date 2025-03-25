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

  //useEffect for getting session and connect to socket

  useEffect(() => {
    const controller = new AbortController();

    const fetchSession = async () => {
      await dispatch(fetchUser());
    };

    fetchSession();

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
