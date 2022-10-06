import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { appStates, storageKeys } from '../constants';
const baseUrl = 'https://vartafrica.com/api/';

class Storage {

    static async clear(){
        await AsyncStorage.clear();
    }

    static async hasValidData(){
        if (!this.getData(storageKeys.FARMERS)) return false
        return true;
    }

    static async storeUser(user){
        try{
            await AsyncStorage.setItem(storageKeys.USER, JSON.stringify(user));
        }catch(e){
            throw new Error("Couldn't save local storage");
        }
        
    }

    static async getLoggedInUser(){
        const response = await AsyncStorage.getItem(storageKeys.USER);
            return response != null ? JSON.parse(response) : null
    }

    static async saveData(key, data) {
        try{
            const existingData = await this.getData(key);
            
            if (existingData === null) {
                await AsyncStorage.setItem(key, JSON.stringify([...data]));
            }
            
        }catch(e) {
            console.log(e.message());
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
        
        await AsyncStorage.setItem(key, JSON.stringify([...existingData, ...storage_data, {requestInfo: requestInfo}]));
                
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
            return new Error (e.message())
        }
    }

   static async syncOne(requestInfo) {
        try{
            switch (requestInfo.method) {
                case 'POST':
                    const post_req_reponse = await this.makePostRequest(requestInfo)
                    return post_req_reponse;
                case 'GET':
                    const get_req_response = await this.makeGetRequest(requestInfo)
                    return get_req_response;
            }
        }catch( e ){
            throw new Error( e.message() )
        }
    }

    static async syncParticularData(key){
        const existingdata = await this.getData(key);
        try{
            for(let j = 0;j < existingdata.length;j++) {
                
                if (existingdata[j]?.requestInfo == undefined) continue;

                const response = await this.syncOne(existingdata[j].requestInfo);
                await this.syncCleanUp(key, j, response);
            }
            const check = await this.checkIfParticularDataSynced(key)
            return {
                success: check
            }
        }catch( e ){
            throw new Error(e.message())
        }
    }

    static async checkIfParticularDataSynced(key) {
        const existingdata = await this.getData(key);

        for(let j = 0;j < existingdata.length;j++) {
            if (existingdata[j]?.requestInfo == undefined) continue;
            return false;
        }
        return true;
    }

    static async makePostRequest(requestInfo){
        
        console.log("BODY ",requestInfo.body)

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
            return response.json();
        } catch ( e ) {
            throw new Error(e.message());
        }
    }

    static async syncAll() {
         //get all the keys of the storage and then try to call 
         console.log("SYNCING IN PROGRESS...");
         await this.syncParticularData(storageKeys.FARMERS);
        try {
            const keys = await AsyncStorage.getAllKeys();

            for(let i = 0;i < keys.length;i++) {
                
                console.log("GETTING ...", keys[i]);

                const existingdata = await this.getData(keys[i]);

                for(let j = 0;j < existingdata.length;j++) {
                    
                    if (existingdata[j]?.requestInfo == undefined) {
                        continue;
                    }

                    const response = await this.syncOne(existingdata[j].requestInfo);
                    await this.syncCleanUp(keys[i], j, response);
                }
                console.log("DONE WITH->", keys[i]);
            }
            console.log("Syncing complete");
            const check = await this.checkIfSyncedAll();
            return {
                success: check
            }
        } catch(e) {
            console.log("error with sycing");
            throw new Error(e.message());
        }
    }

    static async logResponse(response, index, request) {
        
        console.log("Index=>", index, " Response:", response);
        console.log("REQUEST=>", request);

    }

    static async syncCleanUp(key, index, response) {
        const existingdata = await this.getData(key);
        if (response.success){
            delete existingdata[index]['requestInfo'];
            await AsyncStorage.setItem(key, JSON.stringify(existingdata));
        }
    }

    static async checkIfSyncedAll(){
        try {
            const keys = await AsyncStorage.getAllKeys();

            for(let i = 0;i < keys.length;i++) {
                console.log("CHECKING IF SYNCED...", keys[i]);
                const existingdata = await this.getData(keys[i]);

                for(let j = 0;j < existingdata.length;j++) {
                    if (existingdata[j]?.requestInfo == undefined) continue;
                    return false;
                }
                console.log("SYNCED: ", keys[i]);
            }
            return true;
        }catch(e){
            return false;
        }
    }



}

export default Storage;