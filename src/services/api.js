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
            mode: 'no-cors',
            body: JSON.stringify(newFarmer),
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        });
        return response.json();
    } catch( e ){
       throw new Error(e.message());
    }
}

export const getFarmersByAgent = async (token) => {
    try {
        const response = await axios({
            url: `${baseUrl}farmerslist`,
            method: 'GET',
            mode:'no-cors',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        });

        return response.data;
    } catch ( e ) {
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

export const getOrdersByAgent = async (token) => {
    try {
        const response = await axios({
            url: `${baseUrl}orderlist`,
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

export const getUsedCardsByAgent = async (token) => {
    try {
        const response = await axios({
            url: `${baseUrl}cardused`,
            method: 'GET',
            mode:'no-cors',
            headers: {
                'Content-Type': 'application/json',
                'token': token
              }
        });
        
        return response.data;
    }catch( e ){
        throw new Error(e.message);
    }
}

export const getListOfDeductions = async (token) => {
    try {
        const response = await axios({
            url: `${baseUrl}deductionlist`,
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

export const saveOrderByAgentAPI = async (order, token) => {
    try{
        console.log(token);
        const response = await fetch(`${baseUrl}register`, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(order),
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        });
        return response.json();
    }catch( e ) {
        console.log(e.message());
        throw new Error(e.message());
    }
}

export const saveFarmerDebitAPI = async (debit, token) => {
    try {
        const response = await fetch (`${baseUrl}debit`, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(debit),
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        });
        return response.json();
    }catch ( e ) {
        throw new Error(e.message());
    }
}

export const rechargeAPI = async (rechargeInfo, token) => {
    try {
        const response = await fetch (`${baseUrl}recharge`, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(rechargeInfo),
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        });
        return response.json();
    }catch ( e ) {
        throw new Error(e.message());
    }
}

export const getListOfCrops = async (token) => {
    try {
        
        const response = await axios({
            url: `${baseUrl}crop`,
            method: 'GET',
            mode:'no-cors',
            headers: {
                'Content-Type': 'application/json',
                'token': token
              }
        });
        
        return response.data;


    } catch ( err ) {
        throw new Error(err.message());
    }
}

export const getListOfvariety = async (token) => {
    try {
        
        const response = await axios({
            url: `${baseUrl}variety`,
            method: 'GET',
            mode:'no-cors',
            headers: {
                'Content-Type': 'application/json',
                'token': token
              }
        });
        return response.data;


    } catch ( err ) {
        throw new Error(err.message());
    }
}