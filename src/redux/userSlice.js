import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    sessionCashier: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("tpv_user_data", JSON.stringify(action.payload));
    },
    getUser: (state) => {
      const user = localStorage.getItem("tpv_user_data");
      if (user) {
        state.user = JSON.parse(user);
      }
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem("tpv_user_data");
    },
    initSession: (state, action) => {
      state.sessionCashier = action.payload;
      localStorage.setItem("sessionCashier", JSON.stringify(action.payload));
    },

    refreshSession: (state) => {
      const session = localStorage.getItem("sessionCashier");
      if (session) {
        state.sessionCashier = JSON.parse(session);
      }
    },
    finishSession: (state) => {
      state.sessionCashier = null;
      localStorage.removeItem("sessionCashier");
    },
  },
});

export const {
  setUser,
  getUser,
  clearUser,
  initSession,
  refreshSession,
  finishSession,
} = userSlice.actions;
export default userSlice.reducer;
