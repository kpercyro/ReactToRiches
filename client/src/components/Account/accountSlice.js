import {createSlice} from '@reduxjs/toolkit';

export const accountSlice = createSlice({
  name: 'account',
  initialState: {
    value: {},
  },
  reducers: {
    addAccount: (state, action) => {
      state.value = action.payload;
    },
    addApiKey: (state, action) => {
      state.value.api_key = action.payload;
    },
    removeAccount: state => {
      state.value = {};
    },
  },
});

export const {addAccount, addApiKey, removeAccount} = accountSlice.actions;

export default accountSlice.reducer;
