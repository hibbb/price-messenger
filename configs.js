// 设置你要监控的价格及其上限和下限，高于上限或低于下限时会自动发送邮件
const priceCodeList = [
  {
    id: "BTC/USD",
    upper: "100000",
    lower: "500000"
  },
  {
    id: "ETH/USD",
    upper: "5000",
    lower: "2000"
  },
  {
    id: "ETH/BTC",
    upper: "0.06",
    lower: "0.03"
  }
];

const transporterConfs = {  // 注意：需要先在邮箱设置中开通 smtp 服务
  host: 'smtp.163.com',     // smtp.gmail.com 或 smtp.163.com，或其他邮件服务器
  port: 465,                // 587（用于 Gmail）或 465（用于 163 或 QQ 邮箱）
  secure: true,             // false（用于 Gmail）或 true（用于 163 或 QQ 邮箱）
  auth: {
    user: 'youremail@test.com', // 替换成你的邮箱地址
    pass: 'abcde12345678'       // 替换成 Gmail 的应用专用密码或 163 邮箱的授权码
  }
}

// 创建邮件内容
const mailConfs = {
  from: 'youremail@test.com',    // 发件人邮箱地址
  to: 'recipient@gmail.com',      // 收件人邮箱地址
  subject: 'Price Messenger'   // 邮件标题
};

const confs = {
   // apiKey: thegraph.com 的 apiKey，申请地址： https://thegraph.com/studio/apikeys/
  apiKey: "9876543210abcde012345",
  // intervalTime: 以毫秒为单位的检测间隙，1 小时 = 3600000 毫秒，默认间隙为 6 小时
  // 不建议把间隙设置的太小，频繁发送邮件可能会触发邮箱的垃圾信息预警
  intervalTime: 21600000
};

module.exports = {
  priceCodeList,
  transporterConfs,
  mailConfs,
  confs
};
