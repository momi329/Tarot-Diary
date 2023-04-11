/* eslint-disable */
import * as functions from "firebase-functions";
import { Configuration, OpenAIApi } from "openai";
import fetch from "node-fetch";

export const getUnsplashPhoto = functions.https.onCall(
  async (data, context) => {
    const accessKey = process.env.UNSPLASH_API_KEY;
    const query = data.query;

    // 構造 Unsplash API 的 URL
    const apiUrl = `https://api.unsplash.com/search/photos?query=${query}`;

    try {
      // 發送 HTTP request
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
          "Content-Type": "application/json",
        },
      });

      // 將 response 轉換為 JSON 格式
      const result = await response.json();
      // 回傳 Unsplash API 的結果
      return result;
    } catch (error) {
      console.error(error);
      throw new functions.https.HttpsError(
        "internal",
        (error as Error).message
      );
    }
  }
);
