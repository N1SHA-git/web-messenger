import { userRepository } from '../repositories/user';

export async function createUser(
  username: string,
  email: string,
  password: string
) {
  const { user, errorMessage } = await userRepository.saveUser(username, email, password);

  if (errorMessage) {
    return { userId: undefined, errorMessage };
  }

  if (!user) {
    return { userId: undefined, errorMessage: 'Failed to save user' };
  }

  // if success to save user
  return { userId: user.id, errorMessage: undefined };


}
