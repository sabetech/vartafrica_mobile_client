import axios from "axios";
const baseUrl = 'http://vartafrica.com/api/';
export const login = async ({username, password}) => {
    try{
        const response = await fetch(`${baseUrl}sign_in`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                              },
                            body: JSON.stringify({
                                email: username,
                                password: password
                            })
                        });
        return response.json();
    }catch( e ){
        throw new Error(e.message())
    }
}

export const registerFarmer = async (newFarmer, token) => {
    
    try {
        const response = await fetch(`${baseUrl}registerfarmer`, {
            method: 'POST',
            mode:'no-cors',
            body: JSON.stringify(newFarmer),
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        });
        return response.json();
    } catch( e ){
        console.log("Did you fail? ", e.message());
       throw new Error(e.message());
    }
}

export const getDashboardValues = async (token) => {
    try {
        const response = await axios({
            url: `${baseUrl}dashboard`,
            method: 'GET',
            mode:'no-cors',
            headers: {
                'Content-Type': 'application/json',
                'token': token
              }
        });
        
        return response.data;
    }catch( e ){
        throw new Error(e.message());
    }
}