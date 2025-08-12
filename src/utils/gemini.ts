import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: `${process.env.API_KEY}` });

export class Gemini {
  isUrl(str: string): boolean {
    return /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(
      str
    );
  }

  getMimeType(response: any): string {
    const contentType = response.headers["content-type"];
    return contentType ? contentType.split(";")[0] : "application/octet-stream";
  }

  isAllowedMimes(mimeType: string): boolean {
    return [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "audio/wav",
      "audio/mp3",
      "audio/x-m4a",
      "video/mp4",
      "video/mov",
    ].includes(mimeType);
  }

  async multimodal(promptArray: any[]) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptArray,
    });
    return response;
  }
}

export const gemini = new Gemini();
