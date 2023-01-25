import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "Authentication",
    initialState: null,
    reducers: {
        addAuth: (state, action) => {
            state = action.payload.user;
        }
    }
})

export const {addAuth} = authSlice.actions; 
export default authSlice.reducer;