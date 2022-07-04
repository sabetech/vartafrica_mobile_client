import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getDashboardValues, 
  registerFarmer, 
  getFarmersByAgent, 
  saveOrderByAgentAPI, 
  getOrdersByAgent, 
  saveFarmerDebitAPI } from '../services/api'

export const fetchDashboardValues = createAsyncThunk('dashboard/fetchdata', async (token) => {
    try {
      const response = await getDashboardValues(token);
      console.log("dashboard values:" , response.data)
      if (response.success) {
        const { data } = response;
        
        return data;
      }
      
    } catch (err) {
        console.log(err.message()); //fetch from async storage then 
      return err.message();
    }
});

export const registerFarmerThunk = createAsyncThunk('farmer/register', async ({ newFarmer, token }) => {
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

export const getAllFarmersByAgent = createAsyncThunk('farmer/list', async (token) => {
  try {
    const response = await getFarmersByAgent(token);
    
    if (response.data.success) {
      const { data } = response.data;
      
      return data;
    }

  } catch ( err ) {
    return err.message;
  }
});

export const getAllOrdersByAgent = createAsyncThunk('agent/orders', async ( token ) => {
  try {
    console.log(token);
    const response = await getOrdersByAgent(token);
    console.log("ORDERS:", response);
    if (response.success) {
      const { data } = response;
      return data;
    }

  } catch ( err ) {
    return err.message;
  }
});

export const saveOrderByAgent = createAsyncThunk('agent/orders/save', async ( {order, token} ) => {
  try{
      const response = await saveOrderByAgentAPI(order, token);
      if (response.success) {
        const { message } = response;
        return message;
      }
    }catch( err ){
      console.log(err.message);
      return err.message;
    }
});

export const saveFarmerDebit = createAsyncThunk('agent/debit/save', async ( { debit, token} ) => {
  console.log("Dedib",debit);
  try{
    const response = await saveFarmerDebitAPI(debit, token);
    return response;
  }catch( err ){
    console.log(err.message);
    return err.message;
  }
});

  export const varfAfricaSlice = createSlice({
    name: 'vart_africa_slice',
    initialState: {
        dashboard_values: {},
        registeredFarmers: [],
        farmerOrders: [],
        status: 'idle',
        success: false,
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
        })
        .addCase(getAllFarmersByAgent.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(getAllFarmersByAgent.fulfilled, (state, action) => {
          state.status = 'listings-success';
          state.registeredFarmers = action.payload;
        })
        .addCase(getAllFarmersByAgent.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(saveOrderByAgent.pending, (state) => {
          state.status = 'saving-order';
        })
        .addCase(saveOrderByAgent.fulfilled, (state, action) => {
          state.status = 'order-saved-success';
          state.success_msg = action.payload.message;
        })
        .addCase(saveOrderByAgent.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(getAllOrdersByAgent.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(getAllOrdersByAgent.fulfilled, (state, action) => {
          state.status = 'listings-success';
          state.farmerOrders = action.payload;
        })
        .addCase(getAllOrdersByAgent.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(saveFarmerDebit.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(saveFarmerDebit.fulfilled, (state, action) => {
          state.status = 'farmer-debit-success';
          state.success_msg = action.payload.message;
          state.success = action.payload.success;
        })
        .addCase(saveFarmerDebit.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
    }
  });

  export const { setIdle } = varfAfricaSlice.actions;
  export const getAllDashboardValues = (state) => state.vartafrica.dashboard_values;
  export const getAllRegisteredFarmers = (state) => state.vartafrica.registeredFarmers;
  export const getAllFarmerOrders = (state) => state.vartafrica.farmerOrders;
  export const getStatus = (state) => state.vartafrica.status;
  export const getError = (state) => state.vartafrica.error;
  export const getSuccess = (state) => state.vartafrica.success;
  export const getSuccessMsg = (state) => state.vartafrica.success_msg;

  export default varfAfricaSlice.reducer;