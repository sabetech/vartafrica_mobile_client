import React, { useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
const MainMenuItem = ({ navigation, title }) => {

    const handleMenuItemPress = () => {        
        navigation.navigate('Listings', {
            title: title
        });
    }

    return (
        <View style={styles.mainMenuButton}>
            <TouchableOpacity onPress={() => handleMenuItemPress()}>
                <Text style={ styles.textStyle }>{ title }</Text>
            </TouchableOpacity>
        </View>
    )   
}

const styles =  StyleSheet.create({
    mainMenuButton: {
        borderWidth: 1,
        borderRadius: 10,
        height: 70,
        width: 75,
        marginHorizontal: 10,
        justifyContent:'center'
    },
    textStyle: {
        textAlign: 'center',
    }
}); 

export default MainMenuItem;