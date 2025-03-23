import { userRepository } from "../repositories/user";

export async function verifyUser(email: string, password: string) {
  const { user, errorMessage } = await userRepository.loginUser(
    email,
    password,
  );

  if (errorMessage) {
    return { userId: undefined, errorMessage };
  }

  if (!user) {
    return { userId: undefined, errorMessage: "Failed to get user" };
  }

  return { userId: user.id, errorMessage: undefined };
}
