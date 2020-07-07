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
    REFRESH_TOKEN: "/auth/renew/access"
}
const refreshToken = axios.create({
    baseURL: api.ROOT
})
const baseLogin = axios.create({
    baseURL: api.ROOT,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
})
baseLogin.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data;
    }
    return response;
}, error => {
    console.log(error.response)
    throw error;
})
const baseGetInfoCharacter = axios.create({
    baseURL: api.ROOT,
})
baseGetInfoCharacter.interceptors.request.use(config => {
    const token = localStorage.getItem('accessTokenRoulette');
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + JSON.parse(token).accessToken;
        return config;
    }
}, error => {
    Promise.reject(error)
})
baseGetInfoCharacter.interceptors.response.use(response => {
    return response;
}, function (error) {
    const originalRequest = error.config;

    //     if (error.response.status === 401 && originalRequest.url === 
    //  'http://13.232.130.60:8081/v1/auth/token) {
    //         router.push('/login');
    //         return Promise.reject(error);
    //     }

    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const tokenRoulette = JSON.parse(localStorage.getItem("tokenRoulette"));
        return refreshToken.post(api.REFRESH_TOKEN, {
            "refreshToken": tokenRoulette.token.refreshToken
        })
            .then(response => {
                console.log(response.data)
                let userAccessToken = {
                    accessToken: response.data.accessToken,
                    timestamp: new Date().getTime(),
                };
                localStorage.setItem(
                    "accessTokenRoulette",
                    JSON.stringify(userAccessToken)
                );
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorageService.getAccessToken();
                return axios(originalRequest);
            })
    }
    return Promise.reject(error);
})
export { api, baseLogin, baseGetInfoCharacter, refreshToken }