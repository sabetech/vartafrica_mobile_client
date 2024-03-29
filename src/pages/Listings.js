import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useDispatch, useSelector } from 'react-redux'; 
import { AuthContext } from "../context/AuthContext"
import { ThemeContext } from "../context/ThemeContext"
import { useIsFocused } from "@react-navigation/native";
import { getAllRegisteredFarmers, 
        getAllFarmerOrders, 
        getAllDeductions,
        getAllCardsUsed,
        cardsUsed,
        deductionlist,
        getStatus, setIdle } from '../redux/vartafrica';
import { appStates } from "../constants";

export default function Listings ({ route, navigation }) {
    const [ data, setData ] = useState([]);
    const registeredFarmers = useSelector(getAllRegisteredFarmers);
    const farmerOrders = useSelector(getAllFarmerOrders);
    const deductions = useSelector(getAllDeductions);
    const cardsUsedList = useSelector(getAllCardsUsed);
    const status = useSelector(getStatus);
    const { user } = useContext(AuthContext);
    const {appColor} = useContext(ThemeContext);
    const isFocused = useIsFocused();
    const dispatch = useDispatch();

    const { title } = route.params;    
    useEffect(() => {
        navigation.setOptions({headerTitle: title, headerShown: true, headerStyle: {
            backgroundColor: appColor
          }, headerTitleStyle: {
            color: '#fff'
          }, headerTintColor: '#fff'});
    }, []);

    useEffect(() => {
        if (isFocused){
            dispatch(setIdle())
            switch(title) {
                case 'Cards Used':
                    dispatch(cardsUsed(user.token));
                break;

                case 'List of Deductions':
                    dispatch(deductionlist(user.token));
                break;
            }
        }
    },[isFocused]);

    useEffect(() => {
        //find out what page this is ... 
        switch(title) {
            case 'List Farmers':
                if (status === appStates.APP_READY) {
                    setData((prev) => [...prev, ...registeredFarmers.map(
                                                farmer => ({
                                                                title: farmer.name+" "+farmer.last_name,
                                                                subTitle: farmer.contact
                                                        }))]);
                }
            break;
            case 'List Orders':
                
                if (status === appStates.APP_READY) {
                    setData((prev) => [...prev, ...farmerOrders.map(
                                                    order => ({
                                                            title: `${order.name} (${order.variety})`,
                                                            subTitle: `QTY: ${order.quantity_ordered}`
                                                            }))]);
                }
            break;
            case 'Cards Used':
                
                if (status === appStates.APP_READY) {
                    setData((prev) => [...cardsUsedList.map(
                        cardsUsedListItem => (
                            {
                                title: cardsUsedListItem.used_by,
                                subTitle: cardsUsedListItem.serial
                            }
                        )
                    )]);
                }
            break;
            case 'List of Deductions':
            
                if (status === appStates.APP_READY) {
                    setData((prev) => [...deductions.map(
                        deduction => ({
                            title: deduction.username,
                            subTitle: deduction.amount
                        })
                    )]);
                }
            break;
        }
    },[status]);

    return (
        <View style={{backgroundColor: appColor}}>
            {
                data.length > 0 ? 
                <FlatList 
                    data={data}
                    inverted={true}
                    renderItem={
                        ({item}) => <View style={styles.listItem}>
                                        <View style={styles.content}>
                                            <Text style={styles.item}>{item.title} </Text>
                                            <Text style={styles.itemRight}> {item.subTitle} </Text>
                                        </View>
                                    </View>
                    }
                />
                :
                <View style={styles.noDataStyle}>
                    <Text style={styles.noDataText}>{title} has no data.</Text>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
     flex: 1,
     paddingTop: 22
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        marginHorizontal: 40,
        justifyContent: 'space-between',
        marginTop: 10
    },
    item: {
      fontSize: 15,
      color: 'black'
    },
    itemRight:{
        fontSize: 15,
        color: 'black'
    },
    listItem: {
        justifyContent: 'space-between',
        borderRadius: 10,
        height: 40,
        marginHorizontal: 15,
        marginVertical: 5,
        backgroundColor: 'white'
        

    },
    noDataStyle: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center'
    },
    noDataText: {
        textAlign: 'center',
        color: 'white'
    }
  });