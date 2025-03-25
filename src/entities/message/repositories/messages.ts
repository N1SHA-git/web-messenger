import axios from "axios";
import { MessageData } from "../domain";
import { UserId } from "@/kernel/ids";
import { toast } from "react-toastify";

async function fetchMessages(receiver_id: UserId, my_id: UserId) {
  try {
    const { data } = await axios.get(
      `http://localhost:8000/messages/${receiver_id}?my_id=${my_id}`,
    );

    return data;
  } catch (error) {
    console.error("Error in getMessages: ", error);
    toast.error("Error to update messages");
    return [];
  }
}

async function postMessage(
  receiver_id: UserId,
  message_data: MessageData,
  sender_id: UserId,
) {
  try {
    const { data } = await axios.post(
      `http://localhost:8000/messages/send/${receiver_id}?sender_id=${sender_id}`,
      message_data,
    );
    return data;
  } catch (error) {
    console.error("Error in sendMessage: ", error);
    toast.error("Error to send messages");
    return null;
  }
}

export const messagesRepository = { fetchMessages, postMessage };
