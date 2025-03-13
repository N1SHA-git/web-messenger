'use client';

import { AuthFormLayout } from '../ui/auth-form-layout';
import { AuthFields } from '../ui/fields';
import { SubmitButton } from '../ui/submit-button';
import { BottomLink } from '../ui/link';
import { SignUpFormState, signUpAction } from '../actions/sign-up';
import { routes } from '@/kernel/routes';
import { useActionState } from 'react';

export function SignUpForm() {
  const [formState, action, isPending] = useActionState(
    signUpAction,
    {} as SignUpFormState
  );

  return (
    <AuthFormLayout
      title="Sign Up"
      description="Create your account to get started"
      action={action}
      fields={<AuthFields {...formState} isSingUp />}
      actions={<SubmitButton isPending={isPending}>Sign Up</SubmitButton>}
      link={
        <BottomLink
          text="Already have an account?"
          linkText="Sign in"
          url={routes.signIn()}
        />
      }
    />
  );
}
