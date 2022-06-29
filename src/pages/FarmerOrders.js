import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";
import {Picker} from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux'; 
import { TextInput } from "react-native-element-textinput";
import { AuthContext } from "../context/AuthContext"
import { getAllFarmersByAgent, getAllRegisteredFarmers, getStatus, setIdle } from '../redux/vartafrica';

export default function FarmerOrders ({ navigation }) {
    const [selectedFarmer, setSelectedFarmer] = useState();
    const [user_side, setUserSide] = useState(true);
    const [seed_quantity, setSeedQty] = useState("");
    const [crop_cultivated, setCropCultivated] = useState("");
    const [variety, setVariety] = useState("");
    const [unit_price, setUnitPrice] = useState("");
    const [total_price, setTotalPrice] = useState("");
    const [dis_val_per_unit, setDisValPerUnit] = useState();
    const [save_amount, setSaveAmt] = useState(0);
    const [net_order_value, setnetOrderValue] = useState(0);
    const [total_net_saving_goal, setTotalNetSavingGoal] = useState();
    const [target_saving_amount, setTargetSavingAmount] = useState();
    
    const dispatch = useDispatch();
    const status = useSelector(getStatus);
    const registeredFarmers = useSelector(getAllRegisteredFarmers);
    const { user } = useContext(AuthContext);
    
    useEffect(() => {
        dispatch(setIdle())
    }, []);
    
    //load farmers from remote api ... or from localstore
    useEffect(() => {
        console.log("Status ",status);
        if (status === 'idle') {
            dispatch(getAllFarmersByAgent(user.token));
        }
    }, [dispatch, status]);

    console.log(registeredFarmers);

    const saveFarmerOrder = () => {
        const order = {
            user_side,
            seed_quantity,
            crop_cultivated,
            variety,
            unit_price,
            total_price,
            dis_val_per_unit,
            save_amount,
            net_order_value,
            total_net_saving_goal,
            target_saving_amount,
        }
    }

    return (
        <View style={{padding: 10, flex: 1}}>
            <Text style={styles.topTitle}>Order Form</Text>
            {
                registeredFarmers.length == 0 ? 
                <Text style={{textAlign:'center'}}>
                    You have no farmers available. {'\n'}
                    Add a farmer from the 
                    <Text style={{color: 'blue'}}
                        onPress={() => navigation.navigate('RegisterFarmer')}
                    > add farmer page</Text>
                     to be able to make an order!</Text>
                :
            
            <ScrollView>
            <Text>Select Farmer</Text>
                <Picker
                    selectedValue={selectedFarmer}
                    onValueChange={
                        (itemValue, itemIndex) =>
                        setSelectedFarmer(itemValue)
                    }>
                        {
                            registeredFarmers.map(farmer => 
                                <Picker.Item key={ farmer.id } label={ farmer.name+" "+farmer.last_name } value={ farmer.id } />
                            )
                        }
                </Picker>
                <View style={styles.varietyControls}>
                    <TextInput label="Variety" 
                        style={styles.input} 
                        inputStyle={styles.inputStyle}
                        labelStyle={styles.labelStyle}
                        onChangeText={setVariety} value={variety} />
                    
                    <TextInput label="Seed Quantity" 
                        style={styles.input} 
                        inputStyle={styles.inputStyle}
                        labelStyle={styles.labelStyle}
                        onChangeText={setSeedQty} value={seed_quantity} />

                    <TextInput label="Unit Price (UGX)" 
                        style={styles.input} 
                        inputStyle={styles.inputStyle}
                        labelStyle={styles.labelStyle}
                        onChangeText={setUnitPrice} value={unit_price} />

                    <TextInput label="Total Price (UGX)" 
                        style={styles.input} 
                        inputStyle={styles.inputStyle}
                        labelStyle={styles.labelStyle}
                        onChangeText={setTotalPrice} value={total_price} />

                    
                </View>
                <View style={styles.varietyButtons}>
                    <TouchableOpacity style={styles.varietyMod}>
                        <Text style={styles.varietyText}>ADD VARITEY (+)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.varietyMod}>
                        <Text style={styles.varietyText}>REMOVE VARIETY (-)</Text>
                    </TouchableOpacity>
                </View>

                <TextInput label="Crop Cultivated" 
                    style={styles.input} 
                    inputStyle={styles.inputStyle}
                    labelStyle={styles.labelStyle}
                    onChangeText={setCropCultivated} value={crop_cultivated} />

                <TextInput label="Discounted Value per Unit (UGX)" 
                    style={styles.input} 
                    inputStyle={styles.inputStyle}
                    labelStyle={styles.labelStyle}
                    onChangeText={setDisValPerUnit} value={dis_val_per_unit} />

                <TextInput label="Net Order Value (UGX)" 
                    style={styles.input} 
                    inputStyle={styles.inputStyle}
                    labelStyle={styles.labelStyle}
                    onChangeText={setSeedQty} value={seed_quantity} />

                <TextInput label="Total Savings Goal (UGX)" 
                    style={styles.input} 
                    inputStyle={styles.inputStyle}
                    labelStyle={styles.labelStyle}
                    onChangeText={setSeedQty} value={seed_quantity} />

                <View style={styles.submitButtonView}>
                    <TouchableOpacity style={styles.submitButton} onPress={() => saveFarmerOrder()}>
                        <Text style={ styles.submitText }>Submit</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
    varietyControls: {
        padding: 11,
        backgroundColor: '#F1EBFC',
        marginVertical: 5
    },
    varietyButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        
    },
    varietyMod: {
        width: '50%',
        height: 40,
        backgroundColor: '#242233',
        padding: 10,
        borderRadius: 8
    },
    varietyText: {
        textAlign: 'center',
        color: 'white'
    }

})