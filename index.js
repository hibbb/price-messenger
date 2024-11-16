const { priceCodeList, transporterConfs, mailConfs, confs } = require('./configs');
const { ApolloClient, InMemoryCache, gql } = require('@apollo/client/core');
const moment = require('moment');
const nodemailer = require('nodemailer');
const fetch = require('cross-fetch');
const { HttpLink } = require('@apollo/client/link/http');


// ===== 1. 从 chainlink 的子图获取实时数据 ===== //

const APIURL = `https://gateway.thegraph.com/api/${confs.apiKey}/subgraphs/id/4RTrnxLZ4H8EBdpAQTcVc7LQY9kk85WNLyVzg5iXFQCH`;
const httpLink = new HttpLink({ 
  uri: APIURL,
  fetch
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only'
    }
  }
});

const QUERY = gql(`query ($idList: [String]) {
  assetPairs (where: {id_in: $idList}) { id, currentPrice }
}`);

const idList = priceCodeList.map(item => item.id);

const getData = async () => {
  try {
    const queryResult = await client.query({
      query: QUERY,
      variables: { idList }
    });
      
    const resultList = priceCodeList.map(preItem => {
      const dataItem = queryResult.data.assetPairs.find(data => data.id === preItem.id);
      const currentPrice = dataItem?.currentPrice;
      
      if (!currentPrice) return { ...preItem, currentPrice: null, status: 'unknown' };
      
      const current = Number.parseFloat(currentPrice);
      const upper = Number.parseFloat(preItem.upper);
      const lower = Number.parseFloat(preItem.lower);
      
      return {
        ...preItem,
        currentPrice,
        status: current > upper ? '高出' : current < lower ? '低于' : 'between'
      };
    });

    const notifyList = resultList.filter(item => item.status !== 'between');
    console.log("resultList: ", resultList)
    console.log("notifyList: ", notifyList)
    
    return { resultList, notifyList };
  } catch (error) {
    console.error('获取数据失败:', error);
    return { resultList: [], notifyList: [] };
  }
};

// ===== 2. 实现在 nodejs 环境中发送邮件 ===== //

// 创建发送邮件的传输器
const transporter = nodemailer.createTransport(transporterConfs);

// 发送邮件
const sendMail = async (message) => {
  try {
    const info = await transporter.sendMail({...mailConfs, text: message});
    console.log('邮件发送成功:', info.messageId);
  } catch (error) {
    console.error('邮件发送失败:', error);
  }
}

// ===== 3. 通知用户的逻辑和实现 ===== //

const notifyUser = async () => {
  try {
    let message = moment().format('MMM D, H:mm -> ');
    const { resultList, notifyList } = await getData();

    if (resultList.length < 1) {
      message += "获取数据失败或代币列表设置错误！"
      return console.log("message:", message);
    }
    
    if (notifyList.length < 1) {
      message += "风平浪静，波动很小，所以也没有发送邮件。";
      return console.log("message:", message);
    } 

    for (const item of notifyList) {
      message += `${item.id} 目前达到 ${item.currentPrice}, `;
      message += `${item.status} 你设置的价格区间 [${item.upper} - ${item.lower}]。 `;
    }
    console.log("message:", message);

    await sendMail(message); // 只有在目标信息出现时，才向用户发送邮件
  } catch (error) {
    console.error('出问题了，一点信息也没能给到用户:', error);
  }
};


// ===== 4. 主函数 ===== //

const priceMessenger = async () => {
  try {
    await notifyUser();
    const intervalId = setInterval(notifyUser, confs.intervalTime);
    process.on('SIGINT', () => {
      clearInterval(intervalId);
      process.exit(0);
    });
  } catch (error) {
    console.error('程序运行错误:', error);
  }
}

priceMessenger();
