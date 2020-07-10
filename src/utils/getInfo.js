import { api, baseGetInfoCharacter, baseLogin } from "../api/api";
import qs from "qs";
const getInfoCharacter = () => {
    return baseGetInfoCharacter.get(api.GET_CHARACTER)
        .then(response => {
           return response;
        })
        .catch(e => {
             console.log(e);
        })
}
const getInfoSpin = (params) => {
    return baseGetInfoCharacter
        .post(api.GET_INFO_SPIN, qs.stringify(params))
        .then(response => {
            return response;
        })
        .catch(e => {
            console.log(e)
        })
}
const getResultSpin = (params) => {
    return baseGetInfoCharacter
        .post(api.GET_RESULT_SPIN, qs.stringify(params))
        .then(res => {
            console.log(res);
            return res;
        })
        .catch(e => {
            console.log(e.response)
        })
}
export { getInfoCharacter, getInfoSpin, getResultSpin };