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
        height: 90,
        elevation: 3,
        marginHorizontal: 5,
        marginVertical: 10,
        borderRadius: 10,
        flexDirection: 'column',        
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#01084a'

    },
    titleText: {
        textAlign: 'center',
        fontSize: 18,
        fontFamily: 'Roboto',
        color: 'white'
    },
    valueText: {
        fontSize: 21,
        textAlign: 'center',
        color: 'yellow'
    }
})

export default DashboardCard;