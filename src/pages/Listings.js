import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from "../context/AuthContext"
import { getAllFarmersByAgent, getAllRegisteredFarmers, getAllFarmerOrders, getAllOrdersByAgent, getStatus, setIdle } from '../redux/vartafrica';

export default function Listings ({ route, navigation }) {
    const [ data, setData ] = useState([]);
    const dispatch = useDispatch();
    const registeredFarmers = useSelector(getAllRegisteredFarmers);
    const farmerOrders = useSelector(getAllFarmerOrders);
    const status = useSelector(getStatus);
    const { user } = useContext(AuthContext);

    const { title } = route.params;    
    useEffect(() => {
        navigation.setOptions({headerTitle: title, headerShown: true});
        dispatch(setIdle())
    }, []);
    

    useEffect(() => {
        //find out what page this is ... 
        switch(title) {
            case 'List Farmers':
                if (status === 'idle') {
                    dispatch(getAllFarmersByAgent(user.token));
                }
            break;
            case 'List Orders':
                if (status === 'idle') {
                    dispatch(getAllOrdersByAgent(user.token));
                }
            break;
            case 'Cards Used':
                if (status === 'idle') {

                }
            break;
            case 'List of Deductions':
                if (status === 'idle') {
                    
                }
            break;
        }

        if (status === 'listings-success') {
            setData(registeredFarmers)
        }

    },[dispatch, status]);

    return (
        <View>
            <FlatList 
                data={data}
                renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
     flex: 1,
     paddingTop: 22
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
    },
  });