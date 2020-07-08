import { api, baseLogin, refreshToken } from "../api/api";
import { Modal } from 'antd';
function errorAlert() {
    Modal.error({
        title: 'Có một số lỗi xảy ra !',
        content: 'Đăng nhập lại',
    });
}

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
        errorAlert();
        return false;
    } else {
        return true;
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
// function checkToken() {
//     if (checkAccessToken()) {
//         let demo = getRefreshToken();
//         // demo.then(val => dispatchSetAccessToken(val));
//     }
// }
export { checkAccessToken, getRefreshToken };
