import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import React, { useId } from 'react';

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
  const username = useId();
  const emailId = useId();
  const passwordId = useId();
  return (
    <>
      {isSingUp && (
        <div className="space-y-2">
          <Label htmlFor={username}>Username</Label>
          <Input
            id={username}
            type="username"
            name="username"
            placeholder="Enter your username"
            required
            defaultValue={formData?.get('username')?.toString()}
          />
          {errors?.username && <p className='text-red-500 text-xs'>{errors.username}</p>}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor={emailId}>Email</Label>
        <Input
          id={emailId}
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          defaultValue={formData?.get('email')?.toString()}
        />
        {errors?.email && <p className='text-red-500 text-xs'>{errors.email}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor={passwordId}>Password</Label>
        <Input
          id={passwordId}
          type="password"
          name="password"
          placeholder="Enter your password"
          required
          defaultValue={formData?.get('password')?.toString()}
        />
        {errors?.password && <p className='text-red-500 text-xs'>{errors.password}</p>}
      </div>
    </>
  );
}
