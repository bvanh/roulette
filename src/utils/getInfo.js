import { api, baseGetInfoCharacter, baseLogin } from "../api/api";
import qs from "qs";
const getInfoCharacter = () => {
    return baseGetInfoCharacter.get(api.GET_CHARACTER)
        .then(response => {
            return response;
        })
        .catch(e => {
            return e.response;
        })
}
const getInfoSpin = (params) => {
    return baseGetInfoCharacter
        .post(api.GET_INFO_SPIN, params)
        .then(response => {
            console.log(response)
            return response;
        })
        .catch(e => {
            console.log(e.response)
        })
}
const getResultSpin = (params) => {
    return baseGetInfoCharacter
        .post(api.GET_RESULT_SPIN, params)
        .then(res => {
            console.log(res);
            return res;
        })
        .catch(e => {
            console.log(e.response)
        })
}
export { getInfoCharacter, getInfoSpin, getResultSpin };