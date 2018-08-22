const db = require('../db/model.js')
const SdBlogModel = db.sdItemAPI


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

const url = `https://segmentfault.com/blogs`;;
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
    //await page.waitForSelector('#btn-load-more');

    // 只爬取两页的数据
    // for (let i = 0; i < 1; i++) {
    //     await sleep(3000);
    //     // 点击加载更多
    //     await page.click('#btn-load-more')
    // }

    // 结果
    const result = await page.evaluate(() => {
        // 拿到页面上的jQuery
        var $ = window.$;
        var items = $('.stream-list .stream-list__item');
        var links = [];

        if (items.length >= 1) {
            items.each((index, item) => {
                let it = $(item)
                    // id
                let sd_id = it.find('.stream__item-zan').data('id')
                    //标题
                let sd_title = it.find('.title a').text()
                    // 概要
                let sd_content = it.find('.excerpt').text()
                    // 作者
                let sd_author = it.find('.author li span a:first-child').text()
                    // 头像
                let sd_avatar = it.find('.avatar-24').attr('src')
                    // 发布时间
                it.find('.author li span a').remove()
                let sd_text = it.find('.author li span').text().replace(/[\r\n]/g, "").trim()
                    // 发布所属专栏
                let sd_station = it.find('.author li span a:last-child').text()
                    // 收藏次数
                let sd_collect = parseInt(it.find('.blog--bookmark__text').text())
                    // 被赞次数
                let sd_zan = Number(it.find('.stream__item-zan-number').text())
                links.push({
                    sd_id,
                    sd_title,
                    sd_content,
                    sd_author,
                    sd_avatar,
                    sd_text,
                    sd_station,
                    sd_collect,
                    sd_zan
                })
            });
        }
        return links
    });

    // 关闭浏览器
    brower.close();

    result.map(item => {
        const addData = new SdBlogModel(item)
        addData.save()
    })

})();