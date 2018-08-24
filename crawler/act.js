const db = require('../db/model.js')
const ActModel = db.actItemAPI
let Ut = require("./common.js");

/**
 * 返回值
 * @param code 返回码
 * @param msg	返回信息
 * @param data 返回数据
 * @return
 */

const puppeteer = require('puppeteer');

// 等待3000毫秒
const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time);
})

const url = `https://segmentfault.com`;;
(async() => {
    console.log('Start visit');

    // 启动一个浏览器
    const brower = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    });

    const page = await brower.newPage() // 开启一个新页面
        // 去豆瓣那个页面
    await page.goto(url, {
        waitUntil: 'networkidle2' // 网络空闲说明已加载完毕
    });

    await sleep(3000);
    // 页面加载更多按钮出现
    // await page.waitForSelector('#btn-load-more');

    // // 只爬取两页的数据
    // for (let i = 0; i < 4; i++) {
    //     await sleep(3000);
    //     // 点击加载更多
    //     await page.click('#btn-load-more')
    // }

    // 结果
    const result = await page.evaluate(() => {
        // 拿到页面上的jQuery
        var $ = window.$;
        var items = $('.activity-recommend-area .activity-recommend-item');
        var links = [];

        if (items.length >= 1) {
            items.each((index, item) => {
                let it = $(item)
                    // id
                let sd_id = it.attr('href')
                    //月份
                let sd_month = it.find('.activity-date-up').text()
                    // 日
                let sd_day = it.find('.activity-date-down').text()
                    // 标题
                let sd_title = it.find('.activity-detail-title').text()
                    // 地点
                let sd_base = it.find('.activity-detail-base').text()
                    // 状态
                let sd_state = ''

                if (it.find('.activity-state')) {
                    sd_state = it.find('.activity-state').text()
                } else {
                    sd_state = ''
                }
                // 日期
                it.find('.activity-detail div,.activity-detail span').remove()
                let sd_date = it.find('.activity-detail').text()
                links.push({
                    sd_id,
                    sd_month,
                    sd_day,
                    sd_title,
                    sd_base,
                    sd_date,
                    sd_state
                })
            });
        }
        return links
    });

    // 存储到数据库
    result.map(item => {
        const addData = new ActModel(item)
        addData.save()
    })


    // 关闭浏览器
    brower.close();

})();