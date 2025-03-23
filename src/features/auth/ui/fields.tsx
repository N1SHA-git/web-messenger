import { Lock, Mail, User } from "lucide-react";
import React, { useId } from "react";

export function AuthFields({
  errors,
  formData,
  isSingUp,
}: {
  formData?: FormData;
  errors?: {
    username?: string;
    email?: string;
    password?: string;
  };
  isSingUp?: boolean;
}) {
  const usernameId = useId();
  const emailId = useId();
  const passwordId = useId();

  return (
    <>
      {isSingUp && (
        <div>
          <div className="flex items-center pointer-events-none">
            <User className="size-4 text-base-content/40" />
            <label htmlFor={usernameId} className="label">
              <span className="label-text">Username</span>
            </label>
          </div>

          <input
            id={usernameId}
            type="text"
            name="username"
            placeholder="Enter your username"
            required
            defaultValue={formData?.get("username")?.toString()}
            className="input input-bordered w-full"
          />
          {errors?.username && (
            <p className="text-red-500 text-xs">{errors.username}</p>
          )}
        </div>
      )}
      <div>
        <div className="flex items-center pointer-events-none">
          <Mail className="size-4 text-base-content/40" />
          <label htmlFor={emailId} className="label">
            <span className="label-text">Email</span>
          </label>
        </div>

        <input
          id={emailId}
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          defaultValue={formData?.get("email")?.toString()}
          className="input input-bordered w-full"
        />
        {errors?.email && (
          <p className="text-red-500 text-xs">{errors.email}</p>
        )}
      </div>
      <div>
        <div className="flex items-center pointer-events-none">
          <Lock className="size-4 text-base-content/40" />
          <label htmlFor={passwordId} className="label">
            <span className="label-text">Password</span>
          </label>
        </div>

        <input
          id={passwordId}
          type="password"
          name="password"
          placeholder="Enter your password"
          required
          defaultValue={formData?.get("password")?.toString()}
          className="input input-bordered w-full"
        />
        {errors?.password && (
          <p className="text-red-500 text-xs">{errors.password}</p>
        )}
      </div>
    </>
  );
}
