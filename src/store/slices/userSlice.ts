import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { WritableDraft } from "immer";
import type { UserEntity } from "@/entities/user/server";
import { userRepository } from "@/entities/user/repositories/user";
import { UserId } from "@/kernel/ids";
import { RootState } from "../store";
import { io, Socket } from "socket.io-client";

const BASE_URL = "http://localhost:3000"; // url for socket in prod: '/'

type UserState = {
  user: UserEntity | null;
  isInitialized: boolean;
  isUpdatingProfile: boolean;
  onlineUsers: UserId[];
  error: string | null;
  socket: Socket | null;
};

const initialState: UserState = {
  user: null,
  isInitialized: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  error: null,
  socket: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: () => initialState,
    connectSocket: (state, action: PayloadAction<{ userId: UserId }>) => {
      if (state.socket?.connected) return;

      const socket = io(BASE_URL, {
        query: {
          userId: action.payload.userId,
        },
        transports: ["websocket"]
      });

      socket.on("connect", () => {
        console.log("Socket connected");
      });

      socket.on("getOnlineUsers", (userIds: UserId[]) => {
        state.onlineUsers = userIds;
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      state.socket = socket as unknown as WritableDraft<Socket | null>;
    },
    disconnectSocket: (state) => {
      if (state.socket?.connected) {
        state.socket.disconnect();
      }
      state.socket = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isInitialized = false;
        state.error = null;
      })
      .addCase(
        fetchUser.fulfilled,
        (state, action: PayloadAction<UserEntity>) => {
          state.user = action.payload;
          state.isInitialized = true;
          state.error = null;
        },
      )
      .addCase(fetchUser.rejected, (state, action) => {
        state.isInitialized = false;
        state.error = action.payload || "Failed to fetch user";
      })
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
        state.error = null;
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<UserEntity>) => {
          if (state.user) {
            state.user.avatar_url = action.payload.avatar_url;
          }
          state.isUpdatingProfile = false;
          state.error = null;
        },
      )
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdatingProfile = false;
        state.error = action.payload || "Failed to update profile";
      });
  },
});

export const fetchUser = createAsyncThunk<
  UserEntity,
  void,
  { state: RootState; rejectValue: string }
>("user/fetchUser", async (_, thunkAPI) => {
  const { user } = thunkAPI.getState();
  const userId = user.user?.id;
  if (!userId) {
    return thunkAPI.rejectWithValue("User ID is missing");
  }
  try {
    const { user: fetchedUser, errorMessage } =
      await userRepository.getUser(userId);
    if (fetchedUser) {
      return fetchedUser;
    } else {
      return thunkAPI.rejectWithValue(errorMessage || "Unknown error");
    }
  } catch (error) {
    console.error(error);
    return thunkAPI.rejectWithValue("Failed to fetch user");
  }
});

export const updateProfile = createAsyncThunk<
  UserEntity,
  string,
  { state: RootState; rejectValue: string }
>("user/updateProfile", async (base64Image, thunkAPI) => {
  const { user } = thunkAPI.getState();
  const userId = user.user?.id;
  if (!userId) {
    return thunkAPI.rejectWithValue("User ID is missing");
  }
  try {
    await userRepository.updateAvatar(userId, base64Image);
    const { user: updatedUser, errorMessage } =
      await userRepository.getUser(userId);
    if (updatedUser) {
      return updatedUser;
    } else {
      return thunkAPI.rejectWithValue(errorMessage || "Unknown error");
    }
  } catch (error) {
    console.error(error);
    return thunkAPI.rejectWithValue("Failed to update profile");
  }
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
