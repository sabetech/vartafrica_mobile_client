/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { useContext, useEffect, useState } from 'react';
 import { SafeAreaView, StyleSheet, TextInput, ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';
 import { AuthContext } from '../context/AuthContext';
 import { login } from '../services/api';

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

     const loggedUser = await login({username, password});
     
     if (loggedUser.success){
        await setUser(loggedUser);
        console.log(loggedUser);
        navigation.navigate('Dashboard');
     } else {
        console.log("AN ERROR OCCURED");
     }
 }

     return (
         <SafeAreaView>
             <View style={styles.topView}>
                 <Text style={styles.text}>Vart Africa</Text>
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
                    <ActivityIndicator /> : <Text style={ styles.submitText }>Sign In</Text>
                }
                
            </TouchableOpacity>
            
        </SafeAreaView>
         );
 }

 const styles = StyleSheet.create({
     input: {
     height: 40,
     margin: 12,
     borderWidth: 1,
     padding: 10,
     },
     submitButton:{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        height: 50,
        marginTop: 40,
        backgroundColor: '#112233'
    },
     topView: {
         height: 100,
         display: 'flex',
         flexDirection: 'column',
         justifyContent: 'center',
         alignContent: 'center'
     },
     text: {
         alignSelf: 'center',
         fontSize: 32
     },
     submitText: {
        alignSelf: 'center',
        color: 'white'
     }

 });

