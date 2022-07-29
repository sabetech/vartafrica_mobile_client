/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { useContext, useEffect, useState } from 'react';
 import { SafeAreaView, StyleSheet, TextInput, ActivityIndicator, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
 import { AuthContext } from '../context/AuthContext';
 import { login } from '../services/api';
 import Storage from '../services/storage';

 export default function Login ({ navigation }) {

    const { user, setUser } = useContext(AuthContext);
    const [username, onChangeUsername] = useState('testagent@gmail.com');
    const [password, onChangePassword] = useState('Greatminds1@');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user != null) navigation.navigate('Dashboard');
    });

 const signIn = async () => {
     //authenticate get a token and move on
     setLoading(true);
     if (user != null) navigation.navigate('Dashboard');
    try{
     const loggedUser = await login({username, password});
     
     if (loggedUser.success){
        await setUser(loggedUser);
        console.log(loggedUser);
        navigation.navigate('Dashboard');
     } else {
        Alert.alert("Failure", "Login Failed")
     }
    }catch( e ) {
        Alert.alert("Failure", "No internet!")
    }
     
 }

     return (
         <SafeAreaView>
             <View style={styles.topView}>
                <Image
                    style={styles.tinyLogo}
                    source={ require('../assets/logo_simple.png') }
                />
                 
             </View>
            <TextInput style={styles.input} onChangeText={onChangeUsername} value={username} placeholder="Username"/>
            <TextInput
                style={styles.input}
                onChangeText={onChangePassword}
                value={password}
                placeholder="Password"
                secureTextEntry={true}
            />
            <TouchableOpacity style={styles.submitButton} onPress={signIn}>
                {
                    loading ? 
                    <ActivityIndicator color={'white'} /> : <Text style={ styles.submitText }>Sign In</Text>
                }
            </TouchableOpacity>
            
        </SafeAreaView>
         );
 }

 const styles = StyleSheet.create({
    loader: {

    },
     input: {
     height: 40,
     margin: 12,
     borderWidth: 1,
     padding: 10,
     borderRadius: 10
     },
     submitButton:{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        height: 50,
        marginTop: 40,
        backgroundColor: '#28166A',
        margin: 12,
        borderRadius: 10
    },
     topView: {
         height: 100,
         display: 'flex',
         justifyContent: 'center',
         alignContent: 'center',
         marginBottom: 100,
         marginTop: 50
     },
     text: {
         alignSelf: 'center',
         fontSize: 32
     },
     tinyLogo: {
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignSelf: 'center'
      },
     submitText: {
        alignSelf: 'center',
        color: 'white'
     }

 });

