import axios from 'axios';
import localStorageService from '../utils/localStorageService'
import api from './apiUrl'
// refreshToken
const refreshToken = axios.create({
    baseURL: api.ROOT
})
const baseLogin = axios.create({
    baseURL: api.ROOT,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
})
// login
baseLogin.interceptors.response.use((response) => {
    if (response && response.data) {
        return response;
    }
    return response;
}, error => {
    console.log(error.response)
    throw error;
})
// getInforCharacter
const baseGetInfoCharacter = axios.create({
    baseURL: api.ROOT,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
})
baseGetInfoCharacter.interceptors.request.use((config) => {
    const token = localStorageService.getAccessToken();
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
        return config;
    }
}, error => {
    return error
})
baseGetInfoCharacter.interceptors.response.use(response => {
    return response;
}, function (error) {
    const originalRequest = error.response.config;
    if (error.response.status !== 401) {
        // console.log(error)
        return error.response;
    }
    const tokenRoulette = JSON.parse(localStorage.getItem("tokenRoulette"));
    return refreshToken.post(api.REFRESH_TOKEN, {
        "refreshToken": tokenRoulette.token.refreshToken
    })
        .then(response => {
            console.log(response)
            let userAccessToken = {
                accessToken: response.data.accessToken,
                timestamp: new Date().getTime(),
            };
            localStorage.setItem(
                "accessTokenRoulette",
                JSON.stringify(userAccessToken)
            );
            originalRequest.headers['Authorization'] = 'Bearer ' + response.data.accessToken;
            return axios(originalRequest);
        }).catch(error => {
            /*destroyToken();*/
            console.log(error)
            return Promise.reject(error);
        })

})
export {baseLogin, baseGetInfoCharacter, refreshToken }