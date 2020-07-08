import { api, baseLogin, baseGetInfoCharacter } from "../api/api";
import qs from "qs";
const login = (params) => {
   return baseLogin
        .post(api.AUTH_LOGIN, qs.stringify(params))
        .then((response) => {
            let userToken = { token: { ...response.data, ...params }, timestamp: new Date().getTime() };
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
