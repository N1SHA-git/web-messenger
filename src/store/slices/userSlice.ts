import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { UserEntity } from "@/entities/user/server";
import { userRepository } from "@/entities/user/repositories/user";
import { UserId } from "@/kernel/ids";
import { RootState } from "../store";
import { socket, connectSocket, disconnectSocket } from "@/shared/lib/socket";

type UserState = {
  user: UserEntity | null;
  isInitialized: boolean;
  isUpdatingProfile: boolean;
  onlineUsers: UserId[];
  error: string | null;
};

const initialState: UserState = {
  user: null,
  isInitialized: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: () => {
      disconnectSocket();
      return initialState;
    },
    setOnlineUsers: (state, action: PayloadAction<UserId[]>) => {
      state.onlineUsers = action.payload;
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
  UserId,
  { state: RootState; rejectValue: string }
>("user/fetchUser", async (userId, thunkAPI) => {
  const dispatch = thunkAPI.dispatch;
  try {
    const { user: fetchedUser, errorMessage } =
      await userRepository.getUser(userId);
    if (fetchedUser) {
      connectSocket(userId);
      
      if (!socket.hasListeners("getOnlineUsers")) {
        socket.on("getOnlineUsers", (userIds) =>
          dispatch(setOnlineUsers(userIds)),
        );
      }

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

export const { logout, setOnlineUsers } = userSlice.actions;
export default userSlice.reducer;
