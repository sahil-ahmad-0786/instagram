import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggestedUsers: [],
    userProfile: null,
    selectedUser: null,
  },
  reducers: {
    // actions
    setAuthUser: (state, action) => {
      state.user = action.payload ?? null;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload ?? null;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    updateUserProfile: (state, action) => {
      state.userProfile = {
        ...state.userProfile,
        ...action.payload,
      };
    },
    updateSuggestedUsers: (state, action) => {
      const { targetUserId, isNowFollowing, currentUserId } = action.payload;
      state.suggestedUsers = state.suggestedUsers.map((user) => {
        if (user._id === targetUserId) {
          let updatedFollowers;
          if (isNowFollowing) {
            updatedFollowers = [...user.followers, currentUserId];
          } else {
            updatedFollowers = user.followers.filter(
              (id) => id !== currentUserId
            );
          }
          return { ...user, followers: updatedFollowers };
        }
        return user;
      });
    }
  },
});
export const {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
  setSelectedUser,
  updateUserProfile,
  updateSuggestedUsers
} = authSlice.actions;
export default authSlice.reducer;
