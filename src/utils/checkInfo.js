const listError = {
    ACCOUNT_ERROR: "ĐĂNG NHẬP TRƯỚC KHI QUAY !",
    GAMEUSER_ERROR: "CHỌN THÔNG TIN NHÂN VẬT TRƯỚC KHI QUAY !",
    TIMESPIN_ERROR: "SỐ LƯỢT QUAY KHÔNG ĐỦ !"
}
const checkInfoSpin = (isLogin, positionUser, timesSpin, currentTimesSpin) => {
    const { GAMEUSER_ERROR, TIMESPIN_ERROR, ACCOUNT_ERROR } = listError;
    const isValidSpin = 0 < timesSpin && timesSpin <= currentTimesSpin;
    // console.log(positionUser)
    if (!isLogin) {
        return ACCOUNT_ERROR;
    }
    if (positionUser === null) {
        return GAMEUSER_ERROR;
    }
    if (!isValidSpin) {
        return TIMESPIN_ERROR;
    }
}
function detectIEEdge() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    console.log(ua)
    if (msie > 0) {
        // IE 10 or older => return version number
        // return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        console.log(msie)
    }
    // other browser
    return false;
}
export { checkInfoSpin, listError, detectIEEdge }