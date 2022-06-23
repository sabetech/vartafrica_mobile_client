import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from "react-native";
import { TextInput } from 'react-native-element-textinput';
import Geolocation from 'react-native-geolocation-service';
import { AuthContext } from "../context/AuthContext";
import { useDispatch, useSelector } from 'react-redux';
import { registerFarmerThunk, getStatus, setIdle } from '../redux/vartafrica';
import { Picker } from '@react-native-picker/picker';
import { PermissionsAndroid } from 'react-native';


export default function RegisterFarmer({ navigation }) {
    const { user } = useContext(AuthContext);
    const [first_name, setFirstname] = useState("sample");
    const [last_name, setLastname] = useState("test here");
    const [user_name, setUsername] = useState("jiaofe_5");
    const [country_code, setCountryCode] = useState("+234");
    const [mobileNumber, setMobileNumber] = useState("89437433");
    const [age, setAge] = useState("24");
    const [sex, setSex] = useState("male");
    const [village, setVillage] = useState("amanfj");
    const [parish, setParish] = useState("parishfe");
    const [sub_county, setSubCounty] = useState("aijeo");
    const [district, setDistrict] = useState("disitu");
    const [country, setCountry] = useState("ugaha");
    const [next_of_kin_name, setNameOfNextKin] = useState("Jiuoife");
    const [next_of_kin_phone, setMobileNumberOfNextKin] = useState("242353");
    const [password, setPasswordOfFarmer] = useState("asdfasdf");
    const [latitude, setLatitude] = useState("loading ...");
    const [longitude, setLongitude] = useState("loading ...");
    const [disability_status, setDisabilityStatus] = useState("no");
    const [land_area, setLandarea] = useState("123");
    const [mechanization_needed, setMechanizationNeeded] = useState("yes");
    const [fertilizer, setFertilizer] = useState("affe");
    const dispatch = useDispatch();
    const status = useSelector(getStatus);

    useEffect(() => {
        let isSubscribed = true;
        getCurrentPosition((result) => {
            if (isSubscribed) {
                setLongitude(result.position.coords.longitude);
                setLatitude(result.position.coords.latitude);
            }            
        });
        return (() => {
            isSubscribed = false;
        });

    }, []);

    useEffect(() => {
        console.log(status)
        if (status == 'register-farmer-success'){
            Alert.alert("Success", "Farmer Registered Successfully");
            dispatch(setIdle());
            
        }
        console.log(status);
        if (status == 'idle') {
            navigation.goBack();
        }

        if (status == 'loading'){
            Alert.alert("Loading ...", "Saving Farmer ...");
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
      
    const handleSubmitRegister = () => {
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

    return (<View style={{padding: 10, flex: 1}}>
        <Text >Register Farmer</Text>
        <ScrollView >
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

        <TextInput style={styles.input} 
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            onChangeText={(text) => setCountryCode(text)} value={country_code} placeholder="+235" label="Country Code" />

        <TextInput style={styles.input} 
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            onChangeText={(text) => setMobileNumber(text)} value={mobileNumber} placeholder="+235" label="Mobile Number" />

        <Text>Select Sex</Text>
        <Picker
            prompt={"Choose Sex"}
            selectedValue={sex}
            onValueChange={(itemValue, itemIndex) =>
                setSex(itemValue)
            }
        >
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
        </Picker>

        <TextInput style={styles.input} 
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            onChangeText={(text) => setAge(text)} value={age} placeholder="29" label="Age" />

        <TextInput style={styles.input} 
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            onChangeText={(text) => setVillage(text)} value={village} placeholder="Village" label="Village" />
            
            <TextInput style={styles.input} 
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            onChangeText={(text) => setParish(text)} value={parish} placeholder="Parish ..." label="Parish" />

        <TextInput style={styles.input} 
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            onChangeText={(text) => setSubCounty(text)} value={sub_county} placeholder="Sub County ..." label="Sub County" />

        <TextInput style={styles.input} 
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            onChangeText={(text) => setDistrict(text)} value={district} placeholder="District ..." label="District" />

        <TextInput style={styles.input} 
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            onChangeText={(text) => setCountry(text)} value={country} placeholder="Country here" label="Country" />

        <TextInput style={styles.input} 
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            onChangeText={(text) => setNameOfNextKin(text)} value={next_of_kin_name} placeholder="Name of Next Of Kin" label="Name of Next of Kin" />

        <TextInput style={styles.input} 
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            onChangeText={(text) => setMobileNumberOfNextKin(text)} value={next_of_kin_phone} placeholder="+235" label="Mobile Number of Next of Kin" />

        <TextInput style={styles.input} 
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            onChangeText={(text) => setLandarea(text)} value={land_area} placeholder="132" label="Land Area" />

        <TextInput style={styles.input} 
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            onChangeText={(text) => setFertilizer(text)} value={fertilizer} placeholder="Fertilizer" label="Fertilizer" />

        <Text>Disabled?</Text>
        <Picker
            prompt={"Disabled?"}
            selectedValue={disability_status}
            onValueChange={(itemValue, itemIndex) =>
                setDisabilityStatus(itemValue)
            }
        >
        <Picker.Item label="Yes" value="yes" />
        <Picker.Item label="No" value="no" />
        </Picker>

        <Text>Mechanization Needed</Text>
        <Picker
            prompt={"Mechanization Needed"}
            selectedValue={mechanization_needed}
            onValueChange={(itemValue, itemIndex) =>
                setMechanizationNeeded(itemValue)
            }
        >
        <Picker.Item label="Yes" value="yes" />
        <Picker.Item label="No" value="no" />
        </Picker>

        <TextInput style={styles.input} 
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            onChangeText={(text) => setPasswordOfFarmer(text)} 
            value={password} placeholder="your password ..." label="Password of Farmer"
            secureTextEntry
            />
    <Text>Longitude: {longitude}</Text>
    <Text>Latitude: {latitude}</Text>
    <View style={styles.submitButtonView}>
        <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmitRegister()}>
            <Text style={ styles.submitText }>Submit</Text>
        </TouchableOpacity>
    </View>
    </ScrollView>


    </View>);
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
    passwordTextField: {
        
    }

});