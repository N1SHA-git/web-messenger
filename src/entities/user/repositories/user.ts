import axios from "axios";
import { UserEntity } from "../domain";
import { UserId } from "@/kernel/ids";
import { toast } from "react-toastify";

async function saveUser(
  username: string,
  email: string,
  password: string,
): Promise<{ user?: UserEntity; errorMessage?: string }> {
  const user: Omit<UserEntity, "id"> = {
    username, // id gonna be added on server
    email,
    password, // password gonna be crypt on server
  };

  try {
    const response = await axios.post("http://localhost:8000/auth/save_user", user);
    if (response.status === 200) {
      const savedUser = response.data as UserEntity;
      return { user: savedUser };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // processing HTTPException from main.py
      const errorMessage = error.response.data.detail;
      return { errorMessage };
    } else {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  return { errorMessage: "Unexpected error occurred in saveUser" };
}

async function loginUser(
  email: string,
  password: string,
): Promise<{ user?: UserEntity; errorMessage?: string }> {
  try {
    const response = await axios.post("http://localhost:8000/auth/login", {
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
      console.error("Error during sign-in:", error);
      throw error;
    }
  }
  return { errorMessage: "Unexpected error occurred in getUser" };
}

async function getUser(
  id: UserId,
): Promise<{ user?: UserEntity; errorMessage?: string }> {
  try {
    const response = await axios.get(`http://localhost:8000/auth/check/${id}`);

    if (response.status === 200) {
      const user = response.data as UserEntity;
      return { user };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data.detail;
      return { errorMessage };
    } else {
      console.error("Error during getUser:", error);
      throw error;
    }
  }
  return { errorMessage: "Unexpected error occurred in getUser" };
}

const updateAvatar = async (userId: UserId, base64Image: string) => {
  try {
    const response = await axios.put(
      `http://localhost:8000/auth/update_avatar/${userId}`,
      {
        profilePic: base64Image,
      },
    );
    console.log("Avatar updated successfully:", response.data);
    toast.success("Avatar updated successfully");
    return response.data;
  } catch (error) {
    console.error("Error updating avatar:", error);
    toast.error("Error in update profile");
    throw error;
  }
};

export const userRepository = { saveUser, loginUser, getUser, updateAvatar };
