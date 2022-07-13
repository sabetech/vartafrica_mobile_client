import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const baseUrl = 'http://vartafrica.com/api/';
class Storage {

    saveUser(user) {

    }

    removeUser() {

    }

    static async saveData(key, data) {
        try{
            await AsyncStorage.setItem(key, JSON.stringify(data));
            const response = {
                success: true,
                message: data.requestInfo.message
            }
            return response;
        }catch(e) {

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

    static makePostRequest(requestInfo){
        try {
            const response = await fetch(`${baseUrl}${requestInfo.url}`, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(newFarmer),
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

    static makeGetRequest(requestInfo) {
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

        //the remote server
    }


}

export default Storage;