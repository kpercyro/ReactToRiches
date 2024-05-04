import {configureStore} from '@reduxjs/toolkit';
import accountReducer from './accountSlice';

const storedState = localStorage.getItem('accountState')
  ? JSON.parse(localStorage.getItem('accountState'))
  : {};

const store = configureStore({
  reducer: {
    account: accountReducer,
  },
  preloadedState: storedState,
});

store.subscribe(() => {
  localStorage.setItem('accountState', JSON.stringify(store.getState()));
});

export default store;
