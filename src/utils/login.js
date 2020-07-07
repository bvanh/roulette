import { api, baseLogin, baseGetInfoCharacter } from "../api/api";
import qs from "qs";
const login = (params) => {
    baseLogin
        .post(api.AUTH_LOGIN, qs.stringify(params))
        .then((response) => {
            console.log(response);
            let userToken = { token: response, timestamp: new Date().getTime() };
            let userAccessToken = {
                accessToken: response.accessToken,
                timestamp: new Date().getTime(),
            };
            localStorage.setItem("tokenRoulette", JSON.stringify(userToken));
            localStorage.setItem(
                "accessTokenRoulette",
                JSON.stringify(userAccessToken)
            );
        })
        .catch((error) => {
            console.log(error.response);
        });
};
const getInfoCharacter = () => {
    baseGetInfoCharacter.get(api.GET_CHARACTER)
        .then(response => {
            console.log(response)
        })
        .catch(e => {
            console.log(e.response)
        })
}
export { login, getInfoCharacter };
