'use server';
import { createUser, sessionService } from '@/entities/user/server';
import { routes } from '@/kernel/routes';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export type SignUpFormState = {
  formData?: FormData;
  errors?: {
    username?: string;
    email?: string;
    password?: string;
  };
};

const formDataSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'username must be at least 3 characters' })
    .trim(),
  email: z.string().email({ message: 'invalid email address' }).trim(),
  password: z
    .string()
    .min(6, { message: 'password must be at least 6 characters' })
    .regex(/[a-zA-Z]/, { message: 'contain at least one letter.' })
    .regex(/[0-9]/, { message: 'contain at least one number.' })
    .trim(),
});

export async function signUpAction(
  prevState: SignUpFormState,
  formData: FormData
) {
  const result = formDataSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!result.success) {
    const formatedErrors = result.error.format();
    return {
      formData,
      errors: {
        username: formatedErrors.username?._errors.join(', '),
        email: formatedErrors.email?._errors.join(', '),
        password: formatedErrors.password?._errors.join(', '),
      },
    };
  }

  const { username, email, password } = result.data;

  const { userId, errorMessage } = await createUser(username, email, password);

  if (errorMessage || !userId) {
    return {
      formData,
      errors: {
        email: errorMessage ?? "Failed to create user",
      },
    };
  }

  await sessionService.createSession(userId); // Создание сессии после успешного создания пользователя
  redirect(routes.home());
}
