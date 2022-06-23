import React from 'react';
import { StyleSheet } from 'react-native';
import { CardViewWithIcon } from "react-native-simple-card-view";

const DashboardCard = ({title, value, icon}) => {

    return <CardViewWithIcon  
    withBackground={ true }
    androidIcon={ 'md-jet' }
    title={ title }
    contentFontSize={ 20 }
    titleFontSize={ 15 }
    content={ value + '' }
    style={styles.cardStyle}
    roundedIconBg={true}
    />
}

const styles = StyleSheet.create({
    cardStyle : {
        width: '90%',
    }
})

export default DashboardCard;