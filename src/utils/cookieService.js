import Cookies from 'js-cookie'
const cookieService = {
    setToken: (token, accessToken) => {
        Cookies.set("tokenRoulette", token, { expires: 60, secure: true });
        Cookies.set("accessTokenRoulette", accessToken, { secure: true });
    },
    getAccessToken: () => {
        return Cookies.get('accessTokenRoulette');
    },
    getToken: () => {
        if (Cookies.get('tokenRoulette')) {
            return JSON.parse(Cookies.get('tokenRoulette'));
        } else {
            return false;
        }
    },
    resetToken: () => {
        Cookies.remove("tokenRoulette");
        Cookies.remove("accessTokenRoulette");
    },
};

export default cookieService;
