import axios from 'axios';
import { UserEntity } from '../domain';

async function saveUser(
  username: string,
  email: string,
  password: string
): Promise<{ user?: UserEntity; errorMessage?: string }> {
  const user: Omit<UserEntity, 'id'> = {
    username, // id будет присвоен на сервере
    email,
    password, // Пароль будет хэшироваться на сервере
  };

  try {
    const response = await axios.post('http://localhost:8000/save_user', user);
    if (response.status === 200) {
      const savedUser = response.data as UserEntity;
      return { user: savedUser };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Обработка HTTPException из main.py
      const errorMessage = error.response.data.detail;
      return {errorMessage};
    } else {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  return { errorMessage: 'Unexpected error occurred in saveUser' };
}

async function getUser(
  email: string,
  password: string
): Promise<{ user?: UserEntity; errorMessage?: string }> {
  try {
    const response = await axios.post('http://localhost:8000/get_user', {
      email,
      password,
    });

    if (response.status === 200) {
      const user = response.data as UserEntity;
      return { user };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data.detail;
      return { errorMessage };
    } else {
      console.error('Error during sign-in:', error);
      throw error;
    }
  }
  return { errorMessage: 'Unexpected error occurred in getUser' };
}
export const userRepository = { saveUser, getUser };
