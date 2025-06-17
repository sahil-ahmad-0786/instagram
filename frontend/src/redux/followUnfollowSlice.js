import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for follow/unfollow user
export const toggleFollowUser = createAsyncThunk(
  "follow/toggleFollowUser",
  async (targetUserId, { getState, rejectWithValue }) => {
    try {
      const res = await axios.post(
        `https://instagram-5-u9yd.onrender.com/api/v1/user/followorunfollow/${targetUserId}`,
        {},
        { withCredentials: true }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

const followUnfollowSlice = createSlice({
  name: "follow",
  initialState: {
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearFollowMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleFollowUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFollowUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message; // assuming backend sends message
      })
      .addCase(toggleFollowUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFollowMessage } = followUnfollowSlice.actions;
export default followUnfollowSlice.reducer;
