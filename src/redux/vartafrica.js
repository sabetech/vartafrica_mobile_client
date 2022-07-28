import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import { appStates, storageKeys } from '../constants';
import { 
  getDashboardValues, 
  registerFarmer, 
  getFarmersByAgent, 
  saveOrderByAgentAPI, 
  getOrdersByAgent, 
  saveFarmerDebitAPI,
  rechargeAPI,
  getListOfDeductions,
  getUsedCardsByAgent,
  getListOfvariety,
  getListOfCrops
} from '../services/api'
import Storage from '../services/storage';
import { uuidv4 } from '../utils';

export const downloadAppDataToStorage = createAsyncThunk('app/fetchAllRemoteData', async (token, { rejectWithValue} ) => {
  
  try{
    const dashboardVals = await fetchDashboardValuesFromServer(token);
    const farmers = await fetchFarmersFromServer(token);
    const orders = await fetchOrdersFromServer(token);
    const cards = await fetchCardsUsedFromServer(token);
    const deductions = await fetchDeductionListFromServer(token);
    const crops = await fetchCropsFromServer(token);
    const varieties = await fetchVarietyFromServer(token);

    const [
      dashboard_result,
      farmer_result,
      order_result,
      card_result,
      deduction_result,
      crop_result,
      varieties_result
    ] = await Promise.all([dashboardVals, farmers, orders, cards, deductions, crops, varieties]);
    
    const initialData = {
      dashboard_result,
      farmer_result,
      order_result,
      card_result,
      deduction_result,
      crop_result,
      varieties_result
    };

    return initialData;

  } catch (err){

    return rejectWithValue(err.message());

  }
});

const fetchDashboardValuesFromServer = async (token) => {
  
  try{
    const response = await getDashboardValues(token);
    if (response.success) {
      const { data } = response;
      Storage.saveData(storageKeys.DASHBOARD_VALUES, data);
      
      return data;
    }    
  }catch (err) {
    throw new Error(err.message());
  }
}

const fetchFarmersFromServer = async (token) => {
  
  try{
    const response = await getFarmersByAgent(token);
    if (response.success) {
      const { data } = response;
      Storage.saveData(storageKeys.FARMERS, data);
      return data;
    }    
  }catch (err) {
    console.log("Is ther a problem?", err.message())
    throw new Error(err.message());
  }
}

const fetchOrdersFromServer = async (token) => {
  try {
    const response = await getOrdersByAgent(token);
    if (response.success) {
      const { data } = response;
      Storage.saveData(storageKeys.ORDERS, data);
      return data;
    }
  } catch ( err ) {
    return err.message;
  }
}

const fetchCardsUsedFromServer = async (token) => {
  try {
    const response = await getUsedCardsByAgent(token);
    if (response.success) {
      const { data } = response;
      Storage.saveData(storageKeys.CARDS_USED, data);
      return data;
    }
  } catch ( err ) {
    return err.message;
  }
}

const fetchDeductionListFromServer = async (token) => {
  try {
    const response = await getListOfDeductions(token);
    if (response.success) {
      const { data } = response;
      Storage.saveData(storageKeys.DEDUCTION_LIST, data);
      return data;
    }
  } catch ( err ) {
    throw new Error( err.message );
  }
}

const fetchCropsFromServer = async (token) => {
  try {
    
    const response = await getListOfCrops(token);
    Storage.saveData(storageKeys.CROPS, response);
    return response;

  } catch ( err ){
    throw new Error( err.message );
  }
}

const fetchVarietyFromServer = async (token) => {
  try {
    
    const response = await getListOfvariety(token);
    Storage.saveData(storageKeys.VARIETIES, response);
    return response

  } catch ( err ) {
    throw new Error( err.message );
  }
}

export const registerFarmerThunk = createAsyncThunk('farmer/register', async ({ newFarmer, token }) => {
  try {
    const requestInfo = {
      url: 'registerfarmer',
      method: 'POST',
      body: JSON.stringify(newFarmer),
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      message: 'Farmer has been registered Successfully!',
      synced: false
    }
    const response = await Storage.saveData( storageKeys.FARMERS, { newFarmer, token, requestInfo } );
    
    if (response.success) {
      const { message } = response;
      return {
        message, 
        newFarmer: {
          id: uuidv4(),
          name: newFarmer.first_name,
          last_name: newFarmer.last_name,
          contact: newFarmer.mobileNumber
        }
      };
    }

  }catch ( err ) {
    return err.message;
  }
}); 

// export const getAllFarmersByAgent = createAsyncThunk('farmer/list', async (token) => {
//   try {
//     const response = await getFarmersByAgent(token);
    
//     if (response.data.success) {
//       const { data } = response.data;
      
//       return data;
//     }

//   } catch ( err ) {
//     return err.message;
//   }
// });

// export const getAllOrdersByAgent = createAsyncThunk('agent/orders', async ( token ) => {
//   try {
//     const response = await getOrdersByAgent(token);
//     if (response.success) {
//       const { data } = response;
//       return data;
//     }

//   } catch ( err ) {
//     return err.message;
//   }
// });

export const saveOrderByAgent = createAsyncThunk('agent/orders/save', async ( {order, ui_info, token} ) => {
  try {
    const requestInfo = {
      url: 'register',
      method: 'POST',
      body: JSON.stringify(order),
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      message: 'Order has been saved successfully',
      synced: false
    }
    const response = await Storage.saveData( storageKeys.ORDERS, { order, token, requestInfo } );
    
    if (response.success) {
      const { message } = response;
      return {
        message, 
        order: {
          id: uuidv4(),
          name: ui_info[0].ui_farmer.name,
          variety: ui_info[0].variety,
          quantity_ordered: ui_info[0].quantity_ordered,
          net_order_value: null,
          synced: false
        }
      };
    }

  }catch ( err ) {
    return err.message;
  }
});
  
//   try{
//       const response = await saveOrderByAgentAPI(order, token);
//       if (response.success) {
//         const { message } = response;
//         return message;
//       }
//     }catch( err ){
//       console.log(err.message);
//       return err.message;
//     }
// });

// export const getAllFarmerDebits = createAsyncThunk('agent/orders', async ( token ) => {
//   try {
//     const response = await getOrdersByAgent(token);
//     if (response.success) {
//       const { data } = response;
//       return data;
//     }

//   } catch ( err ) {
//     return err.message;
//   }
// });

export const saveFarmerDebit = createAsyncThunk('agent/debit/save', async ( { debit, token} ) => {
  
  try{
    const response = await saveFarmerDebitAPI(debit, token);
    return response;
  }catch( err ){
    console.log(err.message);
    return err.message;
  }
});

export const recharge = createAsyncThunk('agent/farmer/recharge', async ( { rechargeInfo, token}, { rejectWithValue } ) => {
  
  try{
    const response = await rechargeAPI(rechargeInfo, token);
    return response;
  }catch( err ){
    console.log(err.message);
    return rejectWithValue(err.message);
  }
});

export const cardsUsed = createAsyncThunk('agent/farmer/cardsused', async ( token, { rejectWithValue } ) => {
  
  try{
    const response = await getUsedCardsByAgent( token );
    
    if (response.success) {
      const { data } = response;
      return data
    }
    
  }catch( err ){
    
    return rejectWithValue(err.message);
  }
});

export const deductionlist = createAsyncThunk('agent/debit/list', async ( token ) => {
  
  try{
    const response = await getListOfDeductions(token);
    return response.data;
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
        cardsUsed: [],
        deductions: [],
        crops: [],
        varieties: [],
        status: 'app-not-ready',
        success: false,
        success_msg: '',
        error: null,
    },
    reducers: {
        // setIdle: (state) => {
        //     state.status = 'idle';
        //   }
    },
    extraReducers(builder) {
        builder
        .addCase(downloadAppDataToStorage.pending, (state) => {
          state.status = appStates.LOADING
        })
        .addCase(downloadAppDataToStorage.fulfilled, (state, action) => {
          
          state.dashboard_values = action.payload.dashboard_result;
          state.registeredFarmers = action.payload.farmer_result;
          state.farmerOrders = action.payload.order_result;
          state.cardsUsed = action.payload.card_result;
          state.deductions = action.payload.deduction_result;
          state.crops = action.payload.crop_result;
          state.varieties = action.payload.varieties_result;
          
          state.status = appStates.APP_READY;
        })
        .addCase(downloadAppDataToStorage.rejected, (state) => {
          state.status = appStates.FAILED
        })
        // .addCase(fetchDashboardValues.pending, (state) => {
        //     state.status = 'loading';
        //   })
        // .addCase(fetchDashboardValues.fulfilled, (state, action) => {
        //     state.status = 'dashboard-values-succeeded';
        //     state.dashboard_values = action.payload;
        // })
        // .addCase(fetchDashboardValues.rejected, (state, action) => {
        //     state.status = 'failed';
        //     state.error = action.error.message;
        // })
        .addCase(registerFarmerThunk.pending, (state) => {
          state.status = appStates.LOADING;
        })
        .addCase(registerFarmerThunk.fulfilled, (state, action) => {
          
          state.success_msg = action.payload.message;
          state.registeredFarmers =  [...state.registeredFarmers, action.payload.newFarmer];
          state.dashboard_values.farmer_count = state.registeredFarmers.length;

          state.status = appStates.FARMER_SAVED;
        })
        .addCase(registerFarmerThunk.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        // .addCase(getAllFarmersByAgent.pending, (state) => {
        //   state.status = 'loading';
        // })
        // .addCase(getAllFarmersByAgent.fulfilled, (state, action) => {
        //   state.status = 'listings-success';
        //   state.registeredFarmers = action.payload;
        // })
        // .addCase(getAllFarmersByAgent.rejected, (state, action) => {
        //   state.status = 'failed';
        //   state.error = action.error.message;
        // })
        .addCase(saveOrderByAgent.pending, (state) => {
          state.status = 'saving-order';
        })
        .addCase(saveOrderByAgent.fulfilled, (state, action) => {
          state.status = 'order-saved-success';
          state.success_msg = action.payload.message;
          state.farmerOrders = [...state.farmerOrders, action.payload.order]
        })
        .addCase(saveOrderByAgent.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        // .addCase(getAllOrdersByAgent.pending, (state) => {
        //   state.status = 'loading';
        // })
        // .addCase(getAllOrdersByAgent.fulfilled, (state, action) => {
        //   state.status = 'listings-success';
        //   state.farmerOrders = action.payload;
        // })
        // .addCase(getAllOrdersByAgent.rejected, (state, action) => {
        //   state.status = 'failed';
        //   state.error = action.error.message;
        // })
        .addCase(saveFarmerDebit.pending, (state) => {
          state.status = 'saving-debit';
        })
        .addCase(saveFarmerDebit.fulfilled, (state, action) => {
          state.status = 'farmer-debit-success';
          state.success_msg = action.payload.message;
          state.success = action.payload.success;
        })
        .addCase(saveFarmerDebit.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(recharge.pending, (state) => {
          state.status = 'saving-recharge';
        })
        .addCase(recharge.fulfilled, (state, action) => {
          state.status = 'farmer-recharge-success';
          state.success_msg = action.payload.message;
          state.success = action.payload.success;
        })
        .addCase(recharge.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(cardsUsed.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(cardsUsed.fulfilled, (state, action) => {
          state.status = 'listings-success';
          state.cardsUsed = action.payload;
        })
        .addCase(cardsUsed.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(deductionlist.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(deductionlist.fulfilled, (state, action) => {
          state.status = 'listings-success';
          state.deductions = action.payload;
        })
        .addCase(deductionlist.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
    }
  });

  export const { setIdle } = varfAfricaSlice.actions;
  export const getAllDashboardValues = (state) => state.vartafrica.dashboard_values;
  export const getAllRegisteredFarmers = (state) => state.vartafrica.registeredFarmers;
  export const getAllFarmerOrders = (state) => state.vartafrica.farmerOrders;
  export const getAllDeductions = (state) => state.vartafrica.deductions;
  export const getAllCardsUsed = (state) => state.vartafrica.cardsUsed;
  export const getStatus = (state) => state.vartafrica.status;
  export const getError = (state) => state.vartafrica.error;
  export const getSuccess = (state) => state.vartafrica.success;
  export const getSuccessMsg = (state) => state.vartafrica.success_msg;

  export default varfAfricaSlice.reducer;