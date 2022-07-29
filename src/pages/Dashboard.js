import React, { useContext, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from "@react-navigation/native";
import DashboardCard from "../components/DashboardCard";
import { FloatingAction } from "react-native-floating-action";
import { AuthContext } from "../context/AuthContext";
import { downloadAppDataToStorage, getAllDashboardValues, getStatus, setIdle, varfAfricaSlice } from '../redux/vartafrica';
import MainMenuItem from "../components/MainMenuButton";
import Storage from "../services/storage";
import { appStates } from "../constants";



export default function Dashboard ({ navigation }) {
    const dashboardValues = useSelector(getAllDashboardValues);
    const status = useSelector(getStatus);
    const dispatch = useDispatch();
    const { user, setUser } = useContext(AuthContext);
    const isFocused = useIsFocused();

    useEffect(() => {
        if(isFocused){ 
            // dispatch(setIdle());
        }
    }, [isFocused]);

    useEffect(() => {
        if (status === appStates.APP_NOT_READY) {
            Storage.clear();
            dispatch(downloadAppDataToStorage(user.token));
        } 
    }, [dispatch, status]);

    const logout = () => {
        Storage.removeUser();
        setUser(null);
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
        <View style={{padding: 10, flex: 1}}>
            <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                <TouchableOpacity
                    style={ styles.sync }
                >
                    <Text style={ styles.syncText }>Sync</Text>
                </TouchableOpacity>
                <Text style={ styles.statusStyle }>Status of Sync</Text>
            </View>

            {
                (status === appStates.LOADING) && <ActivityIndicator />
            }

            <View style={styles.dashboardlist}>
                <DashboardCard title={"Number of Registered Farmers"} value={dashboardValues?.farmer_count || 0 } />
                <DashboardCard title={"Quantity of Orders"} value={dashboardValues?.total_orders || 0 } />
                <DashboardCard title={"Total Savings"} value={dashboardValues?.total_savings || 0 } />
                <DashboardCard title={"Deductions"} value={dashboardValues?.total_deductions || 0 } />
            </View>
            
            <View style={ styles.menuItems }>
                <MainMenuItem title={"List Farmers"} addNewLink={'RegisterFarmer'} navigation={navigation} />
                <MainMenuItem title={"List Orders"} addNewLink={'FarmerOrders'} navigation={navigation} />
                <MainMenuItem title={"Cards Used"} addNewLink={'CardRecharge'} navigation={navigation} />
                <MainMenuItem title={"List of Deductions"} addNewLink={'NewFarmerDebit'} navigation={navigation} />
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
                    onPress={() => logout()}
                    >
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
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
        backgroundColor: '#A82F15',        
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
        height: 30,
        backgroundColor: 'green',
        borderRadius: 10,
        marginRight: 10        
    },
    syncText: {
        color: 'white',
        padding: 5,
        textAlign: 'center',
        
    },
    statusStyle: {
        textAlign: 'center'
    }

});
