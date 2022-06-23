import React, { useState } from "react";
import { View } from "react-native";
import { TextInput } from "react-native-element-textinput";

export default function CardRecharge ({ navigation }) {

    return (
        <View>
            <TextInput label="Phone Number" />
            <TextInput label="Scratch Card Number" />
        </View>
    )
}