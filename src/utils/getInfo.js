import { baseGetInfoCharacter, baseLogin } from "../api/baseApi";
import api from "../api/apiUrl";
import qs from "qs";
const getInfoCharacter = () => {
    return baseGetInfoCharacter
        .get(api.GET_CHARACTER)
        .then((response) => {
            return response;
        })
        .catch((e) => {
            console.log(e);
        });
};
const getInfoSpin = (params) => {
    return baseGetInfoCharacter
        .post(api.GET_INFO_SPIN, qs.stringify(params))
        .then((response) => {
            return response;
        })
        .catch((e) => {
            return e;
        });
};
const getResultSpin = (params) => {
    return baseGetInfoCharacter
        .post(api.GET_RESULT_SPIN, qs.stringify(params))
        .then((res) => {
            return res;
        })
        .catch((e) => {
            return e;
        });
};
const getHistorySpin = (params) => {
    return baseGetInfoCharacter
        .post(api.GET_HISTORY_SPIN, qs.stringify(params))
        .then((res) => {
            return res;
        })
        .catch((e) => {
            return e;
        });
};
export { getInfoCharacter, getInfoSpin, getResultSpin, getHistorySpin };
