import { createSlice } from "@reduxjs/toolkit";

const updateProductSlice = createSlice({
    name: "updateProduct",
    initialState: null,
    reducers: {
        setProduct: (state, action) => state = action.payload
    }
});

export default updateProductSlice.reducer;
export const {setProduct} = updateProductSlice.actions;