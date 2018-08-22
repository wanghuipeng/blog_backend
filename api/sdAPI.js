const db = require('../db/model.js')
const SdBlogModel = db.sdItemAPI
const mongoose = require('mongoose')
const lodash = require('lodash')
const fs = require('fs')


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

/**
 *  爬虫  
 */

/**
 *  文章信息  
 */
exports.SD_BLOGS_INFO_API = async(ctx, next) => {
    try {
        addData = new SdBlogModel({ a: 1 })
        var data = await addData.save()
        ctx.body = resObj(1, '保存成功', data)
    } catch (e) {
        ctx.body = resObj(0, '保存出错', e.toString())
    }
}