import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

const DashboardCard = ({ title, value }) => {

    return (
        <View style={styles.cardStyle}>
            <Text style={styles.valueText}>{ value }</Text>
            <Text style={styles.titleText}>{ title }</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    cardStyle : {
        width: '40%',
        height: 120,
        borderWidth: 1,
        marginHorizontal: 5,
        marginVertical: 10,
        borderRadius: 10,
        flexDirection: 'column',        
        justifyContent: 'center',
        alignContent: 'center'
    },
    titleText: {
        textAlign: 'center',
        fontSize: 12,
        fontFamily: 'Roboto'
    },
    valueText: {
        fontSize: 18,
        textAlign: 'center'
    }
})

export default DashboardCard;