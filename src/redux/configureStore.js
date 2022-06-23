import { configureStore } from '@reduxjs/toolkit';
import vartafrica from './vartafrica';

export default configureStore({
  reducer: {
    vartafrica,
  },
});