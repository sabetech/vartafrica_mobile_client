import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useDispatch, useSelector } from 'react-redux'; 
import { TextInput, AutoComplete } from "react-native-element-textinput";
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
import { appStates } from "../constants";


export default function NewFarmerDebit({ navigation }) {
    const [selectedFarmer, setSelectedFarmer] = useState();
    const [amount, setAmount] = useState();

    const registeredFarmers = useSelector(getAllRegisteredFarmers);
    const status = useSelector(getStatus);
    const success = useSelector(getSuccess);
    const responseMsg = useSelector(getSuccessMsg);
    const { user } = useContext(AuthContext);
    
    dispatch = useDispatch();

    useEffect(() => {

        setSelectedFarmer(registeredFarmers[0]?.name+" "+registeredFarmers[0]?.last_name + "("+registeredFarmers[0]?.contact+")");

    },[registeredFarmers]);

    useEffect(() => {
       
        if (status === appStates.DEBIT_SAVED){

            Alert.alert('Success', responseMsg,  [
                { text: "OK", onPress: () => dispatch(setIdle()) }
              ]);
            navigation.navigate('Dashboard');
           
        }
       
    }, [dispatch, status]);

    const getSelectedFarmerContact = (farmerText) => {
        let firstBracket = farmerText.indexOf("(");
        let secondBracket = farmerText.indexOf(")");

        let actualValue = farmerText.substring(firstBracket + 1, secondBracket);
        return actualValue;
    }

    const submitFarmerDebit = () => {
        const farmerContact = getSelectedFarmerContact(selectedFarmer)
        const farmerInstance = registeredFarmers.find(regFarmer => regFarmer.contact == farmerContact);
        const debit = {
            user_id: farmerInstance.id,
            amount,
        }
        
        
        const farmerDebitThunkArgs = {
            debit,
            debit_ui_info:{
                name: farmerInstance.name,
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
            {
                (status === 'loading') ? <ActivityIndicator /> 
                :
                registeredFarmers.length == 0 ? 
                <Text style={{textAlign:'center'}}>
                    You have no farmers available. {'\n'}
                    Add a farmer from the 
                    <Text style={{color: 'blue'}}
                        onPress={() => navigation.navigate('RegisterFarmer')}
                    > add farmer page</Text>
                     to be able to make an order!</Text>
                :
                <View>
                    <AutoComplete
                value={selectedFarmer}
                data={[...
                    registeredFarmers && registeredFarmers?.map(farmer => farmer.name+" "+farmer.last_name + "("+farmer.contact+")") 
                ]}
                style={styles.input}
                inputStyle={styles.inputStyle}
                labelStyle={styles.labelStyle}
                placeholderStyle={styles.placeholderStyleAutoComplete}
                textErrorStyle={styles.textErrorStyleAutoComplete}
                label="Farmer (Type to Search)"
                placeholder="..."
                placeholderTextColor="gray"
                onChangeText={e => {
                    setSelectedFarmer(e);
                }}
            /> 

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
            }
            
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