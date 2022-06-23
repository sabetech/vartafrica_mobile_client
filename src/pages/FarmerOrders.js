import React, { useState } from "react";
import {Picker} from '@react-native-picker/picker';
import { TextInput } from "react-native-element-textinput";
export default function FarmerOrders () {
    const [selectedFarmer, setSelectedFarmer] = useState();
    //load farmers from remote api ...

    return (
        <View>
            <Picker
                selectedValue={selectedFarmer}
                onValueChange={(itemValue, itemIndex) =>
                    setSelectedFarmer(itemValue)
                }>
                <Picker.Item label="Java" value="java" />
                <Picker.Item label="JavaScript" value="js" />
            </Picker>

            <TextInput label="Crop Cultivated" />
            <TextInput label="Variety" />
            <TextInput label="Seed Quantity" />
            <TextInput label="Crop Cultivated" />
            <TextInput label="Unit Price (UGX)" />
            <TextInput label="Total Price (UGX)" />
            <TextInput label="Discounted Value per Unit (UGX)" />
            <TextInput label="Net Order Value (UGX)" />
            <TextInput label="Total Savings Goal (UGX)" />
            <button>Submit</button>


        </View>
    );
}