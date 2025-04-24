import { createSlice } from "@reduxjs/toolkit";

const selctedProductSlice = createSlice({
    name: "selectedProduct",
    initialState: null,
    reducers: {
        setSelectedProduct: (state, action) => state = action.payload
    }
});

export default selctedProductSlice.reducer;
export const {setSelectedProduct} = selctedProductSlice.actions;