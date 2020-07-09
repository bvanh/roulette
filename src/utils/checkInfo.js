const listError = {
    ACCOUNT_ERROR: "ĐĂNG NHẬP TRƯỚC KHI QUAY !",
    GAMEUSER_ERROR: "CHỌN THÔNG TIN NHÂN VẬT TRƯỚC KHI QUAY !",
    TIMESPIN_ERROR: "SỐ LƯỢT QUAY KHÔNG ĐỦ !"
}
const checkInfoSpin = (isLogin, gameUserId, serverId, timesSpin, currentTimesSpin) => {
    const { GAMEUSER_ERROR, TIMESPIN_ERROR, ACCOUNT_ERROR } = listError;
    const isValidSpin = 0 < timesSpin && timesSpin <= currentTimesSpin;
    const isValidUserInfo = gameUserId === 0 && serverId === 0;
    if (!isLogin) {
        return ACCOUNT_ERROR;
    } else if (isValidUserInfo) {
        return GAMEUSER_ERROR;
    } else if (!isValidSpin) {
        return TIMESPIN_ERROR;
    }
}
export { checkInfoSpin, listError }