const db = require('../db/model.js')
const ChainModel = db.chainItemAPI
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

const url = `https://segmentfault.com/channel/bc`;;
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
        var items = $('.news-list .news-item');
        var links = [];

        if (items.length >= 1) {
            items.each((index, item) => {
                let it = $(item)
                    // id
                let sd_id = it.data('id')
                    //标题
                let sd_title = it.find('.news__item-title').text()
                    // 概要
                let sd_content = it.find('.article-excerpt').text().replace(/[\r\n]/g, "")
                    // 链接
                let sd_link = it.find('.news__item-info a:first').attr('href')
                    // 缩略图
                let sd_img = ''
                if (it.find('.news-img')) {
                    sd_img = it.find('.news-img').attr('style')
                    sd_thumbnail = `http://127.0.0.1:3000/downloads/chain/${index}.jpg`
                } else {
                    sd_thumbnail = ''
                }
                // 被赞次数
                let sd_zan = Number(it.find('.votes-num').text())
                    // 作者
                let sd_author = it.find('.author a').text()
                    // 发布时间
                it.find('.author a,.author span').remove()
                let sd_time = it.find('.author').text().replace(/[\r\n]/g, "")
                links.push({
                    sd_id,
                    sd_title,
                    sd_content,
                    sd_link,
                    sd_img,
                    sd_thumbnail,
                    sd_zan,
                    sd_author,
                    sd_time
                })
            });
        }
        return links
    });

    // 请求图片url得到真正的图片路径
    let imgs = result.map(item => {
        let obj = {}
        obj.sd_img = item.sd_img ? String(item.sd_img).match(/[^\(\)]+(?=\))/g)[0] : ''
        return obj
    })
    console.log(imgs)
    imgs.map((item, index) => {
        try {
            let url = item.sd_img;
            let opts = {
                url: url,
            };
            let path = `../public/downloads/chain/${index}.jpg`;
            let r1 = Ut.downImg(opts, path);
            console.log(r1);
        } catch (e) {
            console.log(e);
        }
    })

    // 存储到数据库
    result.map(item => {
        const addData = new ChainModel(item)
        addData.save()
    })


    // 关闭浏览器
    brower.close();

})();