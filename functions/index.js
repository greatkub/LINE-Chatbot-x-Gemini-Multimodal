const { onRequest } = require("firebase-functions/v2/https");
const line = require("./utils/line");
const gemini = require("./utils/gemini");
const axios = require("axios");
const NodeCache = require("node-cache");
const cache = new NodeCache();

exports.webhook = onRequest(async (req, res) => {
  if (req.method !== "POST") { return res.send(req.method); }

  const events = req.body.events;
  if (events.length === 0) { return res.end(); }

  for (const event of req.body.events) {
    const userId = event.source.userId;
    switch (event.type) {
      case "postback":
        await line.loading(userId);
        const response = await line.getBinary(event.postback.data);
        if (response.status === 200) {
          await getReady(response, userId, event.replyToken);
        }
        break;
      case "message":
        const messageType = event.message.type;
        if (["image", "video", "audio"].includes(messageType)) {
          
          await line.loading(userId);
          const response = await line.getBinary(event.message.id);
          
          if (response.status === 202) {
            await line.reply(event.replyToken, [{
              type: "text",
              text: `ระบบกำลังประมวลผลไฟล์ กรุณากดปุ่ม "ตรวจสอบสถานะ" ด้านล่างอีกครั้งครับ?`,
              quickReply: {
                items: [{
                  type: "action",
                  action: { type: "postback", label: "ตรวจสอบสถานะ", data: `${event.message.id}` }
                }]
              }
            }]);
            break;
          }
          
          if (response.status === 200) {
            await getReady(response, userId, event.replyToken);
            break;
          }

        }
        if (messageType === "text") {
          const prompt = event.message.text.trim();
          
          if (gemini.isUrl(prompt)) {
            await line.loading(userId);
            const response = await axios({ method: "get", url: prompt, responseType: "arraybuffer" });
            if (response.status === 200) {
              await getReady(response, userId, event.replyToken);
              break;
            }
          }

          const data = cache.get(userId);
          if (data) {
            await line.loading(userId);
            const response = await gemini.multimodal([
              "ตอบคำถามผู้ใช้เฉพาะเนื้อหาที่อยู่ในไฟล์เท่านั้น",
              { inlineData: data },
              prompt
            ]);
            await line.reply(event.replyToken, [{ type: "text", text: `${response.text()}` }]);
            console.log("TotalToken:", response.usageMetadata.totalTokenCount);
          }

        }
        break;
    }
  }
  res.end();
});

const getReady = async (response, userId, replyToken) => {
  let message = "ปัจจุบันฉันสามารถเข้าใจไฟล์ PDF, JPEG, PNG, WAV, MP3, MP4, และ MOV ได้เท่านั้น";
  const mimeType = gemini.getMimeType(response);
  console.log("mimeType:", mimeType);
  if (gemini.isAllowedMimes(mimeType)) {
    const base64 = Buffer.from(response.data).toString('base64');
    cache.set(`${userId}`, { data: base64, mimeType });
    message = "คุณอยากรุ้เรื่องอะไรจากไฟล์ที่คุณส่งมาครับ?";
  }
  await line.reply(replyToken, [{ type: "text", text: message }]);
}