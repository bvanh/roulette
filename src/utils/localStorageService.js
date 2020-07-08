const localStorageService = {
    getAccessToken: () => {
        return JSON.parse(localStorage.getItem('accessTokenRoulette')).accessToken;
    },
    getToken:()=>{
        return JSON.parse(localStorage.getItem('tokenRoulette'))?.token;
    }
}

export default localStorageService;