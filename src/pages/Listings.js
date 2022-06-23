import React, { useEffect } from "react";
import { View, Text } from "react-native";

export default function Listings ({ route, navigation }) {
    
    useEffect(() => {
        const { title } = route.params;    
        navigation.setOptions({headerTitle: title, headerShown: true});
    },[]);

    return (
        <View>
            <Text>
                listings page
            </Text>
        </View>
    )
}