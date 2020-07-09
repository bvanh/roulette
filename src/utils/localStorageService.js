const localStorageService = {
    getAccessToken: () => {
        return JSON.parse(localStorage.getItem('accessTokenRoulette')).accessToken;
    },
    getToken: () => {
        return JSON.parse(localStorage.getItem('tokenRoulette'))?.token;
    },
    resetToken: () => {
        localStorage.removeItem("tokenRoulette");
        localStorage.removeItem("accessTokenRoulette")
    }
}

export default localStorageService;