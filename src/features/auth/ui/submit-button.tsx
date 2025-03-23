import React from "react";

export function SubmitButton({
  children,
  isPending,
}: {
  children: React.ReactNode;
  isPending?: boolean;
}) {
  return (
    <button
      disabled={isPending}
      type="submit"
      className="btn btn-primary w-full !mt-10"
    >
      {children}
    </button>
  );
}
