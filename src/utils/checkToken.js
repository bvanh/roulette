
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

export { checkAccessToken};
