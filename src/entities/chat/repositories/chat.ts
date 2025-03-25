import { UserEntity } from "@/entities/user/server";
import { UserId } from "@/kernel/ids";
import axios from "axios";
import { toast } from "react-toastify";

async function fetchUsers(loggedInUserId: UserId): Promise<UserEntity[]> {
  try {
    const response = await axios.get(
      `http://localhost:8000/chat/users/${loggedInUserId}`,
    );
    if (response.status === 200) {
      const users = response.data as UserEntity[];
      return users;
    }
    return [];
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error);
    toast.error("Error to update users");
    return [];
  }
}

export const chatRepository = { fetchUsers };
