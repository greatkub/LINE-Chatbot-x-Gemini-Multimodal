import axios, { AxiosResponse } from "axios";

const LINE_HEADER = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
};

export class Request {
  async getBinary(messageId: string): Promise<AxiosResponse> {
    return axios({
      method: "get",
      headers: LINE_HEADER,
      url: `https://api-data.line.me/v2/bot/message/${messageId}/content`,
      responseType: "arraybuffer",
    });
  }

  async reply(replyToken: string, payload: any[]): Promise<AxiosResponse> {
    return axios({
      method: "post",
      url: "https://api.line.me/v2/bot/message/reply",
      headers: LINE_HEADER,
      data: { replyToken, messages: payload },
    });
  }

  async loading(userId: string): Promise<AxiosResponse> {
    return axios({
      method: "post",
      url: "https://api.line.me/v2/bot/chat/loading/start",
      headers: LINE_HEADER,
      data: { chatId: userId },
    });
  }

  async curl(url: string): Promise<AxiosResponse> {
    try {
      return axios({ method: "get", url, responseType: "arraybuffer" });
    } catch (error) {
      throw error;
    }
  }
}

export const request = new Request();
