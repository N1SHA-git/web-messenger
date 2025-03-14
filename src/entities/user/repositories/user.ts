import axios from 'axios';
import { UserEntity } from '../domain';
import { UserId } from '@/kernel/ids';
import { toast } from 'react-toastify';

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

async function loginUser(
  email: string,
  password: string
): Promise<{ user?: UserEntity; errorMessage?: string }> {
  try {
    const response = await axios.post('http://localhost:8000/login', {
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

async function getUser(
  id: UserId
): Promise<{ user?: UserEntity; errorMessage?: string }> {
  try {
    const response = await axios.get(`http://localhost:8000/users/${id}`);

    if (response.status === 200) {
      const user = response.data as UserEntity;
      return { user };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data.detail;
      return { errorMessage };
    } else {
      console.error('Error during getUser:', error);
      throw error;
    }
  }
  return { errorMessage: 'Unexpected error occurred in getUser' };
}


const updateAvatar = async (userId: UserId, base64Image:string) => {
  try {
    const response = await axios.put(`http://localhost:8000/update_avatar/${userId}`, {
      profilePic: base64Image
    });
    console.log('Avatar updated successfully:', response.data);
    toast.success('Avatar updated successfully')
    return response.data;
  } catch (error) {
    console.error('Error updating avatar:', error);
    toast.error('Error in update profile')
    throw error;
  }
};


export const userRepository = { saveUser, loginUser, getUser, updateAvatar };
