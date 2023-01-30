/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { useContext, useEffect, useState } from 'react';
 import { SafeAreaView, StyleSheet, TextInput, ActivityIndicator, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
 import { TextInput as Ti} from 'react-native-element-textinput';
 import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
 import { login } from '../services/api';
import Storage from '../services/storage';
const appColor = "#000b6e";
 export default function Login ({ navigation }) {

    const { user, setUser } = useContext(AuthContext);

    const [username, onChangeUsername] = useState('');
    const [password, onChangePassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isSubscribed = true
        if (isSubscribed)
        if (user != null) navigation.navigate('Dashboard');

        return (() =>{
            isSubscribed = false;
        });
    });

 const signIn = async () => {
     //authenticate get a token and move on
     setLoading(true);
     if (user != null) navigation.navigate('Dashboard');
    try{
     const loggedUser = await login({username, password});
     
     if (loggedUser.success){
        await setUser(loggedUser);
        Storage.storeUser(loggedUser);
        
        setLoading((prev) => false);
        navigation.navigate('Dashboard');
     } else {
        Alert.alert("Failure", "Login Failed", [
            { text: "OK", onPress: () => {
                setLoading(prev => false);
            } }
        ])
     }
     
    }catch( e ) {
        Alert.alert("Failure", "Network issue!",
        [
            { text: "OK", onPress: () => {
                setLoading(prev => false);
            } }
        ])
    }
     
 }

     return (
         <SafeAreaView style={styles.background}>
             <View style={styles.topView}>
                <Image
                    style={styles.tinyLogo}
                    source={ require('../assets/vart_logo_white.png') }
                />
                <Image
                    style={styles.profileIcon}
                    source={ require('../assets/user.png') }
                />
             </View>
            <TextInput style={styles.input} onChangeText={onChangeUsername} value={username} placeholder="Username"/>
            <Ti
                style={styles.passwordInput}
                onChangeText={onChangePassword}
                value={password}
                placeholderTextColor='#cccccc'
                placeholder="Password"
                secureTextEntry={true}
            />
            <Text style={styles.tagline}>A Passion for Problem Solving</Text>
            <TouchableOpacity style={styles.submitButton} onPress={signIn}>
                {
                    loading ? 
                    <ActivityIndicator color={'white'} /> : <Text style={ styles.submitText }>Login</Text>
                }
            </TouchableOpacity>
            
        </SafeAreaView>
         );
 }

 const styles = StyleSheet.create({
    background: {
        height: '100%',
        backgroundColor: appColor
    },
     input: {
     height: 40,
     margin: 12,
     borderWidth: 1,
     padding: 10,
     borderRadius: 10,
     backgroundColor: 'white',
     color: 'black'
     },
     passwordInput:{
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        height: 40,
        margin: 12,
        paddingHorizontal: 10
     }, 
     submitButton:{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        height: 50,
        marginTop: 20,
        backgroundColor: 'red',
        margin: 12,
        borderRadius: 50,
        width: '40%'
    },
     topView: {
         height: 150,
         display: 'flex',
         justifyContent: 'center',
         alignContent: 'center',
         marginBottom: 60,
         marginTop: 140
     },
     text: {
         alignSelf: 'center',
         fontSize: 32
     },
     tinyLogo: {
        width: 250,
        height: 80,
        justifyContent: 'center',
        alignSelf: 'center'
      },
      profileIcon: {
        marginTop: 40,
        width: 100,
        height: 110,
        justifyContent: 'center',
        alignSelf: 'center'
      },
      tagline: {
        alignSelf: 'center',
        color: 'white',
        marginVertical: 10
      },
     submitText: {
        alignSelf: 'center',
        color: 'white'
     }
 });

