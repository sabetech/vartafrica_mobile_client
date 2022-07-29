import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const baseUrl = 'http://vartafrica.com/api/';
class Storage {

    static saveUser(user) {

    }

    removeUser() {

    }

    static async clear(){
        await AsyncStorage.clear();
    }

    static async saveData(key, data) {
        try{
            const existingData = await this.getData(key);
            
            if (existingData === null) {
                await AsyncStorage.setItem(key, JSON.stringify([...data]));
            }
            
        }catch(e) {
            console.log(e.message);
        }
    }

    static async saveFormData(key, formRequestData) {
       const existingData = await this.getData(key);
       const {storage_data, requestInfo} = formRequestData;

       const _storevalue = {
        ...storage_data, requestInfo
       }

        if (existingData === null) {
            
        } else{
            await AsyncStorage.setItem(key, JSON.stringify([...existingData, _storevalue]));
        }
        
        const response = {
            success: true,
            message: requestInfo.message
        }
        return response;
    }

    static async saveFormDataArray(key, formRequestData){
        const existingData = await this.getData(key);
        const {storage_data, requestInfo} = formRequestData;

        //in this case, storage_data is an []
        const _storevalue = {
            ...storage_data[0], requestInfo
        }
        await AsyncStorage.setItem(key, JSON.stringify([...existingData, _storevalue]));

        if (storage_data.length > 1){
            for(let i = 1;i < storage_data.length;i++) {
                const _storevalue = {
                    ...storage_data[i]
                }
                await AsyncStorage.setItem(key, JSON.stringify([...existingData, _storevalue]));
            }
        }
        
        const response = {
            success: true,
            message: requestInfo.message
        }
        return response;
    }



    static async getData(key) {
        try {
            const response = await AsyncStorage.getItem(key)
            return response != null ? JSON.parse(response) : null
        }catch ( e ) {
            return new Error (e.message)
        }
    }

    syncOne(requestInfo) {
        switch (requestInfo.method) {
            case 'POST':
                makePostRequest(requestInfo)
            break;
            case 'GET':
                makeGetRequest(requestInfo)
            break;
        }
    }

    static async makePostRequest(requestInfo){
        try {
            const response = await fetch(`${baseUrl}${requestInfo.url}`, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(requestInfo.body),
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                }
            });

            
        } catch( e ){
            console.log("Did you fail? ", e.message());
           throw new Error(e.message());
        }
    }

    static async makeGetRequest(requestInfo) {
        try {
            const response = await axios({
                url: `${baseUrl}${requestInfo.url}`,
                method: 'GET',
                mode:'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                    'token': requestInfo.headers.token
                }
            });
            return response;
        } catch ( e ) {
            throw new Error(e.message());
        }
    }

    syncAll() {
         //get all the keys of the storage and then try to call 
         
         try {
            // const keys = await AsyncStorage.getAllKeys();



          } catch(e) {
            // read key error
          }
        
        //the remote server
    }


}

export default Storage;