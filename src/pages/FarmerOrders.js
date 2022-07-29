import React, { useEffect, useState, useContext, useRef } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput as Ti} from "react-native";
import {Picker} from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux'; 
import { TextInput, AutoComplete } from "react-native-element-textinput";
import { AuthContext } from "../context/AuthContext"
import { getAllFarmersByAgent, 
         getAllRegisteredFarmers, 
         getStatus, 
         setIdle,
         saveOrderByAgent,
         getCrops,
         getVarieties,
        } from '../redux/vartafrica';
import { LogBox } from 'react-native';
import { appStates } from "../constants";

export default function FarmerOrders ({ navigation }) {
    const [selectedFarmer, setSelectedFarmer] = useState();
    const [seed_quantity, setSeedQty] = useState(["0"]);
    const [crop_cultivated, setCropCultivated] = useState("Banana");
    const [variety, setVariety] = useState(["Mpologoma"]);
    const [unit_price, setUnitPrice] = useState(["0"]);
    const [total_price, setTotalPrice] = useState(["0"]);
    const [dis_val_per_unit, setDisValPerUnit] = useState("0");
    const [net_order_value, setnetOrderValue] = useState(0);
    const [varietyViewControls, setVarietyView] = useState([]);
    const [elRefs, setElRefs] = useState([]);
    
    const dispatch = useDispatch();
    const status = useSelector(getStatus);
    const crops = useSelector(getCrops);
    const variety_items = useSelector(getVarieties);
    const registeredFarmers = useSelector(getAllRegisteredFarmers);
    const { user } = useContext(AuthContext);

    const inputRefs = useRef([]);
    
    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        dispatch(setIdle());
        setVarietyView((prev) => [...prev, varietyControl(prev.length)]);
    }, []);

    useEffect(() => {
        if ((unit_price.length == 0) || (seed_quantity.length == 0)) return;
        if (unit_price.some(el => isNaN(el) ) || seed_quantity.some(el => isNaN(el))) return;
        
        for(let i = 0;(i < seed_quantity.length || i < unit_price.length);i++){
            handleTotalPriceChanged(parseInt(seed_quantity[i]) * parseFloat(unit_price[i]), i);
        }

    },[seed_quantity, unit_price, dis_val_per_unit]);

    useEffect(() => {        
        if (total_price.length == 0) return;
        if (isNaN(dis_val_per_unit)) return;
        if (total_price.some(el => isNaN(el))) return;

        setnetOrderValue((total_price.reduce((prev, curr) => prev + curr, 0) - parseFloat(dis_val_per_unit)).toString());

        if (inputRefs)
            total_price.map((total,i) => {
                if (typeof inputRefs.current[i] === 'undefined') return;
                    
                inputRefs.current[i].setNativeProps({text: total.toString()});
            });

    }, [total_price])
    
    //load farmers from remote api ... or from localstore
    useEffect(() => {
        
        if (status == appStates.ORDER_SAVED){
            Alert.alert("Success", "Order saved successfully!",  [
                
                { text: "OK", onPress: () => dispatch(setIdle()) }
              ]);
            navigation.navigate('Dashboard');    
        }

    }, [dispatch, status]);

    useEffect(() => {

        setSelectedFarmer(registeredFarmers[0]?.name+" "+registeredFarmers[0]?.last_name + "("+registeredFarmers[0]?.contact+")");

    },[registeredFarmers]);

    const getSelectedFarmerContact = (farmerText) => {
        let firstBracket = farmerText.indexOf("(");
        let secondBracket = farmerText.indexOf(")");

        let actualValue = farmerText.substring(firstBracket + 1, secondBracket);
        return actualValue;
    }

    const saveFarmerOrder = () => {
        let actualSelectedFarmer = getSelectedFarmerContact(selectedFarmer);

        const order = {
            farmers: actualSelectedFarmer,
            seed_quantity,
            crop_cultivated,
            variety,
            unit_price,
            total_price,
            dis_val_per_unit,
            net_order_value,
        }

       const ui_info = [];
       varietyViewControls.forEach((_, i) => {
            ui_info.push({
                name: selectedFarmer,
                variety: variety[i],
                quantity_ordered: seed_quantity[i]
            });
       });
      
        const thunkArgs = {
            order,
            ui_info,
            token: user.token
        }
        dispatch(saveOrderByAgent(thunkArgs));
    }

    const varietyControl = (key) => {
        return (
            <View style={styles.varietyControls} key={key}>
                    <AutoComplete
                value={variety[key]}
                data={[...
                    variety_items && variety_items?.map(variety_item => variety_item.name) 
                ]}
                style={styles.input}
                inputStyle={styles.inputStyle}
                labelStyle={styles.labelStyle}
                placeholderStyle={styles.placeholderStyleAutoComplete}
                textErrorStyle={styles.textErrorStyleAutoComplete}
                label="Variety/Specification (Type to Search)"
                placeholder="..."
                placeholderTextColor="gray"
                onChangeText={e => {
                    handleVarietyTextChanged(e, key);
                }}
            /> 
                    
                    <TextInput label="Quantity" 
                        style={styles.input} 
                        inputStyle={styles.inputStyle}
                        labelStyle={styles.labelStyle}
                        onChangeText={(text) => handleSeedQtyChanged(text, key)} value={ seed_quantity[key] } />

                    <TextInput label="Unit Price (UGX)" 
                        style={styles.input} 
                        inputStyle={styles.inputStyle}
                        labelStyle={styles.labelStyle}
                        onChangeText={(text) => handleUnitPriceChanged(text, key)} value={ unit_price[key] } />

                    {/* ////// USING REACT NATIVE TextInput HERE DIFFERENT FROM TextInput FROM A LIBRARY /////// */}
                    <Text>Total Price (UGX) (quantity * price)</Text>
                    <Ti 
                        style={ styles.input } 
                        value={ total_price[key] }
                        editable={ false }
                        ref={el => inputRefs.current[key] = el}
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

            <AutoComplete
                value={crop_cultivated}
                data={[...
                    crops && crops?.map(crop => crop.name) 
                ]}
                style={styles.input}
                inputStyle={styles.inputStyle}
                labelStyle={styles.labelStyle}
                placeholderStyle={styles.placeholderStyleAutoComplete}
                textErrorStyle={styles.textErrorStyleAutoComplete}
                label="Item (Type to Search)"
                placeholder="..."
                placeholderTextColor="gray"
                onChangeText={e => {
                    setCropCultivated(e);
                }}
            />  

                {/* <TextInput label="Item" 
                    style={styles.input} 
                    inputStyle={styles.inputStyle}
                    labelStyle={styles.labelStyle}
                    onChangeText={setCropCultivated} value={crop_cultivated} /> */}
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

})