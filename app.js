const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const view = require('koa-views');
const koaError = require('koa-onerror');
const convert = require('koa-convert');
const koaStatic = require('koa-static');
const logger = require('koa-logger');
const http = require('http');
const https = require('https');
const fs = require('fs');
const koaSslify = require('koa-sslify');

const opener = require('opener');

const app = new Koa();
const index = require('./route/index.js');
const other = require('./route/other.js');
const api = require('./route/api.js');

const cors = require('koa2-cors');

const server = require("http").createServer(app.callback()).listen(3000, "127.0.0.1");
const io = require("socket.io")(server);


var onlineCount = 0;
const db = require('./db/model.js')
const ArticleModel = db.articleAPI
const RemarkModel = db.remarkAPI
const UserModel = db.userAPI

io.sockets.on('connection', socket => {
    socket.on("sendPrivateMsg", async data => {
        console.log(11111111, data)
            //没一秒轮询数据库，查询被赞的博客的数量
        setInterval(async() => {
            let userData = await UserModel.find({ token: data }).sort({ joinTime: -1 }).exec()
            console.log(22222, userData)
            let articleData = await ArticleModel.find({ author: userData[0].user }).exec()
            let blogIdArr = []
            articleData.map(item => {
                blogIdArr.push(item._id)
            })

            let remarkData = await RemarkModel.find().exec()
            let remarkArr = []
            remarkData.forEach(item => {
                blogIdArr.forEach(item1 => {
                    if (item.blogId == item1) {
                        remarkArr.push(item1)
                    }
                })
            })
            onlineCount = remarkArr.length
            socket.volatile.emit('onlinenums', { nums: onlineCount })
        }, 1000)

    })
})


// 具体参数我们在后面进行解释
app.use(cors({
    // origin: function(ctx) {
    //     if (ctx.url === '/test') {
    //         return "*"; // 允许来自所有域名请求
    //     }
    //     return 'http://127.0.0.1:3000'; // 这样就能只允许 http://127.0.0.1:3000 这个域名的请求了
    // },
    origin: '*',
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))


app.convert = x => app.use.call(app, convert(x));

app.convert(bodyparser());
//logger
app.convert(logger());

//static
app.convert(koaStatic(__dirname + '/public'));

//强制转用https
//app.convert(koaSslify());

//设置默认模板为ejs
app.use(view(__dirname + '/views', {
    extension: 'ejs'
}));

//发生默认err.ejs
koaError(app, { template: 'views/err.ejs' });
//router
app.use(index.routes(), index.allowedMethods());
app.use(other.routes(), other.allowedMethods());
app.use(api.routes(), api.allowedMethods());

// error logger
app.on('error', (err, ctx) => {
    console.log('error occured:', err)
});

let options = {
    key: fs.readFileSync(__dirname + '/ssl/server.key'),
    cert: fs.readFileSync(__dirname + '/ssl/server.crt')
};

http.createServer(app.callback()).listen(3000, () => {
    console.log("http://127.0.0.1:3000 is runing");
    //opener("http://127.0.0.1:3000");
});
// https.createServer(options, app.callback()).listen(443,()=>{
//     console.log("https://127.0.0.1:443 is runing");
// 	//opener("https://127.0.0.1:443");
// });