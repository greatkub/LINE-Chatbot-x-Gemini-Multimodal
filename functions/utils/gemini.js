const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class Gemini {
  async multimodal(promptArray) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(promptArray);
    return result.response;
  }

  getMimeType(response) {
    const contentType = response.headers["content-type"];
    return contentType ? contentType.split(';')[0] : 'application/octet-stream';
  }

  isAllowedMimes(mimeType) {
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

  isUrl(str) {
    return /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(str);
  }
}

module.exports = new Gemini();