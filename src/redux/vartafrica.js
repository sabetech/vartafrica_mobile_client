import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import { appStates, storageKeys } from '../constants';
import { 
  getDashboardValues, 
  getFarmersByAgent, 
  getOrdersByAgent, 
  getListOfDeductions,
  getUsedCardsByAgent,
  getListOfvariety,
  getListOfCrops,
  saveFarmerDebitAPI
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
      body: newFarmer,
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      message: 'Farmer has been registered Successfully!',
      synced: false
    }
    
    const new_storage_farmer = {
      id: uuidv4(),
      name: newFarmer.first_name,
      last_name: newFarmer.last_name,
      contact: newFarmer.mobileNumber,
      username: newFarmer.username
    };

    const response = await Storage.saveFormData( storageKeys.FARMERS, { storage_data: new_storage_farmer, requestInfo } );
    
    if (response.success) {
      const { message } = response;
      return {
        message, 
        newFarmer: {
          ...new_storage_farmer
        }
      };
    }

  }catch ( err ) {
    return err.message;
  }
});

export const saveOrderByAgent = createAsyncThunk('agent/orders/save', async ( {order, ui_info, token},{ getState } ) => {
  try {
    const requestInfo = {
      url: 'register',
      method: 'POST',
      body: order,
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      message: 'Order has been saved successfully',
      synced: false
    }
      
    const curState = getState();
    const myfarmer = curState.vartafrica.registeredFarmers.find(_myfarmer => _myfarmer.contact == order.farmers);
    if (!myfarmer) 
      throw new Error("Could not find farmer");

    const new_storage_orders = [];
    for(let i = 0;i < order.variety.length;i++){

      const new_storage_order = {
        id: uuidv4(),
        name: myfarmer.name,
        variety: order.variety[i],
        quantity_ordered: order.seed_quantity[i],
        net_order_value: order.net_order_value
      };
      new_storage_orders.push(new_storage_order);
    }
    const response = await Storage.saveFormDataArray( storageKeys.ORDERS,  { storage_data: new_storage_orders, requestInfo });
    
    if (response.success) {
      const { message } = response;
      return {
        message, 
        new_orders: [
          ...new_storage_orders
        ]
      };
    }

  }catch ( err ) {
    return err.message;
  }
});

export const saveFarmerDebit = createAsyncThunk('agent/debit/save', async ( { debit, token}, { getState, rejectWithValue } ) => {
  try {
    
    const curState = getState();
    const myfarmer = curState.vartafrica.registeredFarmers.find(myfarmer => myfarmer.id == debit.user_id)
    
    const new_storage_debit = {
      id: uuidv4(),
      username: myfarmer.name,
      amount: debit.amount
    }

    const response = await saveFarmerDebitAPI(debit, token);
    if (response.success) {
      const { message } = response;
      return {
        message,
        debit: {
          ...new_storage_debit
        }
      };
    }else{
      return rejectWithValue(response.message)
    }
  }catch ( err ) {
    return rejectWithValue(err.message)
  }
});

export const recharge = createAsyncThunk('agent/farmer/recharge', async ( { rechargeInfo, token}, { getState } ) => {
  try {
    const requestInfo = {
      url: 'recharge',
      method: 'POST',
      body: rechargeInfo,
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      message: 'Recharge has been saved successfully',
      synced: false
    }

    const curState = getState();
    const myfarmer = curState.vartafrica.registeredFarmers.find(myfarmer => myfarmer.id == rechargeInfo.farmers)
    
    const new_storage_recharge = {
      id: uuidv4(),
      amount: 'x',
      serial: rechargeInfo.serial_number,
      used_by: myfarmer.name
    }
    
    const response = await Storage.saveFormData( storageKeys.RECHARGE, { storage_data: new_storage_recharge, requestInfo} );
    
    if (response.success) {
      const { message } = response;
      return {
        message, 
        recharge: {
          ...new_storage_recharge
        }
      };
    }

  }catch ( err ) {
    return err.message;
  }
});

export const syncAll = createAsyncThunk('app/syncAll', async (_, { rejectWithValue }) => {
  try{
    const response = await Storage.syncAll();
    return response;
  }catch(e){
    return rejectWithValue(e.message());
  }
});

export const syncParticularKey = createAsyncThunk('app/syncParticularKey', async (key, { rejectWithValue }) => {
  try{
    const response = await Storage.syncParticularData(key);
    return response;
  }catch(e){
    return rejectWithValue(e.message());
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
        status: appStates.APP_NOT_READY,
        sync_state: appStates.SYNCING_IDLE,
        sync_success: true,
        success: false,
        success_msg: '',
        error: null,
    },
    reducers: {
        setIdle: (state) => {
            state.status = appStates.APP_READY;
          }
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
        .addCase(saveOrderByAgent.pending, (state) => {
          state.status = 'saving-order';
        })
        .addCase(saveOrderByAgent.fulfilled, (state, action) => {
          
          state.success_msg = action.payload.message;
          
          state.farmerOrders = [...state.farmerOrders, ...action.payload.new_orders];
          state.dashboard_values.total_orders = state.farmerOrders.length;

          state.status = appStates.ORDER_SAVED;
        })
        .addCase(saveOrderByAgent.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(saveFarmerDebit.pending, (state) => {
          state.status = 'saving-debit';
        })
        .addCase(saveFarmerDebit.fulfilled, (state, action) => {
          
          state.success_msg = action.payload.message;
          state.deductions = [...state.deductions, action.payload.debit];
          state.dashboard_values.total_deductions = state.dashboard_values.total_deductions + 1 

          
          state.status = appStates.DEBIT_SAVED;
        })
        .addCase(saveFarmerDebit.rejected, (state, action) => {
          state.status = appStates.DEBIT_FAILED;
          console.log(action.error);
          console.log(action.payload);
          state.error = action.error.message;
        })
        .addCase(recharge.pending, (state) => {
          state.status = 'saving-recharge';
        })
        .addCase(recharge.fulfilled, (state, action) => {
          
          state.success_msg = action.payload.message;
          state.cardsUsed = [...state.cardsUsed, action.payload.recharge];

          state.status = appStates.RECHARGE_SAVED;

        })
        .addCase(recharge.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(syncAll.pending, (state) => {
          state.sync_state = appStates.SYNCING;
        })
        .addCase(syncAll.fulfilled, (state, action) => {
          state.sync_state = appStates.APP_READY;
          state.sync_success = action.payload.success;
        })
        .addCase(syncAll.rejected, (state, action) => {
          state.sync_state = appStates.SYNCING_ERROR;
          state.sync_success = false;
          state.error = action.error.message;
        })
        .addCase(syncParticularKey.pending, (state) => {
          state.sync_state = appStates.SYNCING;
        })
        .addCase(syncParticularKey.fulfilled, (state, action) => {
          state.sync_state = appStates.APP_READY;
          state.sync_success = action.payload.success;
        })
        .addCase(syncParticularKey.rejected, (state, action) => {
          state.sync_state = appStates.SYNCING_ERROR;
          state.sync_success = false;
          state.error = action.error.message;
        })
    }
  });

  export const { setIdle } = varfAfricaSlice.actions;
  export const getAllDashboardValues = (state) => state.vartafrica.dashboard_values;
  export const getAllRegisteredFarmers = (state) => state.vartafrica.registeredFarmers;
  export const getAllFarmerOrders = (state) => state.vartafrica.farmerOrders;
  export const getAllDeductions = (state) => state.vartafrica.deductions;
  export const getAllCardsUsed = (state) => state.vartafrica.cardsUsed;
  export const getStatus = (state) => state.vartafrica.status;
  export const getCrops = (state) => state.vartafrica.crops;
  export const getVarieties = (state) => state.vartafrica.varieties;
  export const getError = (state) => state.vartafrica.error;
  export const getSuccess = (state) => state.vartafrica.success;
  export const getSuccessMsg = (state) => state.vartafrica.success_msg;
  export const getSyncState = (state) =>state.vartafrica.sync_state;
  export const getSyncSuccess = (state) =>state.vartafrica.sync_success;

  export default varfAfricaSlice.reducer;