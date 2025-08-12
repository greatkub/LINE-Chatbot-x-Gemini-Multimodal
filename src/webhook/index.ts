import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { request } from "../../src/utils/request";
import { gemini } from "../../src/utils/gemini";
import NodeCache from "node-cache";

const cache = new NodeCache();

async function webhook(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  if (req.method !== "POST") {
    return { body: req.method };
  }

  try {
    const body = (await req.json()) as any;
    const events = body.events;

    if (!events || events.length === 0) {
      return { status: 200 };
    }

    for (const event of events) {
      const userId = event.source.userId;

      switch (event.type) {
        case "postback":
          const response = await request.getBinary(event.postback.data);
          if (response.status === 200) {
            await getReady(response, userId, event.replyToken);
          }
          break;

        case "message":
          const messageType = event.message.type;

          if (["image", "video", "audio"].includes(messageType)) {
            const response = await request.getBinary(event.message.id);

            if (response.status === 202) {
              await request.reply(event.replyToken, [
                {
                  type: "text",
                  text: `ระบบกำลังประมวลผลไฟล์ กรุณากดปุ่ม "ตรวจสอบสถานะ" ด้านล่างอีกครั้งครับ?`,
                  quickReply: {
                    items: [
                      {
                        type: "action",
                        action: {
                          type: "postback",
                          label: "ตรวจสอบสถานะ",
                          data: `${event.message.id}`,
                        },
                      },
                    ],
                  },
                },
              ]);
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
              try {
                const response = await request.curl(prompt);
                await getReady(response, userId, event.replyToken);
              } catch (error) {
                await request.reply(event.replyToken, [
                  {
                    type: "text",
                    text: "ขออภัย ฉันไม่สามารถเปิด URL นี้ได้ครับ",
                  },
                ]);
              }
              break;
            }

            const data = cache.get(userId);
            if (data) {
              await request.loading(userId);
              const response = await gemini.multimodal([
                "ตอบคำถามผู้ใช้เฉพาะเนื้อหาที่อยู่ในไฟล์เท่านั้น",
                { inlineData: data },
                prompt,
              ]);
              await request.reply(event.replyToken, [
                { type: "text", text: `${response.text}` },
              ]);
              context.log(
                "TotalToken:",
                response.usageMetadata.totalTokenCount
              );
            }
          }
          break;
      }
    }

    return { status: 200 };
  } catch (error) {
    context.error("Error processing webhook:", error);
    return { status: 500, body: "Internal Server Error" };
  }
}

const getReady = async (response: any, userId: string, replyToken: string) => {
  let message =
    "ปัจจุบันฉันสามารถเข้าใจไฟล์ PDF, JPEG, PNG, WAV, MP3, MP4, และ MOV ได้เท่านั้น";
  const mimeType = gemini.getMimeType(response);

  if (gemini.isAllowedMimes(mimeType)) {
    const base64 = Buffer.from(response.data).toString("base64");
    cache.set(`${userId}`, { data: base64, mimeType });
    message = "คุณอยากรุ้เรื่องอะไรจากไฟล์ที่คุณส่งมาครับ?";
  }

  await request.reply(replyToken, [{ type: "text", text: message }]);
};

app.http("webhook", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: webhook,
});
