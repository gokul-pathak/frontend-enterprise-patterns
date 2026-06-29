import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { UserProfile, UpdateProfilePayload } from '@/features/profile/types/profile.types';
import { getProfile, updateProfile } from '@/features/profile/api/profileService';
import { enqueueNotification } from './notificationsSlice';

interface ProfileState {
  data: UserProfile | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  data: null,
  isLoading: false,
  isSaving: false,
  error: null,
};

// Async Thunk for fetching the profile
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const profile = await getProfile();
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

// Async Thunk for saving the profile
export const saveProfile = createAsyncThunk(
  'profile/saveProfile',
  async (payload: UpdateProfilePayload, { dispatch, rejectWithValue }) => {
    try {
      const updatedProfile = await updateProfile(payload);
      dispatch(enqueueNotification({ message: 'Profile updated successfully.', severity: 'success' }));
      return updatedProfile;
    } catch (error: any) {
      dispatch(enqueueNotification({ message: 'Failed to save profile changes.', severity: 'error' }));
      return rejectWithValue(error.message || 'Failed to save profile');
    }
  }
);

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // We can add synchronous reducers here if needed
    clearProfile: (state) => {
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    // fetchProfile cases
    builder.addCase(fetchProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // saveProfile cases
    builder.addCase(saveProfile.pending, (state) => {
      state.isSaving = true;
      state.error = null;
    });
    builder.addCase(saveProfile.fulfilled, (state, action) => {
      state.isSaving = false;
      state.data = action.payload; // Update the store with the fresh profile
    });
    builder.addCase(saveProfile.rejected, (state, action) => {
      state.isSaving = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
