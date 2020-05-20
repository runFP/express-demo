/**
 * 返回响应格式
 * @param success
 * @param data
 * @param message
 * @return {{success: boolean, data: null, message: string}}
 */
function resultHandler(success, data, message) {
    if (arguments.length === 2) {
        message = data;
    }
    return {
        success: success ? true : false,
        data: success ? data : null,
        message: success ? `${message}成功` : `失败:${message}`
    };
}

module.exports.resultHandler = resultHandler;