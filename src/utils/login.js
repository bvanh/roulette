import { baseLogin, baseGetInfoCharacter } from "../api/baseApi";
import qs from "qs";
import cookieService from "./cookieService";
const login = (path, params, username) => {
    return baseLogin
        .post(path, qs.stringify(params))
        .then((response) => {
            // console.log(response)
            const { data } = response
            cookieService.setToken({ ...data, username: username.username }, data.accessToken)
            return response;
        })
        .catch((error) => {
            return error.response;
        });
};
export { login };
