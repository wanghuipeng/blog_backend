const mongodb = require('./config.js');
const Schema = mongodb.Schema;

// 文章项
let articleItem = {
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date },
    title: String,
    type: String,
    author: String,
    avatar: String,
    content: String,
    markdown: String,
    imgUrl: { type: String },
    pv: { type: Number, default: 0 },
    thumbnail: String
};
// 分析数据
let siteReading = {
    totalViews: { type: Number, default: 0 },
    preViews: { type: Number, default: 0 },
    dayViewsList: [{
        dayViews: { type: Number, default: 0 },
        time: { type: Date, default: Date.now }
    }]
};
// 用户项
let adminUser = {
    user: String,
    password: String,
    avatar: String,
    token: String,
    remark: { type: String, default: '暂无' },
    joinTime: { type: Date, default: Date.now }
};
// 登录日志
let loginLogs = {
    user: String,
    ip: String,
    massage: String,
    loginTime: { type: Date, default: Date.now }
};

// 关注用户
let concernedUser = {
    user: String,
    email: String,
    title: String,
    ParticipatinComments: String,
    nearTime: String
};

let articleSchema = new Schema(articleItem);
let userSchema = new Schema(adminUser);
let logSchema = new Schema(loginLogs);
let concernedSchema = new Schema(concernedUser);
let siteReadingSchema = new Schema(siteReading);

let articleModel = mongodb.model("articleModel", articleSchema);
let userModel = mongodb.model("userModel", userSchema);
let logModel = mongodb.model("logModel", logSchema);
let concernedModel = mongodb.model("concernedModel", concernedSchema);
let siteReadingModel = mongodb.model("siteReadingModel", siteReadingSchema);

exports.articleAPI = articleModel;
exports.userAPI = userModel;
exports.logAPI = logModel;
exports.concernedAPI = concernedModel;
exports.siteReadingAPI = siteReadingModel;