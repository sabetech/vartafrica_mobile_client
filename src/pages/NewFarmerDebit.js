
import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useDispatch, useSelector } from 'react-redux'; 
import { TextInput, AutoComplete } from "react-native-element-textinput";
import { AuthContext } from "../context/AuthContext"
import { ThemeContext } from "../context/ThemeContext"
import { 
    getAllRegisteredFarmers, 
    getStatus, 
    setIdle,
    saveFarmerDebit,
    getSuccessMsg,
    getError
   } from '../redux/vartafrica';
import { appStates } from "../constants";


export default function NewFarmerDebit({ navigation }) {
    const [selectedFarmer, setSelectedFarmer] = useState();
    const [amount, setAmount] = useState();

    const registeredFarmers = useSelector(getAllRegisteredFarmers);
    const status = useSelector(getStatus);
    const errormsg = useSelector(getError);
    const responseMsg = useSelector(getSuccessMsg);
    const { user } = useContext(AuthContext);
    const { appColor } = useContext(ThemeContext);
    
    const dispatch = useDispatch();

    useEffect(() => {

        setSelectedFarmer(registeredFarmers[0]?.name+" "+registeredFarmers[0]?.last_name + "("+registeredFarmers[0]?.contact+")");

    },[registeredFarmers]);

    useEffect(() => {
       
        if (status === appStates.DEBIT_SAVED){

            Alert.alert('Success', responseMsg, [
                { text: "OK", onPress: () => {
                    dispatch(setIdle())
                } }
              ]);
            navigation.navigate('Dashboard');
           
        }
        
        if (status === appStates.DEBIT_FAILED){
            Alert.alert('Failure', errormsg, [
                { text: "OK", onPress: () => {
                    dispatch(setIdle())
                } }
              ]);
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
        
        if (!farmerInstance) {
            Alert.alert("Error", "Couldn't find farmer");
            return;
        }

        if (amount.length === 0){
            Alert.alert("Error", "Amount field is empty!");
            return;
        }

        const debit = {
            user_id: farmerInstance.id,
            amount,
        }
        
        const farmerDebitThunkArgs = {
            debit,
            token: user.token
        }
        dispatch(saveFarmerDebit(farmerDebitThunkArgs));
    }

    return (
    <View style={{padding: 10, flex: 1, backgroundColor: appColor}}>
        <View style={{marginTop: '50%'}}>
            <Text style={{color: 'white'}}>Select Farmer</Text>
            {
                (status === 'loading') ? <ActivityIndicator /> 
                :
                registeredFarmers.length == 0 ? 
                <Text style={{textAlign:'center', color:'white'}}>
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
                placeholderStyle={styles.placeholderStyle}
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
                placeholderStyle={styles.placeholderStyle}
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
          color: 'white'
      },
      labelStyle: {
        fontSize: 14,
        position: 'absolute',
        top: -10,
        backgroundColor: 'white',
        paddingHorizontal: 4,
        marginLeft: -4,
      },
      placeholderStyle: {
        color: 'white'
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
        marginTop: 40,
        backgroundColor: 'red',
        borderRadius: 30,
        width: '40%'
    },
    submitText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18
    },
    topTitle: {
        marginBottom: 10,
        color: 'white'
    },
})