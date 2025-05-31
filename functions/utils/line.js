const axios = require("axios");
const MESSAGING_API = "https://api.line.me/v2/bot";
const LINE_HEADER = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`
};

class LINE {
  getBinary(messageId) {
    return axios({
      method: "get",
      headers: LINE_HEADER,
      url: `https://api-data.line.me/v2/bot/message/${messageId}/content`,
      responseType: "arraybuffer"
    });
  }

  reply(replyToken, payload) {
    return axios({
      method: "post",
      url: `${MESSAGING_API}/message/reply`,
      headers: LINE_HEADER,
      data: { replyToken, messages: payload }
    });
  }

  loading(userId) {
    return axios({
      method: "post",
      url: `${MESSAGING_API}/chat/loading/start`,
      headers: LINE_HEADER,
      data: { chatId: userId }
    });
  }
}

module.exports = new LINE()
