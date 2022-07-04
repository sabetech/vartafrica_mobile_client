import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useDispatch, useSelector } from 'react-redux'; 
import { TextInput } from "react-native-element-textinput";
import { useIsFocused } from "@react-navigation/native";
import {Picker} from '@react-native-picker/picker';
import { AuthContext } from "../context/AuthContext"
import { getAllFarmersByAgent, 
    getAllRegisteredFarmers, 
    recharge,
    getStatus, 
    setIdle,
    getSuccess,
    getSuccessMsg
   } from '../redux/vartafrica';


export default function CardRecharge({ navigation }) {
    const [farmers, setSelectedFarmer] = useState();
    const [serial_number, setSerialNumber] = useState();

    const registeredFarmers = useSelector(getAllRegisteredFarmers);
    const status = useSelector(getStatus);
    const success = useSelector(getSuccess);
    const responseMsg = useSelector(getSuccessMsg);
    const { user } = useContext(AuthContext);
    
    dispatch = useDispatch();
    const isFocused = useIsFocused();

    useEffect(() => {

        if (isFocused)
            dispatch(setIdle());

    }, [isFocused]);

    useEffect(() => {

        setSelectedFarmer(registeredFarmers[0]?.id);

    },[registeredFarmers]);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(getAllFarmersByAgent(user.token));
        }

        if (status === 'saving-recharge') {
            Alert.alert("Loading ...", "Saving Recharge ...");
        }

        if (status === 'farmer-recharge-success'){
            if (success) {
                Alert.alert('Success', responseMsg);
                navigation.navigate('Dashboard');
            }else{
                Alert.alert('Failure', responseMsg);
            }
        }
       
    }, [dispatch, status]);

    const submitCardRechargeInfo = () => {
        const rechargeInfo = {
            farmers,
            serial_number
        }
        
        const farmerRechargeThunkArgs = {
            rechargeInfo,
            token: user.token
        }
        dispatch(recharge(farmerRechargeThunkArgs));
    }

    return (
        <View>
            <Text style={styles.topTitle}>Card Recharge</Text>
            <Text>Select Farmer</Text>
                <Picker
                    selectedValue={farmers}
                    onValueChange={
                        (itemValue, itemIndex) =>
                        setSelectedFarmer(itemValue)
                    }
                    prompt={"Select Farmer"}
                    >
                        {
                            registeredFarmers && registeredFarmers?.map(farmer => 
                                <Picker.Item key={ farmer.id } label={ farmer.name+" "+farmer.last_name } value={ farmer.id } />
                            )
                        }
                </Picker>
            <TextInput 
                style={styles.input} 
                inputStyle={styles.inputStyle}
                labelStyle={styles.labelStyle}
                label="Serial Number"
                onChangeText={setSerialNumber} value={serial_number} />
            
            <View style={styles.submitButtonView}>
                    <TouchableOpacity style={styles.submitButton} onPress={() => submitCardRechargeInfo()}>
                        <Text style={ styles.submitText }>Submit</Text>
                    </TouchableOpacity>
                </View>
        </View>
    );

}

const styles = StyleSheet.create({
    input: {
        height: 55,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: '#DDDDDD',
        marginVertical: 10,
      },
      inputStyle: { 
          fontSize: 16,
          color: 'black'
      },
      labelStyle: {
        fontSize: 14,
        position: 'absolute',
        top: -10,
        backgroundColor: 'white',
        paddingHorizontal: 4,
        marginLeft: -4,
      },
    submitButtonView: {
        marginVertical: 10
    },
    submitButton:{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        height: 50,
        marginTop: 40,
        backgroundColor: '#112233'
    },
    submitText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18
    },
    topTitle: {
        marginBottom: 10
    },
})