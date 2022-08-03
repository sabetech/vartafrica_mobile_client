import React, { useContext, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {useNetInfo} from "@react-native-community/netinfo";
import DashboardCard from "../components/DashboardCard";
import { FloatingAction } from "react-native-floating-action";
import { AuthContext } from "../context/AuthContext";
import vartafrica, { downloadAppDataToStorage, loadAsyncStorageIntoRedux, getAllDashboardValues, getStatus, getSyncState, getSyncSuccess, setAppNotReady, syncAll } from '../redux/vartafrica';
import MainMenuItem from "../components/MainMenuButton";
import Storage from "../services/storage";
import { appStates } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Dashboard ({ navigation }) {
    const dashboardValues = useSelector(getAllDashboardValues);
    const sync_state = useSelector(getSyncState); 
    const status = useSelector(getStatus);
    const sync_success = useSelector(getSyncSuccess);
    const dispatch = useDispatch();
    const { user, setUser } = useContext(AuthContext);
    const isFocused = useIsFocused();
    const netInfo = useNetInfo();

    useEffect(() => {
        // AsyncStorage.clear()
        if ((netInfo.isConnected) && (! sync_success)) {
            // dispatch(syncAll());
        }
    }, [isFocused]);

    useEffect(() => {
        console.log("APP STATE ",status);
        if (status === appStates.APP_NOT_READY) {
            //if there are things in storage not synced ... use that one
            dispatch(downloadAppDataToStorage(user.token));
            
        } 
    }, [dispatch, status]);

    const logout = () => {
        setUser(null);
        Storage.clear();
        dispatch(setAppNotReady());
    }

    const actions = [
        {
          text: "Register New Farmer",
          icon: require("../assets/farmer.png"),
          name: "bt_register_new_farmer",
          position: 1
        },
        {
          text: "New Farmer Debit",
          icon: require("../assets/compass.png"),
          name: "bt_new_farmer_debit",
          position: 2
        },
        {
          text: "Card Recharge",
          icon: require("../assets/credit-card.png"),
          name: "bt_card_recharge",
          position: 3
        },
        {
          text: "Farmer Orders",
          icon: require("../assets/shipped.png"),
          name: "bt_farmer_orders",
          position: 4
        }
      ]
    return( 
        <SafeAreaView style={{padding: 10}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                    style={{...styles.sync, backgroundColor: (sync_success ? 'green':'red')} }
                    onPress={() => dispatch(syncAll())}
                >
                    {
                        ( sync_state == appStates.SYNCING ) ? <ActivityIndicator color={'white'} size={'large'}/> : <Text style={styles.syncText}>Sync</Text>
                    } 
                </TouchableOpacity><Text>
                    {                        
                        (sync_state == appStates.SYNCING ) ? "Syncing ..." : sync_success ? "Synced" : "Sync Failed! Network Issues!"
                    }
                    </Text>
            </View>
            <View>
                {
                    (status === appStates.LOADING) && (<View><Text>Loading... Plese wait!</Text><ActivityIndicator /></View>) 
                    || <Text>Connection: { netInfo.type.toUpperCase() } {netInfo.isConnected?"ONLINE":"OFFLINE"}</Text>   
                }   
            </View>
            <View>
                <View style={styles.dashboardlist}>
                    <DashboardCard title={"Number of Registered Farmers"} value={dashboardValues?.farmer_count || "..." } />
                    <DashboardCard title={"Quantity of Orders"} value={dashboardValues?.total_orders || "..." } />
                    <DashboardCard title={"Total Savings"} value={dashboardValues?.total_savings || "..." } />
                    <DashboardCard title={"Deductions"} value={dashboardValues?.total_deductions || "..." } />
                </View>
                
                <View style={ styles.menuItems }>
                    <MainMenuItem title={"List Farmers"} addNewLink={'RegisterFarmer'} navigation={navigation} />
                    <MainMenuItem title={"List Orders"} addNewLink={'FarmerOrders'} navigation={navigation} />
                    <MainMenuItem title={"Cards Used"} addNewLink={'CardRecharge'} navigation={navigation} />
                    <MainMenuItem title={"List of Deductions"} addNewLink={'NewFarmerDebit'} navigation={navigation} />
                </View>
            </View>
            <FloatingAction
                actions={actions}
                onPressItem={name => {
                    switch(name) {
                        case 'bt_register_new_farmer':
                            navigation.navigate('RegisterFarmer');
                        break;

                        case 'bt_new_farmer_debit':
                            navigation.navigate('NewFarmerDebit');
                        break;

                        case 'bt_card_recharge':
                            navigation.navigate('CardRecharge');
                        break;

                        case 'bt_farmer_orders':
                            navigation.navigate('FarmerOrders');
                        break;
                    }
                }}
            />
            <View>
                <TouchableOpacity
                    style={styles.logout}
                    onPress={() => {
                        if (sync_success)
                            logout()
                        else
                            Alert.alert("Warning!", "App is not fully synced with server. You will lose crital data. Do you want to continue?",
                            [
                                { 
                                    text: "YES", onPress: () => {
                                        logout()
                                    }
                                },
                                {
                                    text: "NO"
                                }
                            ]);
                        }}
                    >
                    <Text style={[styles.logoutText, {backgroundColor: (sync_success?"#A82F15":"grey")}]}>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    dashboardlist: {
        marginTop: 10,
        height: '50%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        justifyContent: 'center'
    },
    menuItems: {
        justifyContent:'center',
        flexDirection: 'row',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        flexWrap: 'wrap'

    },
    logout: {
        alignSelf: 'center',
        // backgroundColor: '#A82F15',        
        borderRadius: 10,
        width: '80%',
        zIndex: -1
    },
    logoutText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        paddingVertical: 12
    },
    sync: {
        width: '30%',
        height: 40,
        borderRadius: 10,
        marginRight: 10        
    },
    syncText: {
        color: 'white',
        padding: 5,
        textAlign: 'center',
        fontSize: 20
    },
    statusStyle: {
        textAlign: 'center'
    }

});
