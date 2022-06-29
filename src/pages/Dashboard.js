import React, { useContext, useEffect } from "react";
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DashboardCard from "../components/DashboardCard";
import { FloatingAction } from "react-native-floating-action";
import { AuthContext } from "../context/AuthContext";
import { fetchDashboardValues, getAllDashboardValues, getStatus } from '../redux/vartafrica';
import MainMenuItem from "../components/MainMenuButton";



export default function Dashboard ({ navigation }) {
    const dashboardValues = useSelector(getAllDashboardValues);
    const status = useSelector(getStatus);
    const dispatch = useDispatch();
    const { user } = useContext(AuthContext);
    
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchDashboardValues(user.token));
        } 
    }, [dispatch, status]);

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
            <View style={styles.dashboardlist}>
                <DashboardCard title={"Number of Registered Farmers"} value={dashboardValues?.farmer_count || 0 } />
                <DashboardCard title={"Quantity of Orders"} value={dashboardValues?.total_orders || 0 } />
                <DashboardCard title={"Total Savings"} value={dashboardValues?.total_savings || 0 } />
                <DashboardCard title={"Deductions"} value={dashboardValues?.total_deductions || 0 } />
            </View>
            
            <View style={ styles.menuItems }>
                <MainMenuItem title={"List Farmers"} navigation={navigation} />
                <MainMenuItem title={"List Orders"} navigation={navigation} />
                <MainMenuItem title={"Cards Used"}  navigation={navigation} />
                <MainMenuItem title={"List of Deductions"} navigation={navigation} />
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

    }
});
