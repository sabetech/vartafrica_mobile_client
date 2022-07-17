import React, { useEffect, useState, useContext, useRef } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import {Picker} from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux'; 
import { TextInput } from "react-native-element-textinput";
import { AuthContext } from "../context/AuthContext"
import { getAllFarmersByAgent, 
         getAllRegisteredFarmers, 
         getStatus, 
         setIdle,
         saveOrderByAgent
        } from '../redux/vartafrica';

export default function FarmerOrders ({ navigation }) {
    const [selectedFarmer, setSelectedFarmer] = useState();
    const [seed_quantity, setSeedQty] = useState(["0"]);
    const [crop_cultivated, setCropCultivated] = useState("Blesi");
    const [variety, setVariety] = useState(["var_1"]);
    const [unit_price, setUnitPrice] = useState(["0"]);
    const [total_price, setTotalPrice] = useState(["0"]);
    const [dis_val_per_unit, setDisValPerUnit] = useState("0");
    const [net_order_value, setnetOrderValue] = useState(0);
    const [total_net_saving_goal, setTotalNetSavingGoal] = useState();
    const [varietyViewControls, setVarietyView] = useState([]);
    const [elRefs, setElRefs] = useState([]);
    
    const dispatch = useDispatch();
    const status = useSelector(getStatus);
    const registeredFarmers = useSelector(getAllRegisteredFarmers);
    const { user } = useContext(AuthContext);
    
    useEffect(() => {
        dispatch(setIdle());
        setVarietyView((prev) => [...prev, varietyControl(prev.length)]);

    }, []);

    useEffect(() => {
        // add or remove refs
        setElRefs((elRefs) =>
          Array(varietyViewControls)
            .fill()
            .map((_, i) => elRefs[i] || React.createRef()),
        );
      }, [varietyViewControls]);

    useEffect(() => {
        if ((unit_price.length == 0) || (seed_quantity.length == 0)) return;

        if (unit_price.some(el => isNaN(el) ) || seed_quantity.some(el => isNaN(el))) return;
        
        for(let i = 0;(i < seed_quantity.length || i < unit_price.length);i++){
            console.log("seedquty",parseInt(seed_quantity[i]));
            console.log("unitprice", parseFloat(unit_price[i]));

            handleTotalPriceChanged(parseInt(seed_quantity[i]) * parseFloat(unit_price[i]), i);
        }

    },[seed_quantity, unit_price, dis_val_per_unit]);

    useEffect(() => {
        console.log("Total price", total_price);
        console.log("net saving ", total_price.reduce((prev, curr) => prev + curr, 0));
        if (total_price.length == 0) return;
        if (isNaN(dis_val_per_unit)) return;
        if (total_price.some(el => isNaN(el))) return;

        setnetOrderValue((total_price.reduce((prev, curr) => prev + curr, 0) - parseFloat(dis_val_per_unit)).toString());

    }, [total_price])
    
    //load farmers from remote api ... or from localstore
    useEffect(() => {
        if (status === 'idle') {
            dispatch(getAllFarmersByAgent(user.token));
        }

        if (status === 'saving-order') {
            Alert.alert("Loading ...", "Saving Order ...");
        }

        if (status == 'order-saved-success'){
            Alert.alert("Success", "Order saved successfully!");
            navigation.navigate('Dashboard');    
        }

    }, [dispatch, status]);

    useEffect(() => {

        setSelectedFarmer(registeredFarmers[0]?.contact);

    },[registeredFarmers]);

    const saveFarmerOrder = () => {
        const order = {
            farmers: selectedFarmer,
            seed_quantity,
            crop_cultivated,
            variety,
            unit_price,
            total_price,
            dis_val_per_unit,
            net_order_value,
        }

        const thunkArgs = {
            order,
            token: user.token
        }
        dispatch(saveOrderByAgent(thunkArgs));
    }

    const varietyControl = (key) => {
        return (
            <View style={styles.varietyControls} key={key}>
                    <TextInput label="Variety" 
                        style={styles.input} 
                        inputStyle={styles.inputStyle}
                        labelStyle={styles.labelStyle}
                        onChangeText={(text) => handleVarietyTextChanged(text, key)} 
                        value={ variety[key] }
                        />
                    
                    <TextInput label="Seed Quantity" 
                        style={styles.input} 
                        inputStyle={styles.inputStyle}
                        labelStyle={styles.labelStyle}
                        onChangeText={(text) => handleSeedQtyChanged(text, key)} value={ seed_quantity[key] } />

                    <TextInput label="Unit Price (UGX)" 
                        style={styles.input} 
                        inputStyle={styles.inputStyle}
                        labelStyle={styles.labelStyle}
                        onChangeText={(text) => handleUnitPriceChanged(text, key)} value={ unit_price[key] } />

                    <TextInput label="Total Price (UGX)" 
                        style={styles.input} 
                        inputStyle={styles.inputStyle}
                        labelStyle={styles.labelStyle}
                        value={ "total_price[key]" }
                        editable={false}
                        />
                </View>
                
        );
    }

    const handleVarietyTextChanged = (text, index) => {
        setVariety((prev) => [...prev.slice(0, index), text, ...prev.slice(index + 1)]);
    }

    const handleSeedQtyChanged = (text, index) => {
        setSeedQty((prev) => [...prev.slice(0, index), parseInt(text), ...prev.slice(index + 1)]);
    }

    const handleUnitPriceChanged = (text, index) => {
        setUnitPrice((prev) => [...prev.slice(0, index), parseFloat(text), ...prev.slice(index + 1)]);
    }

    const handleTotalPriceChanged = (text, index) => {
        setTotalPrice((prev) => [...prev.slice(0, index), parseFloat(text), ...prev.slice(index + 1)]);
        
    }

    const removeVarietyControls = () => {
        setVarietyView((prev) => removeLastElementAtLastPosition(prev));
        setVariety((prev) => removeLastElementAtLastPosition(prev));
        setUnitPrice((prev) => removeLastElementAtLastPosition(prev));
        setSeedQty((prev) => removeLastElementAtLastPosition(prev));
        setTotalPrice((prev) => removeLastElementAtLastPosition(prev));
    }

    const removeLastElementAtLastPosition = (prev) => prev.filter((_, i) => i < (prev.length - 1));

    return (
        <View style={{padding: 10, flex: 1}}>
            <Text style={styles.topTitle}>Order Form</Text>
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
            
            <ScrollView>
            <Text>Select Farmer</Text>
                <Picker
                    selectedValue={selectedFarmer}
                    onValueChange={
                        (itemValue, itemIndex) =>
                        setSelectedFarmer(itemValue)
                    }
                    prompt={"Select Farmer"}
                    >
                        {
                            registeredFarmers && registeredFarmers?.map(farmer => 
                                <Picker.Item key={ farmer.id } label={ farmer.name+" "+farmer.last_name + "("+farmer.contact+")" } value={ farmer.contact } />
                            )
                        }
                </Picker>
                <TextInput label="Crop Cultivated" 
                    style={styles.input} 
                    inputStyle={styles.inputStyle}
                    labelStyle={styles.labelStyle}
                    onChangeText={setCropCultivated} value={crop_cultivated} />
                
                {
                    varietyViewControls && varietyViewControls.map(formControl => formControl)
                }

                <View style={styles.varietyButtons}>
                    <TouchableOpacity style={styles.varietyMod} onPress={() => {
                        setVarietyView((prev) => [...prev, varietyControl(prev.length)]);
                    }}>
                        <Text style={styles.varietyText}>ADD VARITEY (+)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={varietyViewControls.length > 1 ? styles.varietyMod : styles.varietyModDisabled} onPress={() => {
                        removeVarietyControls();
                    }}
                        disabled={varietyViewControls.length == 1}
                    >
                        <Text style={styles.varietyText}>REMOVE VARIETY (-)</Text>
                        
                    </TouchableOpacity>
                </View>

                <TextInput label="Discounted Value(UGX)" 
                    style={styles.input} 
                    inputStyle={styles.inputStyle}
                    labelStyle={styles.labelStyle}
                    onChangeText={setDisValPerUnit} value={dis_val_per_unit} />

                <TextInput label="Net Order Value (UGX)" 
                    style={styles.input} 
                    inputStyle={styles.inputStyle}
                    labelStyle={styles.labelStyle}
                    value={net_order_value} 
                    editable={false}
                    />

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
    varietyModDisabled: {
        width: '50%',
        height: 40,
        backgroundColor: '#9a96b8',
        padding: 10,
        borderRadius: 8
    },
    varietyText: {
        textAlign: 'center',
        color: 'white'
    }

})