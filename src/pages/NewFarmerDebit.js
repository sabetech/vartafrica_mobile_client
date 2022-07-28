import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useDispatch, useSelector } from 'react-redux'; 
import { TextInput } from "react-native-element-textinput";
import { useIsFocused } from "@react-navigation/native";
import {Picker} from '@react-native-picker/picker';
import { AuthContext } from "../context/AuthContext"
import { getAllFarmersByAgent, 
    getAllRegisteredFarmers, 
    getStatus, 
    setIdle,
    saveFarmerDebit,
    getSuccess,
    getSuccessMsg
   } from '../redux/vartafrica';


export default function NewFarmerDebit({ navigation }) {
    const [user_id, setSelectedFarmer] = useState();
    const [amount, setAmount] = useState();

    const registeredFarmers = useSelector(getAllRegisteredFarmers);
    const status = useSelector(getStatus);
    const success = useSelector(getSuccess);
    const responseMsg = useSelector(getSuccessMsg);
    const { user } = useContext(AuthContext);
    
    dispatch = useDispatch();

    useEffect(() => {

        setSelectedFarmer(registeredFarmers[0]?.id);

    },[registeredFarmers]);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(getAllFarmersByAgent(user.token));
        }

        if (status === 'farmer-debit-success'){
            if (success) {
                Alert.alert('Success', responseMsg);
                navigation.navigate('Dashboard');
            }else{
                Alert.alert('Failure', responseMsg);
            }
        }
       
    }, [dispatch, status]);

    const submitFarmerDebit = () => {
        const debit = {
            user_id,
            amount
        }
        
        const chosenFarmer = registeredFarmers.find(farmerFind => farmerFind === user_id);
        const farmerDebitThunkArgs = {
            debit,
            debit_ui_info:{
                name: chosenFarmer.name,
                amount: amount
            },
            token: user.token
        }
        dispatch(saveFarmerDebit(farmerDebitThunkArgs));
    }

    return (
        <View style={{padding: 10, flex: 1}}>
            <Text style={styles.topTitle}>Farmer Debit</Text>
            <Text>Select Farmer</Text>
                <Picker
                    selectedValue={user_id}
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
                label="Amount (UGX)"
                onChangeText={setAmount} value={amount} />
            
            <View style={styles.submitButtonView}>
                    <TouchableOpacity style={styles.submitButton} onPress={() => submitFarmerDebit()}>
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