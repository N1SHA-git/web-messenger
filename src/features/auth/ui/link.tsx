import Link from "next/link";
import React from "react";

export function BottomLink({
  linkText,
  text,
  url,
}: {
  text: string;
  linkText: string;
  url: string;
}) {
  return (
    <p className="text-sm">
      {text}{" "}
      <Link
        href={url}
        className="link link-primary no-underline hover:underline font-medium"
      >
        {linkText}
      </Link>
    </p>
  );
}
