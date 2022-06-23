import React, { useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import configureStore from './src/redux/configureStore';

import Login from "./src/pages/Login";
import Dashboard from "./src/pages/Dashboard";
import RegisterFarmer from "./src/pages/RegisterFarmer";
import NewFarmerDebit from "./src/pages/NewFarmerDebit";
import CardRecharge from "./src/pages/CardRecharge";
import Listings from "./src/pages/Listings";
import { AuthContext } from "./src/context/AuthContext";

const Stack = createNativeStackNavigator();

function App () {
  const [ user, setUser ] = useState(null);
  return (
    <Provider store={configureStore}>
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
                  <Stack.Screen name="NewFarmerDebit" component={ NewFarmerDebit } />
                  <Stack.Screen name="CardRecharge" component={ CardRecharge } />
                  <Stack.Screen name="Listings" component={ Listings } />
                </>
              )                            
              }
              
            </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </Provider>
  ); 
}

export default App;