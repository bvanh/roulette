import axios from 'axios';
import qs from 'qs'
import querystring from "querystring"
import { access } from 'fs';
import { checkAccessToken, getRefreshToken } from '../utils/checkToken';
import localStorageService from '../utils/localStorageService'
const api = {
    ROOT: "https://test.api.spin.3qz.clappigames.com",
    AUTH_LOGIN: "/auth/login",
    GET_CHARACTER: "/private/characters",
    GET_INFO_SPIN: "/private/info",
    GET_RESULT_SPIN: "/private/spin",
    REFRESH_TOKEN: "/auth/renew/access"
}
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
})
baseGetInfoCharacter.interceptors.request.use(async (config) => {
    const isValidToken = await checkAccessToken();
    const token = localStorageService.getAccessToken();
    if (token && isValidToken) {
        config.headers['Authorization'] = 'Bearer ' + token;
        return config;
    }
}, error => {
    throw error;
})
baseGetInfoCharacter.interceptors.response.use(response => {
    return response.data;
}, function (error) {
    console.log(error)
    const originalRequest = error.response.config;
    if (error.response.status !== 401) {
        // console.log(error)
        return Promise.reject(error);
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
export { api, baseLogin, baseGetInfoCharacter, refreshToken }