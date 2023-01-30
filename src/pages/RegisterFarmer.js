import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, FlatList } from "react-native";
import { TextInput, AutoComplete } from 'react-native-element-textinput';
import Geolocation from 'react-native-geolocation-service';
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { useDispatch, useSelector } from 'react-redux';
import { registerFarmerThunk, getStatus, setIdle, syncParticularKey } from '../redux/vartafrica';
import { Picker } from '@react-native-picker/picker';
import { PermissionsAndroid } from 'react-native';
import { appStates, storageKeys } from "../constants";
import { countries } from "../resources/countries";
import { sub_counties } from "../resources/sub_counties";
import { districts } from "../resources/districts";
import { LogBox } from 'react-native';


export default function RegisterFarmer({ navigation }) {
    const { user } = useContext(AuthContext);
    const { appColor } = useContext(ThemeContext); 
    const [first_name, setFirstname] = useState("");
    const [last_name, setLastname] = useState("");
    const [user_name, setUsername] = useState("");
    const [country_code, setCountryCode] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [age, setAge] = useState("");
    const [sex, setSex] = useState("male");
    const [village, setVillage] = useState("");
    const [parish, setParish] = useState("");
    const [sub_county, setSubCounty] = useState("");
    const [district, setDistrict] = useState("");
    const [country, setCountry] = useState("Uganda");
    const [next_of_kin_name, setNameOfNextKin] = useState("");
    const [next_of_kin_phone, setMobileNumberOfNextKin] = useState("");
    const [password, setPasswordOfFarmer] = useState("");
    const [password_err, setPasswordErr] = useState("");
    const [latitude, setLatitude] = useState("0");
    const [longitude, setLongitude] = useState("0");
    const [disability_status, setDisabilityStatus] = useState("no");
    const [land_area, setLandarea] = useState("");
    const [mechanization_needed, setMechanizationNeeded] = useState("yes");
    const [fertilizer, setFertilizer] = useState("yes");
    
    const dispatch = useDispatch();
    const status = useSelector(getStatus);

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        let isSubscribed = true;
        try{
            getCurrentPosition((result) => {
                if (isSubscribed) {
                    setLongitude(result?.position?.coords.longitude);
                    setLatitude(result?.position?.coords.latitude);
                }            
            });
        }catch( e ) {
            Alert.alert("Warning", "Could not get location",[
                { text: "OK", onPress: () => {
                    dispatch(setIdle())
                } }
              ]);
        }
        
        return (() => {
            isSubscribed = false;
        });

    }, []);

    useEffect(() => {
        if (status == appStates.FARMER_SAVED){
            Alert.alert("Success", "Farmer Registered Successfully", [
                { 
                    text: "OK", onPress: () => {
                        dispatch(setIdle());
                        dispatch(syncParticularKey(storageKeys.FARMERS));
                    } 
                }
              ]);
            navigation.goBack();
        }
        if (status == appStates.FAILED){
            Alert.alert("Failure", "Failed to Register farmer", [
                { text: "OK", onPress: () => {
                    dispatch(setIdle())
                } }
              ]);
        }
        
        return (() => {
            
        });

    }, [dispatch, status]);

      async function getCurrentPosition(callback) {
        const hasLocationPermission = await requestLocationPermission()
    
        if (hasLocationPermission === false) {
          callback({
            locationAvailable: false,
            error: 'Can not obtain location permission'
          })
          return
        }
    
        Geolocation.getCurrentPosition(
          position => {
            callback({
              locationAvailable: true,
              position
            })
          },
          error => {
            callback({
              locationAvailable: false,
              error: error.message,
              errorCode: error.code
            })
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
        )
      }
      
    async function requestLocationPermission() {
    
        try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                'title': 'Vart Africa Mobile Location Permision',
                'message': 'To set location of farmers'
            }
        )

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true
        } else {
            return false
        }
        } catch (err) {
            console.warn(err.message)
        return false
        }
    }

    const validatePassword = (password_text) => {
        const uppercaseRegExp   = /(?=.*?[A-Z])/;
        const lowercaseRegExp   = /(?=.*?[a-z])/;
        const digitsRegExp      = /(?=.*?[0-9])/;
        const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
        const minLengthRegExp   = /.{8,}/;

        const passwordLength =      password_text.length;
        const uppercasePassword =   uppercaseRegExp.test(password_text);
        const lowercasePassword =   lowercaseRegExp.test(password_text);
        const digitsPassword =      digitsRegExp.test(password_text);
        const specialCharPassword = specialCharRegExp.test(password_text);
        const minLengthPassword =   minLengthRegExp.test(password_text);

        let errMsg ="";
        if(passwordLength===0){
            errMsg="Password is empty";
        }else if(!uppercasePassword){
            errMsg="At least one Uppercase";
        }else if(!lowercasePassword){
            errMsg="At least one Lowercase";
        }else if(!digitsPassword){
            errMsg="At least one digit";
        }else if(!specialCharPassword){
            errMsg="At least one Special Characters";
        }else if(!minLengthPassword){
            errMsg="At least minumum 8 characters";
        }else{
            errMsg="";
        }
        
        setPasswordErr(errMsg);    

    }
      
    const handleSubmitRegister = () => {
        let form_validated = true;
        if (mobileNumber.length < 9)
            form_validated = false;
        
        if (next_of_kin_phone.length < 9)
            form_validated = false;
            
        if (password_err.length > 0)
            form_validated = false;

        if (!form_validated) {
            Alert.alert("Error", "Some form values are not valid")
            return;
        }

        let newFarmer = {
            first_name,
            last_name,
            user_name,
            country_code,
            mobileNumber,
            age,
            sex,
            next_of_kin_name,
            next_of_kin_phone,
            village,
            parish,
            sub_county,
            district,
            country,
            latitude,
            longitude,
            disability_status,
            land_area,
            mechanization_needed,
            fertilizer,
            password
        }
        const thunkArgs = {
            newFarmer,
            token: user.token
        }

        dispatch(registerFarmerThunk(thunkArgs));
        
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: appColor}}>
            
        <View style={{padding: 10, flex: 1}}>
        <ScrollView>
        <TextInput style={ styles.input } 
                    inputStyle={styles.inputStyle}
                    labelStyle={styles.labelStyle} onChangeText={(text) => setFirstname(text)} value={first_name} placeholder="First name" label="First name" />
        
        <TextInput style={styles.input} 
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            onChangeText={(text) => setLastname(text)} value={last_name} placeholder="Last name" label="Last name" />
        
        <TextInput style={styles.input} 
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            onChangeText={(text) => setUsername(text)} value={user_name} placeholder="Username" label="Username" />
        
            <AutoComplete
                value={country_code}
                data={[...
                    countries && countries?.map(
                        country => country.phonecode.toString()
                    )]}
                style={styles.input}
                inputStyle={styles.inputStyle}
                labelStyle={styles.labelStyle}
                placeholderStyle={styles.placeholderStyleAutoComplete}
                textErrorStyle={styles.textErrorStyleAutoComplete}
                label="Country Code (Type to Search)"
                placeholder="+235"
                placeholderTextColor="gray"
                onChangeText={e => {
                    setCountryCode(e);
                }}
                numeric={true}
            />   
        
        <TextInput style={styles.input} 
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            textError={mobileNumber.length == 9 || mobileNumber.length == 0 ? "" : "Phone number is incorrect"}
            textErrorStyle={styles.textErrorStyle}
            keyboardType={'number-pad'}
            onChangeText={(text) => setMobileNumber(text.replace(/[^0-9]/g, ''))} value={mobileNumber} placeholder="000000000" label="Mobile Number" />

        <Text style={{color: 'white'}}>Select Sex</Text>
        <Picker
            prompt={"Choose Sex"}
            selectedValue={sex}
            onValueChange={(itemValue, itemIndex) =>
                setSex(itemValue)
            }
            style={{backgroundColor: 'white'}}
        >
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
        </Picker>

            <TextInput style={styles.input} 
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            keyboardType={'number-pad'}
            onChangeText={(text) => setAge(text)} value={age} placeholder="29" label="Age" />

            <TextInput style={styles.input} 
                inputStyle={styles.inputStyle}
                labelStyle={styles.labelStyle}
                onChangeText={(text) => setVillage(text)} value={village} placeholder="Village" label="Village" />
            
            <TextInput style={styles.input} 
                inputStyle={styles.inputStyle}
                labelStyle={styles.labelStyle}
                onChangeText={(text) => setParish(text)} value={parish} placeholder="Parish ..." label="Parish" />
            
            <AutoComplete
                value={sub_county}
                data={[...
                    sub_counties && sub_counties?.map(
                        subcounty => subcounty.name
                    )]}
                style={styles.input}
                inputStyle={styles.inputStyle}
                labelStyle={styles.labelStyle}
                placeholderStyle={styles.placeholderStyleAutoComplete}
                textErrorStyle={styles.textErrorStyleAutoComplete}
                label="Sub County (Type to Search)"
                placeholder="sub country..."
                placeholderTextColor="gray"
                onChangeText={e => {
                    setSubCounty(e);
                }}
            /> 

        <AutoComplete
            value={district}
            data={[...
                districts && districts?.map(
                    dists => dists.name
                )]}
            style={styles.input}
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            placeholderStyle={styles.placeholderStyleAutoComplete}
            textErrorStyle={styles.textErrorStyleAutoComplete}
            label="Districts (Type to Search)"
            placeholder=""
            placeholderTextColor="gray"
            onChangeText={e => {
                setDistrict(e);
            }}
        />

        <AutoComplete
                value={country}
                data={[...
                    countries && countries?.map(
                        country => country.name
                    )]}
                style={styles.input}
                inputStyle={styles.inputStyle}
                labelStyle={styles.labelStyle}
                placeholderStyle={styles.placeholderStyleAutoComplete}
                textErrorStyle={styles.textErrorStyleAutoComplete}
                label="Country Name (Type to Search)"
                placeholder="Uganda"
                placeholderTextColor="gray"
                onChangeText={e => {
                    setCountry(e);
                }}
            /> 

        <TextInput style={styles.input} 
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            onChangeText={(text) => setNameOfNextKin(text)} value={next_of_kin_name} placeholder="Name of Next Of Kin" label="Name of Next of Kin" />

        <TextInput style={styles.input} 
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            textError={next_of_kin_phone.length == 9 || next_of_kin_phone.length == 0 ? "" : "Phone number is incorrect"}
            textErrorStyle={styles.textErrorStyle}
            keyboardType={'number-pad'}
            onChangeText={(text) => setMobileNumberOfNextKin(text.replace(/[^0-9]/g, ''))} value={next_of_kin_phone} placeholder="000000000" label="Mobile Number of Next of Kin" />

        <TextInput style={styles.input} 
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            onChangeText={(text) => setLandarea(text)} value={land_area} placeholder="132" label="Land Area" />

        <Text style={{color: 'white'}}>Fertilizer</Text>
        <Picker
            prompt={"Fertilizer"}
            selectedValue={fertilizer}
            onValueChange={(itemValue, itemIndex) =>
                setFertilizer(itemValue)
            }
            style={{color: 'black', backgroundColor: 'white'}}
        >
            <Picker.Item label="Yes" value="yes" />
            <Picker.Item label="No" value="no" />
        </Picker>

        <Text style={{color: 'white'}}>Disabled?</Text>
        <Picker
            prompt={"Disabled?"}
            selectedValue={disability_status}
            onValueChange={(itemValue, itemIndex) =>
                setDisabilityStatus(itemValue)
            }
            style={{backgroundColor: 'white', color: 'white'}}

        >
        <Picker.Item label="Yes" value="yes" />
        <Picker.Item label="No" value="no" />
        </Picker>

        <Text style={{color: 'white'}}>Mechanization Needed</Text>
        <Picker
            prompt={"Mechanization Needed"}
            selectedValue={mechanization_needed}
            onValueChange={(itemValue, itemIndex) =>
                setMechanizationNeeded(itemValue)
            }
            style={{backgroundColor: 'white', color: 'black'}}
        >
        <Picker.Item label="Yes" value="yes" />
        <Picker.Item label="No" value="no" />
        </Picker>

        <TextInput style={styles.input} 
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            textError={ password_err }
            textErrorStyle={styles.textErrorStyle}
            onChangeText={(text) => {
                    validatePassword(text)
                    setPasswordOfFarmer(text)
                }
            } 
            value={password} placeholder="your password ..." label="Password of Farmer"
            secureTextEntry
            />
    <Text style={{color: 'white'}}>Longitude: {longitude}</Text>
    <Text style={{color: 'white'}}>Latitude: {latitude}</Text>
    <View style={styles.submitButtonView}>
        <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmitRegister()}>
            <Text style={ styles.submitText }>Submit</Text>
        </TouchableOpacity>
    </View>
    </ScrollView>
    </View>
    </SafeAreaView>);
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
    textErrorStyle: {
        marginTop: -10,
        marginBottom: 10
    },
    submitButton:{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        height: 50,
        marginTop: 40,
        backgroundColor: 'red',
        width: '50%',
        borderRadius: 30,
    },
    submitText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18
    },
    passwordTextField: {
        
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
      placeholderStyleAutoComplete: { fontSize: 16, color: 'gray' },
      textErrorStyleAutoComplete: { fontSize: 16 },

});