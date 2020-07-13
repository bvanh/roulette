import { baseLogin, baseGetInfoCharacter } from "../api/baseApi";
import qs from "qs";
const login = (path, params, username) => {
    return baseLogin
        .post(path, qs.stringify(params))
        .then((response) => {
            let userToken = { token: { ...response.data, ...username }, timestamp: new Date().getTime() };
            let userAccessToken = {
                accessToken: response.data.accessToken,
                timestamp: new Date().getTime(),
            };
            localStorage.setItem("tokenRoulette", JSON.stringify(userToken));
            localStorage.setItem(
                "accessTokenRoulette",
                JSON.stringify(userAccessToken)
            );
            return response;
        })
        .catch((error) => {
            return error.response;
        });
};
export { login };
