import React, { useEffect, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import {store, persistor} from './src/redux/configureStore';
import { PersistGate } from 'redux-persist/integration/react';
import Storage from "./src/services/storage";
import Login from "./src/pages/Login";
import Dashboard from "./src/pages/Dashboard";
import RegisterFarmer from "./src/pages/RegisterFarmer";
import NewFarmerDebit from "./src/pages/NewFarmerDebit";
import CardRecharge from "./src/pages/CardRecharge";
import FarmerOrders from "./src/pages/FarmerOrders";
import Listings from "./src/pages/Listings";
import { AuthContext } from "./src/context/AuthContext";

if(__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}

const Stack = createNativeStackNavigator();

function App () {
  const [ user, setUser ] = useState(null);

  useEffect(() => {
    //check for already logged user
    (async function getSavedUser() {
      const loggedInAlready = await Storage.getLoggedInUser();
      if (loggedInAlready) {
        setUser(loggedInAlready);
      }
    })();
    
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthContext.Provider value={{user, setUser}}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{
                                headerShown: false
                                              }}>
                {!user ? (
                  <>
                    <Stack.Screen name="Login" component={ Login } />
                  </>
                ) : 
                (
                  <>
                    <Stack.Screen name="Dashboard" component={ Dashboard } />
                    <Stack.Screen name="RegisterFarmer" component={ RegisterFarmer } options={{
                                  headerShown: true, 
                                  headerTitle:"Register Farmer"
                                                }} />

                    <Stack.Screen name="FarmerOrders" component={ FarmerOrders } options={{
                                  headerShown: true, 
                                  headerTitle:"Farmer Order"
                                                }} />
                    <Stack.Screen name="NewFarmerDebit" component={ NewFarmerDebit } options={{
                                  headerShown: true, 
                                  headerTitle:"New Farmer Debit"
                                                }} />
                    <Stack.Screen name="CardRecharge" component={ CardRecharge } options={{
                                  headerShown: true, 
                                  headerTitle:"Card Recharge"
                                                }}/>
                    <Stack.Screen name="Listings" component={ Listings } />
                  </>
                )                            
                }
                
              </Stack.Navigator>
          </NavigationContainer>
        </AuthContext.Provider>
      </PersistGate>
    </Provider>
  ); 
}

export default App;