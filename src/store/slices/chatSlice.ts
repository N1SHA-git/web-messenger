import { get_messages } from "@/entities/message/services/get-messages";
import { getUsersForSidebar } from "@/entities/chat/server";
import { MessageEntity } from "@/entities/message/server";
import { UserEntity } from "@/entities/user/server";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageData } from "@/entities/message/domain";
import { send_message } from "@/entities/message/services/send-message";
import { RootState } from "../store";

type ChatState = {
  messages: MessageEntity[];
  users: UserEntity[];
  selectedUser: UserEntity | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  error: string | null;
};

const initialState: ChatState = {
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<UserEntity | null>) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isUsersLoading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isUsersLoading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isUsersLoading = false;
        state.error = action.payload || "Failed to load users";
      })
      .addCase(getMessages.pending, (state) => {
        state.isMessagesLoading = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isMessagesLoading = false;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isMessagesLoading = false;
        state.error = action.payload || "Failed to load messages";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages = [...state.messages, action.payload];
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload || "Failed to load messages";
      });
  },
});

export const getUsers = createAsyncThunk<
  UserEntity[], // type of return data
  void,
  { state: RootState; rejectValue: string } // type of error
>("chat/getUsers", async (_, thunkAPI) => {
  const userId = thunkAPI.getState().user.user?.id;
  if (!userId) {
    return thunkAPI.rejectWithValue("user ID is missing");
  }
  try {
    const users = await getUsersForSidebar(userId);
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return thunkAPI.rejectWithValue("Failed to fetch users");
  }
});

export const getMessages = createAsyncThunk<
  MessageEntity[],
  void,
  { state: RootState; rejectValue: string }
>("chat/getMessages", async (_, thunkAPI) => {
  const { chat, user } = thunkAPI.getState();
  const receiver_id = chat.selectedUser?.id;
  const my_id = user.user?.id;

  if (!receiver_id || !my_id) {
    return thunkAPI.rejectWithValue("Receiver or sender ID is missing");
  }
  try {
    const messages = await get_messages(receiver_id, my_id);
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return thunkAPI.rejectWithValue("Failed to fetch messages");
  }
});

export const sendMessage = createAsyncThunk<
  MessageEntity,
  MessageData,
  { state: RootState; rejectValue: string }
>("chat/sendMessage", async (messageData, thunkAPI) => {
  const { chat, user } = thunkAPI.getState();
  const receiver_id = chat.selectedUser?.id;
  const sender_id = user.user?.id;

  if (!receiver_id || !sender_id) {
    return thunkAPI.rejectWithValue("Receiver or sender ID is missing");
  }

  try {
    const message = await send_message(receiver_id, messageData, sender_id);
    if (!message) {
      return thunkAPI.rejectWithValue("Message sending failed");
    }
    return message;
  } catch (error) {
    console.error("Error sending message:", error);
    return thunkAPI.rejectWithValue("Failed to send message");
  }
});

export const { setSelectedUser } = chatSlice.actions;
export default chatSlice.reducer;
