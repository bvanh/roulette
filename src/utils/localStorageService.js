const localStorageService = {
    getAccessToken: () => {
        return JSON.parse(localStorage.getItem('accessTokenRoulette')).accessToken;
    }
}

export default localStorageService;