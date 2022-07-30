import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from 'react-redux'; 
import { TextInput } from "react-native-element-textinput";
import { AutoComplete } from 'react-native-element-textinput';
import { AuthContext } from "../context/AuthContext"
import { syncParticularKey, 
    getAllRegisteredFarmers, 
    recharge,
    getStatus,
    setIdle,
    getSuccessMsg
   } from '../redux/vartafrica';
import { appStates } from "../constants";
import { storageKeys } from "../constants";


export default function CardRecharge({ navigation }) {
    const [farmers, setSelectedFarmer] = useState();
    const [serial_number, setSerialNumber] = useState();
    const [phone, setPhone] = useState();

    const registeredFarmers = useSelector(getAllRegisteredFarmers);
    const status = useSelector(getStatus);
    const responseMsg = useSelector(getSuccessMsg);
    const { user } = useContext(AuthContext);
    
    dispatch = useDispatch();

    useEffect(() => {

        setSelectedFarmer(registeredFarmers[0]?.id);

    },[registeredFarmers]);

    useEffect(() => {
        if (status === appStates.RECHARGE_SAVED) {
            Alert.alert('Success', responseMsg, [
                { text: "OK", onPress: () => {
                    dispatch(setIdle())
                    dispatch(syncParticularKey(storageKeys.FARMERS));
                    dispatch(syncParticularKey(storageKeys.RECHARGE));
                } }
            ]);
            navigation.navigate('Dashboard');
        }
        
        if (status === appStates.FAILED){
            Alert.alert('Failure', responseMsg);
        }        
       
    }, [dispatch, status]);

    const submitCardRechargeInfo = () => {
        const farmer = registeredFarmers.find(farmer => farmer.contact === phone);

        if (!farmer) {
            Alert.alert('Oops', 'Farmer not found. Enter a valid phone number');
            return;
        }

        const rechargeInfo = {
            farmers: farmer.id,
            serial_number
        }

        const farmerRechargeThunkArgs = {
            rechargeInfo,
            token: user.token
        }
        dispatch(recharge(farmerRechargeThunkArgs));
    }

    return (
        <View style={{padding: 10, flex: 1}}>
            <Text style={styles.topTitle}>Card Recharge</Text>           
            {
                (status === appStates.LOADING) ? <ActivityIndicator /> 
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
                <TextInput 
                style={styles.input} 
                inputStyle={styles.inputStyle}
                labelStyle={styles.labelStyle}
                label="Serial Number"
                onChangeText={setSerialNumber} value={serial_number} />

            <AutoComplete
                value={phone}
                data={[...
                    registeredFarmers && registeredFarmers?.map(
                        farmer => farmer.contact
                    )]}
                style={styles.input}
                inputStyle={styles.inputStyle}
                labelStyle={styles.labelStyle}
                placeholderStyle={styles.placeholderStyleAutoComplete}
                textErrorStyle={styles.textErrorStyleAutoComplete}
                label="Phone (Type to Search)"
                placeholder="..."
                placeholderTextColor="gray"
                onChangeText={e => {
                    setPhone(e);
                }}
            />          
            
                <View style={styles.submitButtonView}>
                    <TouchableOpacity style={styles.submitButton} onPress={() => submitCardRechargeInfo()}>
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
    inputAutocomplete: {
        height: 55,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
      },
      inputStyleAutoComplete: { fontSize: 16 },
      labelStyleAutoComplete: { fontSize: 14 },
      placeholderStyleAutoComplete: { fontSize: 16 },
      textErrorStyleAutoComplete: { fontSize: 16 },
});