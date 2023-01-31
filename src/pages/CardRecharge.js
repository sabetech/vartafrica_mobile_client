import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, AppState } from "react-native";
import { useDispatch, useSelector } from 'react-redux'; 
import { TextInput } from "react-native-element-textinput";
import { AutoComplete } from 'react-native-element-textinput';
import { AuthContext } from "../context/AuthContext"
import { ThemeContext } from "../context/ThemeContext"
import { 
    getAllRegisteredFarmers, 
    recharge,
    getStatus,
    setIdle,
    getSuccessMsg,
    getError
   } from '../redux/vartafrica';
import { appStates } from "../constants";


export default function CardRecharge({ navigation }) {
    const [farmers, setSelectedFarmer] = useState();
    const [serial_number, setSerialNumber] = useState("");
    const [phone, setPhone] = useState();

    const registeredFarmers = useSelector(getAllRegisteredFarmers);
    const status = useSelector(getStatus);
    const responseMsg = useSelector(getSuccessMsg);
    const errorMsg = useSelector(getError);
    const { user } = useContext(AuthContext);
    const { appColor } = useContext(ThemeContext);
    
    dispatch = useDispatch();

    useEffect(() => {

        setSelectedFarmer(registeredFarmers[0]?.id);

    },[registeredFarmers]);

    useEffect(() => {
        if (status === appStates.RECHARGE_SAVED) {
            Alert.alert('Success', responseMsg, [
                { text: "OK", onPress: () => {
                    dispatch(setIdle())
                } }
            ]);
            navigation.navigate('Dashboard');
        }
        
        if (status === appStates.RECHARGE_FAILED){
            Alert.alert('Failure', errorMsg, [
                { text: "OK", onPress: () => {
                    dispatch(setIdle())
                } }
            ]);
        }        
       
    }, [dispatch, status]);

    const submitCardRechargeInfo = () => {
        const farmer = registeredFarmers.find(farmer => farmer.contact === phone);

        if (!farmer) {
            Alert.alert('Oops', 'Farmer not found. Enter a valid phone number');
            return;
        }

        if (serial_number.length === 0) {
            Alert.alert("Error", "Serial Number field is empty!");
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
        <View style={{padding: 10, flex: 1, backgroundColor: appColor}}>        
            {
                (status === appStates.LOADING) ? <ActivityIndicator /> 
                :
                registeredFarmers.length == 0 ? 
                <Text style={{textAlign:'center', color: 'white'}}>
                    You have no farmers available. {'\n'}
                    Add a farmer from the 
                    <Text style={{color: 'white', textDecorationLine: 'underline'}}
                        onPress={() => navigation.navigate('RegisterFarmer')}
                    > add farmer page</Text>
                     to be able to make an order!</Text>
                :
                <View style={{marginTop: '50%'}}>
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
                        {
                            status === AppState.RECHARGE_SAVING ? <ActivityIndicator /> : <Text style={ styles.submitText }>Submit</Text>
                        }
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
        backgroundColor: 'white'
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
        alignSelf: 'center',
        height: 50,
        width: '40%',
        marginTop: 40,
        backgroundColor: 'red',
        borderRadius: 30
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