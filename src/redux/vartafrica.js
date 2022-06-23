import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardValues, registerFarmer } from '../services/api'

export const fetchDashboardValues = createAsyncThunk('dashboard/fetchdata', async (token) => {
    try {
      const response = await getDashboardValues(token);
      
      if (response.success) {
        const { data } = response;
        return data;
      }
      
    } catch (err) {
        console.log(err.message()); //fetch from async storage then 
      return err.message();
    }
});

export const registerFarmerThunk = createAsyncThunk('farmer/register', async ({newFarmer, token}) => {
  try {
    const response = await registerFarmer(newFarmer, token);
    
    if (response.success){
      const { message } = response;
      return message;
    }

  }catch ( err ) {
    return err.message;
  }
}); 

  export const varfAfricaSlice = createSlice({
    name: 'vart_africa_slice',
    initialState: {
        dashboard_values: {},
        registeredFarmers: [],
        status: 'idle',
        success_msg: '',
        error: null,
    },
    reducers: {
        setIdle: (state) => {
            state.status = 'idle';
          }
    },
    extraReducers(builder) {
        builder
        .addCase(fetchDashboardValues.pending, (state) => {
            state.status = 'loading';
          })
        .addCase(fetchDashboardValues.fulfilled, (state, action) => {
            state.status = 'dashboard-values-succeeded';
            state.dashboard_values = action.payload;
        })
        .addCase(fetchDashboardValues.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
        .addCase(registerFarmerThunk.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(registerFarmerThunk.fulfilled, (state, action) => {
          state.status = 'register-farmer-success';
          state.success_msg = action.payload.message;
        })
        .addCase(registerFarmerThunk.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
    }
  });

  export const { setIdle } = varfAfricaSlice.actions;
  export const getAllDashboardValues = (state) => state.vartafrica.dashboard_values;
  export const getAllRegisteredFarmers = (state) => state.vartafrica.registeredFarmers
  export const getStatus = (state) => state.vartafrica.status;
  export const getError = (state) => state.vartafrica.error;

  export default varfAfricaSlice.reducer;