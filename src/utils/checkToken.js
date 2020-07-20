

import cookieServie from './cookieService'
function checkAccessToken() {
    const currentTime = new Date().getTime();
    const oldAccessToken = cookieServie.getAccessToken();
    const tokenRoulette = cookieServie.getToken();
    const checkExpriedToken = currentTime - tokenRoulette?.timestamp > 75168000000;
    if (
        oldAccessToken === undefined ||
        tokenRoulette === undefined ||
        checkExpriedToken
    ) {
        return true;
    } else {
        return false;
    }
}

export { checkAccessToken };
