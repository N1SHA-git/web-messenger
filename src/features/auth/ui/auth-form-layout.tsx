import React from "react";

export function AuthFormLayout({
  actions,
  description,
  fields,
  link,
  title,
  action,
}: {
  title: string;
  description: string;
  fields: React.ReactNode;
  actions: React.ReactNode;
  link: React.ReactNode;
  action: (formData: FormData) => void;
}) {
  return (
    <div className="card w-full max-w-md bg-base-300 pb-8 mx-4">
      <div className="card-body">
        <div className="text-center mb-4">
          <h2 className="card-title justify-center text-2xl font-bold">
            {title}
          </h2>
          <p>{description}</p>
        </div>
        <form action={action} className="space-y-4">
          {fields}
          {actions}
        </form>
      </div>
      <div className="card-actions justify-center">{link}</div>
    </div>
  );
}
