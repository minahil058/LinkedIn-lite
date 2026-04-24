import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: null, // Hard default
    },
    reducers: {
        // actions
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload || null; // Force null if payload is missing
        }
    }
});

export default authSlice.reducer;
export const { setLoading, setUser } = authSlice.actions;
