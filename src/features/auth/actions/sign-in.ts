'use server';
import { sessionService } from '@/entities/user/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { routes } from '@/kernel/routes';
import { verifyUser } from '@/entities/user/server';

export type SignInFormState = {
  formData?: FormData;
  errors?: {
    email?: string;
    password?: string;
  };
};

const formDataSchema = z.object({
  email: z.string().email({ message: 'invalid email address' }).trim(),
  password: z
    .string()
    .min(6, { message: 'password must be at least 6 characters' })
    .regex(/[a-zA-Z]/, { message: 'contain at least one letter.' })
    .regex(/[0-9]/, { message: 'contain at least one number.' })
    .trim(),
});

export async function signInAction(
  prevState: SignInFormState,
  formData: FormData
): Promise<SignInFormState> {
  const result = formDataSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!result.success) {
    const formatedErrors = result.error.format();
    return {
      formData,
      errors: {
        email: formatedErrors.email?._errors.join(', '),
        password: formatedErrors.password?._errors.join(', '),
      },
    };
  }

  const { email, password } = result.data;

  const { userId, errorMessage } = await verifyUser(email, password);

  if (errorMessage || !userId) {
    return {
      formData,
      errors: {
        email: errorMessage ? errorMessage.toString() : 'Failed to verify user',
      },
    };
  }

  await sessionService.createSession(userId); // Создание сессии после успешного входа пользователя
  redirect(routes.home());
}
