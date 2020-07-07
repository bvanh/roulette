import axios from 'axios';
import qs from 'qs'
import querystring from "querystring"
import { access } from 'fs';
const api = {
    ROOT: "https://test.api.spin.3qz.clappigames.com",
    AUTH_LOGIN: "/auth/login",
    GET_CHARACTER: "/private/characters"
}
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
    const token = localStorage.getItem('accessTokenRoulette')
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + JSON.parse(token).accessToken;
        return config;
    }
}, error => {
    Promise.reject(error)
})

export { api, baseLogin, baseGetInfoCharacter }