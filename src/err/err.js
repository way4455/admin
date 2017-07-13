/**
 * 检查错误码是否是由于Token失效引起的
 */
export const checkTokenInvliad = (errcode) => {
    if (4031003 == errcode) {
        return true;
    }
    return false;
}

export const constErrorProcess = (errcode, vueObj) => {
    if (checkTokenInvliad(errcode)) {
        vueObj.$notify({
            title: '提示',
            message: '请重新登录',
            type: 'error'
        });
        vueObj.$router.replace({ path: '/login' })
    }
    else {
        vueObj.$notify({
            title: '错误',
            message: ''+err.response.data.error.code,
            type: 'error'
        });
    }
}