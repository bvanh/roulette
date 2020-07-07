
import { api, baseLogin, refreshToken } from "../api/api";


function checkAccessToken() {
    const currentTime = new Date().getTime();
    const oldAccessToken = JSON.parse(localStorage.getItem("accessTokenRoulette"));
    const tokenRoulette = JSON.parse(localStorage.getItem("tokenRoulette"));
    const checkExpiredAccessToken = currentTime - oldAccessToken.timestamp < 3300000;
    const checkExpriedToken = currentTime - tokenRoulette.timestamp > 75168000000;
    if (oldAccessToken === null || checkExpriedToken || tokenRoulette === null) {
        return 'needLogin'
    } else if (checkExpiredAccessToken) {
        // getRefreshToken();
        getRefreshToken();
        // console.log(newAccessToken)
        return;
    } else {
        console.log(oldAccessToken);
        return oldAccessToken;
    }
}
const getRefreshToken = () => {
    const tokenRoulette = JSON.parse(localStorage.getItem("tokenRoulette"));
    refreshToken.post(api.REFRESH_TOKEN, {
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
        })
        .catch(error => {
            console.log(error)
        })
};
// function checkToken() {
//     if (checkAccessToken()) {
//         let demo = getRefreshToken();
//         // demo.then(val => dispatchSetAccessToken(val));
//     }
// }
export { checkAccessToken, getRefreshToken };
