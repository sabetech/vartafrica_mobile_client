import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
const MainMenuItem = ({ navigation, title }) => {

    const handleMenuItemPress = () => {        
        navigation.navigate('Listings', {
            title: title
        });
    }

    return (
        <View style={styles.mainMenuButton}>
            <TouchableOpacity onPress={() => handleMenuItemPress()} style={styles.buttonStyle}>
                <Text style={ styles.textStyle }>{ title }</Text>
            </TouchableOpacity>
        </View>
    )   
}

const styles =  StyleSheet.create({
    mainMenuButton: {
        borderRadius: 10,
        marginHorizontal: 10,
        width: 140
    },
    textStyle: {
        textAlign: "center",
        color: "black",
        fontSize: 16,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonStyle: {
        elevation: 8,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 12,
        height: 60,
        width: '100%',
        marginVertical: 15        
    }
    
}); 

export default MainMenuItem;