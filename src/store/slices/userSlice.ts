import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { UserEntity } from "@/entities/user/server";
import { userRepository } from "@/entities/user/repositories/user";
import { UserId } from "@/kernel/ids";

type UserState = {
  user: UserEntity | null;
  isInitialized: boolean;
  isUpdatingProfile: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  isInitialized: false,
  isUpdatingProfile: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: () => initialState,
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
        state.error = action.payload || "Error fetching user";
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

// Async thunk for get user by userId
export const fetchUser = createAsyncThunk<
  UserEntity,
  UserId,
  { rejectValue: string }
>("user/fetchUser", async (userId, thunkAPI) => {
  try {
    const { user: fetchedUser, errorMessage } =
      await userRepository.getUser(userId);
    if (fetchedUser) return fetchedUser;
    return thunkAPI.rejectWithValue(errorMessage ?? "Failed to fetch user");
  } catch (error) {
    console.error(error);
    return thunkAPI.rejectWithValue("Unexpected error occurred");
  }
});

export const updateProfile = createAsyncThunk<
  UserEntity,
  { userId: UserId; base64Image: string },
  { rejectValue: string }
>("user/updateProfile", async ({ userId, base64Image }, thunkAPI) => {
  try {
    await userRepository.updateAvatar(userId, base64Image);
    const { user: updatedUser, errorMessage } =
      await userRepository.getUser(userId);
    if (updatedUser) return updatedUser;
    return thunkAPI.rejectWithValue(errorMessage ?? "Failed to update profile");
  } catch (error) {
    console.error(error);
    return thunkAPI.rejectWithValue("Unexpected error occurred");
  }
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
