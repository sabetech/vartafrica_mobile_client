import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useDispatch, useSelector } from 'react-redux'; 
import { AuthContext } from "../context/AuthContext"
import { useIsFocused } from "@react-navigation/native";
import { getAllFarmersByAgent, 
        getAllRegisteredFarmers, 
        getAllFarmerOrders, 
        getAllOrdersByAgent, 
        deductionlist,
        getAllDeductions,
        getAllCardsUsed,
        cardsUsed,
        getStatus, setIdle } from '../redux/vartafrica';

export default function Listings ({ route, navigation }) {
    const [ data, setData ] = useState([]);
    const dispatch = useDispatch();
    const registeredFarmers = useSelector(getAllRegisteredFarmers);
    const farmerOrders = useSelector(getAllFarmerOrders);
    const deductions = useSelector(getAllDeductions);
    const cardsUsedList = useSelector(getAllCardsUsed);
    const status = useSelector(getStatus);
    const { user } = useContext(AuthContext);
    const isFocused = useIsFocused();

    const { title } = route.params;    
    useEffect(() => {
        navigation.setOptions({headerTitle: title, headerShown: true});
    }, []);

    useEffect(() => {
        if (isFocused){
            dispatch(setIdle());
        }
    },[isFocused]);

    console.log("data",data);

    useEffect(() => {
        //find out what page this is ... 
        switch(title) {
            case 'List Farmers':
                if (status === 'idle') {
                    dispatch(getAllFarmersByAgent(user.token));
                }
                if (status === 'listings-success') {
                    setData((prev) => [...prev, ...registeredFarmers.map(
                                                farmer => ({
                                                                title: farmer.name+" "+farmer.last_name,
                                                                subTitle: farmer.contact
                                                        }))]);
                }
            break;
            case 'List Orders':
                if (status === 'idle') {
                    dispatch(getAllOrdersByAgent(user.token));
                }
                if (status === 'listings-success') {
                    setData((prev) => [...prev, ...farmerOrders.map(
                                                    order => ({
                                                            title: `${order.name} (${order.variety})`,
                                                            subTitle: `QTY: ${order.quantity_ordered}`
                                                            }))]);
                }
            break;
            case 'Cards Used':
                if (status === 'idle') {
                    dispatch(cardsUsed(user.token));
                }
                if (status === 'listings-success') {
                    setData((prev) => [...prev, ...cardsUsedList.map(
                        cardsUsedListItem => (
                            {
                                
                            }
                        )
                    )]);
                }
            break;
            case 'List of Deductions':
                if (status === 'idle') {
                    dispatch(deductionlist(user.token));
                }
                console.log(deductions);
                if (status === 'listings-success') {
                    setData((prev) => [...prev, ...deductions.map(
                        deduction => ({
                            title: deduction.username,
                            subTitle: deduction.amount
                        })
                    )]);
                }
            break;
        }

        

    },[dispatch, status]);

    return (
        <View>
            {
                data.length > 0 ? 
                <FlatList 
                    data={data}
                    renderItem={
                        ({item}) => <View style={styles.listItem}><Text style={styles.item}>{item.title}</Text><Text style={styles.itemRight}>{item.subTitle}</Text></View>
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
    item: {
      marginHorizontal: 20,
      fontSize: 18,
      height: 44,
      textAlign: 'left'
    },
    itemRight:{
        textAlign: 'right',
        height: 44,
        fontSize: 18,
        marginHorizontal: 20
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    noDataStyle: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center'
    },
    noDataText: {
        textAlign: 'center'        
    }
  });