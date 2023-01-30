import React, { useEffect, useState, useContext, useRef } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput as Ti, Switch} from "react-native";
import { useDispatch, useSelector } from 'react-redux'; 
import { TextInput, AutoComplete } from "react-native-element-textinput";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { getAllRegisteredFarmers, 
         getStatus, 
         setIdle,
         saveOrderByAgent,
         getCrops,
         getVarieties,
         syncParticularKey
        } from '../redux/vartafrica';
import { LogBox } from 'react-native';
import { appStates } from "../constants";
import { storageKeys } from "../constants";

export default function FarmerOrders ({ navigation }) {
    const [selectedFarmer, setSelectedFarmer] = useState();
    const [isValidFarmer, setIsValidFarmer] = useState(true);
    const [isValidItem, setIsValidItem] = useState(true);
    const [seed_quantity, setSeedQty] = useState(["0"]);
    const [crop_cultivated, setCropCultivated] = useState("");
    const [variety, setVariety] = useState([""]);
    const [isValidVariety, setIsValidVariety] = useState([true]);
    const [unit_price, setUnitPrice] = useState(["0"]);
    const [total_price, setTotalPrice] = useState(["0"]);
    const [dis_val_per_unit, setDisValPerUnit] = useState("0");
    const [net_order_value, setnetOrderValue] = useState(0);
    const [varietyViewControls, setVarietyView] = useState([]);
    const [isDiscountPercentageEnabledEnabled, setIsDiscountPercentageEnabled] = useState(false);
    const { appColor } = useContext(ThemeContext);
    

    const dispatch = useDispatch();
    const status = useSelector(getStatus);
    const crops = useSelector(getCrops);
    const variety_items = useSelector(getVarieties);
    const registeredFarmers = useSelector(getAllRegisteredFarmers);
    const { user } = useContext(AuthContext);

    const inputRefs = useRef([]);

    const toggleSwitch = () => setIsDiscountPercentageEnabled(previousState => !previousState);

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        dispatch(setIdle());
        setVarietyView((prev) => [...prev, varietyControl(prev.length) ]);
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

        if (isDiscountPercentageEnabledEnabled){
            const sum_total_price = total_price.reduce((prev, curr) => prev + curr, 0);
            setnetOrderValue((sum_total_price - ((parseFloat(dis_val_per_unit)/100) * sum_total_price)).toString());
        }else {
            setnetOrderValue((total_price.reduce((prev, curr) => prev + curr, 0) - parseFloat(dis_val_per_unit)).toString());
        }
        
        if (inputRefs)
            total_price.map((total,i) => {
                if (typeof inputRefs.current[i] === 'undefined') return;
                    
                inputRefs.current[i].setNativeProps({text: total.toString()});
            });

    }, [total_price, isDiscountPercentageEnabledEnabled])

    useEffect(() => {

        setIsValidVariety((prev) => [...prev, true]);
        
    },[varietyViewControls])
    
    useEffect(() => {
        
        if (status == appStates.ORDER_SAVED){
            Alert.alert("Success", "Order saved successfully!",  [
                
                { text: "OK", onPress: () => {
                    dispatch(setIdle())
                    dispatch(syncParticularKey(storageKeys.FARMERS));
                    dispatch(syncParticularKey(storageKeys.ORDERS));
                } }
              ]);
            navigation.navigate('Dashboard');    
        }

        if (status == appStates.FAILED){
            Alert.alert("Failed", "Order failed to Save", [
                { text: "OK", onPress: () => {
                    dispatch(setIdle())
                }}
            ]);
        }

    }, [dispatch, status]);

    const getSelectedFarmerContact = (farmerText) => {
        let firstBracket = farmerText.indexOf("(");
        let secondBracket = farmerText.indexOf(")");

        let actualValue = farmerText.substring(firstBracket + 1, secondBracket);
        return actualValue;
    }

    const saveFarmerOrder = () => {

        if (!validateForm()) {
            Alert.alert("Error", "Make sure you have entered all the required fields"); 
            return;
        }

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

        const thunkArgs = {
            order,
            token: user.token
        }
        dispatch(saveOrderByAgent(thunkArgs));
    }

    const validateForm = () => {
        let chksum = 0;

        if (selectedFarmer === "") chksum++;
        if (crop_cultivated === "") chksum++;
        if (variety[0].length === 0) chksum++;
        if (!validateFarmerSelection()) {
            setIsValidFarmer(false);
            chksum++;
        }

        if (!validateItem()){
            setIsValidItem(false);
            chksum++;
        }

        // if (!validateVariety()){
        //     chksum++;
        // }

        if (chksum > 0) return false
        return true;
    }

    const validateFarmerSelection = () => {
        return undefined !== registeredFarmers.find((farmer) => farmer.name+" "+farmer.last_name + "("+farmer.contact+")" === selectedFarmer);        
    }

    const validateItem = () => {
        return undefined !== crops.find(crop => crop.name === crop_cultivated)
    }

    const validateVariety = () => {

        if (variety.some(v => v.length === 0)) return false;
        let tempValidVariety = [];
        for(let i = 0;i < variety.length;i++){
            const foundVariety = variety_items.find(v => v.name.trim() === variety[i].trim());
            tempValidVariety[i] = foundVariety !== undefined
        }
       setIsValidVariety([...tempValidVariety]);
       
       return !tempValidVariety.some(v => v === false)
    }

    const varietyControl = (key) => {
        
        console.log("Is valid varirty: ", isValidVariety[key])
        console.log("value of key: ", key)
        console.log("current valid array: ", isValidVariety)

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
                // textError={isValidVariety[key] ? "" : "Invalid Variety"}
                // textErrorStyle={styles.textErrorStyleAutoComplete}
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
                        keyboardType={'numeric'}
                        onChangeText={(text) => handleSeedQtyChanged(text, key)} value={ seed_quantity[key] } />

                    <TextInput label="Unit Price (UGX)" 
                        style={styles.input} 
                        inputStyle={styles.inputStyle}
                        labelStyle={styles.labelStyle}
                        keyboardType={'numeric'}
                        onChangeText={(text) => handleUnitPriceChanged(text, key)} value={ unit_price[key] } />

                    {/* ////// USING REACT NATIVE TextInput HERE DIFFERENT FROM TextInput FROM A LIBRARY /////// */}
                    <Text>Total Amount (UGX) (quantity * price)</Text>
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
        setIsValidVariety((prev) => removeLastElementAtLastPosition(prev));
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
                textError={ isValidFarmer ? "": "This Farmer does not exist" }
                textErrorStyle={styles.textErrorStyleAutoComplete}
                label="Farmer (Type to Search)"
                placeholder="..."
                placeholderTextColor="gray"
                onChangeText={text => {
                    setSelectedFarmer(text);
                }}
                onFocus={() => setIsValidFarmer(true)}
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
                textError={ isValidItem ? "": "This item does not exist" }
                textErrorStyle={styles.textErrorStyleAutoComplete}
                label="Item (Type to Search)"
                placeholder="..."
                placeholderTextColor="gray"
                onChangeText={e => {
                    setCropCultivated(e);
                }}
                onFocus={() => setIsValidItem(true)}
            />  

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
                
                <View style={styles.switchInput}>
                    <Text style={{fontSize: 16}}>Use Percentage Discount</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#56439D" }}
                        thumbColor={isDiscountPercentageEnabledEnabled ? "#28166A" : "#f4f3f4"}
                        onValueChange={toggleSwitch}
                        value={isDiscountPercentageEnabledEnabled}
                    />
                    
                </View>

                <TextInput label={isDiscountPercentageEnabledEnabled ? "Discount Percentage %" : "Discounted Value(UGX)"} 
                    style={styles.input} 
                    inputStyle={styles.inputStyle}
                    labelStyle={styles.labelStyle}
                    keyboardType={'numeric'}
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
      switchInput: {
        flexDirection: "row",
        marginVertical: 20,
        justifyContent: "space-between",
        fontSize: 18
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
        textAlign: 'center'        
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