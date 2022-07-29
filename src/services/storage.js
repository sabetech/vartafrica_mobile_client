import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const baseUrl = 'http://vartafrica.com/api/';
class Storage {

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

   static async syncOne(requestInfo) {
    console.log("SYnc One called");
    console.log("METHOD ", requestInfo.method);

        switch (requestInfo.method) {
            case 'POST':
                return await this.makePostRequest(requestInfo)
            
            case 'GET':
                return await this.makeGetRequest(requestInfo)
           
        }
    }

    static async makePostRequest(requestInfo){
        console.log("Make post request made ...");
        console.log("URL: ",requestInfo.url);
        try {
            const response = await fetch(`${baseUrl}${requestInfo.url}`, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(requestInfo.body),
                headers: {
                    'Content-Type': 'application/json',
                    'token': requestInfo.headers.token
                }
            });
            return response.json();
   
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
            await console.log(response.json())
            return response.json();
        } catch ( e ) {
            throw new Error(e.message());
        }
    }

    static async syncAll() {
         //get all the keys of the storage and then try to call 
         console.log("SYNCING IN PROGRESS...");
        try {
            const keys = await AsyncStorage.getAllKeys();

            for(let i = 0;i < keys.length;i++) {
                
                console.log("GETTING ...", keys[i]);

                const existingdata = await this.getData(keys[i]);

                for(let j = 0;j < existingdata.length;j++) {
                    
                    if (existingdata[j]?.requestInfo == undefined) continue;

                    const response = await this.syncOne(existingdata[j].requestInfo);
                    await this.logResponse(response, j, existingdata[j].requestInfo);
                }
            }
            console.log("SYNCING DONE!!!");
        } catch(e) {
            console.log("SYNCING ERROR!!!");
            console.log("SYNCING EXECPTION ",e.message);
        }
    }

    static async logResponse(response, index, request) {
        
        console.log("Index=>", index, " Response:", response);
        console.log("REQUEST=>", request);

    }



}

export default Storage;