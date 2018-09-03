const mongodb = require('./config.js');
const Schema = mongodb.Schema;

// 点赞文章
let praiseItem = {
    blogId: String,
    praiseStatus: { type: Number, default: 0 },
    userName: String,
    time: { type: Number, default: Date.now.valueOf() }
};
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
    thumbnail: String,
    // remarkList: [{
    //     name: String,
    //     account: String,
    //     markContent: { type: String, default: '' },
    //     time: { type: Number, default: Date.now.valueOf() },
    //     blogId: String
    // }],
    // remarkNum: { type: Number, default: 0 }
};
// 评论项
let remarkItem = {
    name: String,
    account: String,
    markContent: { type: String, default: '' },
    time: { type: Number, default: Date.now.valueOf() },
    blogId: String
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
// C端用户项
let cUser = {
    account: String,
    password: String,
    name: String,
    token: String,
    status: { type: Number, default: 0 },
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

/**
 *  爬虫 (来自segmentDefault)
 */
//前端
let frontEndItem = {
    sd_id: Number,
    sd_title: String,
    sd_content: String,
    sd_link: String,
    sd_thumbnail: String,
    sd_img: String,
    sd_zan: Number,
    sd_author: String,
    sd_time: String
};
//后端
let backEndItem = {
    sd_id: Number,
    sd_title: String,
    sd_content: String,
    sd_link: String,
    sd_thumbnail: String,
    sd_img: String,
    sd_zan: Number,
    sd_author: String,
    sd_time: String
};
//区块链
let chainItem = {
    sd_id: Number,
    sd_title: String,
    sd_content: String,
    sd_link: String,
    sd_thumbnail: String,
    sd_img: String,
    sd_zan: Number,
    sd_author: String,
    sd_time: String
};
//活动推荐
let actItem = {
    sd_id: String,
    sd_month: String,
    sd_day: String,
    sd_title: String,
    sd_base: String,
    sd_date: String,
    sd_state: String
};

let articleSchema = new Schema(articleItem);
let praiseSchema = new Schema(praiseItem);
let remarkSchema = new Schema(remarkItem);
let userSchema = new Schema(adminUser);
let cUserSchema = new Schema(cUser);
let logSchema = new Schema(loginLogs);
let concernedSchema = new Schema(concernedUser);
let siteReadingSchema = new Schema(siteReading);
let frontEndItemSchema = new Schema(frontEndItem);
let backEndItemSchema = new Schema(backEndItem);
let chainItemSchema = new Schema(chainItem);
let actItemSchema = new Schema(actItem);

let articleModel = mongodb.model("articleModel", articleSchema);
let praiseModel = mongodb.model("praiseModel", praiseSchema);
let remarkModel = mongodb.model("remarkModel", remarkSchema);
let userModel = mongodb.model("userModel", userSchema);
let cUserModel = mongodb.model("cUserModel", cUserSchema);
let logModel = mongodb.model("logModel", logSchema);
let concernedModel = mongodb.model("concernedModel", concernedSchema);
let siteReadingModel = mongodb.model("siteReadingModel", siteReadingSchema);
let frontEndItemModel = mongodb.model("frontEndItemModel", frontEndItemSchema);
let backEndItemModel = mongodb.model("backEndItemModel", backEndItemSchema);
let chainItemModel = mongodb.model("chainItemModel", chainItemSchema);
let actItemModel = mongodb.model("actItemModel", actItemSchema);

exports.articleAPI = articleModel;
exports.praiseAPI = praiseModel;
exports.remarkAPI = remarkModel;
exports.userAPI = userModel;
exports.cUserAPI = cUserModel;
exports.logAPI = logModel;
exports.concernedAPI = concernedModel;
exports.siteReadingAPI = siteReadingModel;
exports.frontEndItemAPI = frontEndItemModel;
exports.backEndItemAPI = backEndItemModel;
exports.chainItemAPI = chainItemModel;
exports.actItemAPI = actItemModel;