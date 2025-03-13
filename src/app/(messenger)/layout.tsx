"use client";

import { Header } from "@/widgets/header/containers/header";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-darker">
      <Header />
      {children}
    </main>
  );
}
