const checkInfoSpin = (gameUserId, serverId) => {
    if (gameUserId !== 0 && serverId !== 0) {
        return true
    } else {
        return false;
    }
}
export { checkInfoSpin }