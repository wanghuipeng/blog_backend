const db = require('../db/model.js')
const ChainModel = db.chainItemAPI

/**
 * 返回值
 * @param code 返回码
 * @param msg	返回信息
 * @param data 返回数据
 * @return
 */

var resObj = (code, msg, data) => {
    return {
        status: code,
        msg: msg,
        data: data
    }
}

// chain
exports.CHAIN_INFO_API = async(ctx, next) => {
    try {
        let data = await ChainModel.find().exec()
        ctx.body = resObj(1, '查询成功', data)
    } catch (e) {
        ctx.body = resObj(0, '查询出错', e.toString())
    }
}