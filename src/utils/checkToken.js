import { api, baseLogin, refreshToken } from "../api/api";

function checkAccessToken() {
    const currentTime = new Date().getTime();
    const oldAccessToken = JSON.parse(
        localStorage.getItem("accessTokenRoulette")
    );
    const tokenRoulette = JSON.parse(localStorage.getItem("tokenRoulette"));
    const checkExpriedToken = currentTime - tokenRoulette?.timestamp > 75168000000;
    if (
        oldAccessToken === null ||
        tokenRoulette === null ||
        checkExpriedToken
    ) {
        return true;
    } else {
        return false;
    }
}
const getRefreshToken = () => {
    const tokenRoulette = JSON.parse(localStorage.getItem("tokenRoulette"));
    refreshToken
        .post(api.REFRESH_TOKEN, {
            refreshToken: tokenRoulette.token.refreshToken,
        })
        .then((response) => {
            console.log(response.data);
            let userAccessToken = {
                accessToken: response.data.accessToken,
                timestamp: new Date().getTime(),
            };
            localStorage.setItem(
                "accessTokenRoulette",
                JSON.stringify(userAccessToken)
            );
        })
        .catch((error) => {
            console.log(error);
        });
};

export { checkAccessToken, getRefreshToken };
