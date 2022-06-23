import React from "react";
import { View } from "react-native";
import { TextInput } from "react-native-element-textinput";

export default function NewFarmerDebit({ navigation }) {

    return (
        <View>
            <TextInput 
                label="Select a Farmer here"
            />
            <TextInput 
                label="Amount (UGX)"
            />
        </View>
    );

}