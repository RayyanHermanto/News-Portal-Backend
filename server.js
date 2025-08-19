import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

app.get("/", (req, res) => {
  res.send("✅ News Backend API is running!");
});

const newsApiKey = process.env.NEWSAPI_KEY;
const gnewsApiKey = process.env.GNEWS_KEY;
const thenewsapiKey = process.env.THENEWSAPI_KEY;
const newsdataApiKey = process.env.NEWSDATA_KEY;

app.get("/api/news", async (req, res) => {
  const userQuery = req.query.q || "";
  const query = `AI ${userQuery}`.trim();

  try {

    const urls = [
        `https://newsapi.org/v2/everything?language=en&q=${encodeURIComponent(query)}&sortBy&apiKey=${newsApiKey}`,
        `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&sortby=publishedAt,relevance&apikey=${gnewsApiKey}`,
        `https://api.thenewsapi.com/v1/news/all?api_token=${thenewsapiKey}&search=${encodeURIComponent(query)}`,
        `https://newsdata.io/api/1/latest?apikey=${newsdataApiKey}&q=${encodeURIComponent(query)}&timezone=Asia/Jakarta`
    ];

    console.log("Fetching from URLs:", urls);

    const responses = await Promise.all(urls.map(url => fetch(url)));
    const data = await Promise.all(responses.map(r => r.json()));

    // console.log("Raw API data:");
    // data.forEach((d, i) => console.log(`API ${i}:`, JSON.stringify(d, null, 2)));

    const merged = [];

    if (data[0]?.articles?.length > 0) {
      console.log("NewsAPI returned articles:", data[0].articles.length);
      merged.push(...data[0].articles.map((a, idx) => ({
        id: `newsapi-${idx}`,
        title: a.title,
        date: a.publishedAt,
        content: a.description,
        url: a.url,
        image: a.urlToImage,
        source: "NewsAPI"
      })));
    } else {
      console.log("NewsAPI returned no articles");
    }

    if (data[1]?.articles?.length > 0) {
      console.log("GNews returned articles:", data[1].articles.length);
      merged.push(...data[1].articles.map((a, idx) => ({
        id: `gnews-${idx}`,
        title: a.title,
        date: a.publishedAt,
        content: a.description,
        url: a.url,
        image: a.image,
        source: "GNews"
      })));
    } else {
      console.log("GNews returned no articles");
    }

    if (data[2]?.data?.length > 0) {
      console.log("TheNewsAPI returned articles:", data[2].data.length);
      merged.push(...data[2].data.map((a, idx) => ({
        id: `thenewsapi-${idx}`,
        title: a.title,
        date: a.published_at,
        content: a.description,
        url: a.url,
        image: a.image_url,
        source: a.source
      })));
    } else {
      console.log("TheNewsAPI returned no articles");
    }
    if (data[3]?.results?.length > 0) {
        console.log("NewsData.io returned articles:", data[3].results.length);
        merged.push(...data[3].results.map((a, idx) => ({
            id: `newsdata-${idx}`,
            title: a.title,
            date: a.pubDate,
            content: a.description,
            url: a.link,
            image: a.image_url,
            source: "NewsData.io"
        })));
        } else {
        console.log("NewsData.io returned no articles");
        }


    if (merged.length === 0) {
      console.log("Merged is empty, nothing to return");
    }

    res.json({ query, count: merged.length, results: merged });
  } catch (err) {
    console.error("Error fetching news:", err);
    res.status(500).json({ error: "Gagal fetch API" });
  }
});

app.get("/api/newStart", async (req, res) => {
  try {
    const URLs = [
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsApiKey}`,
      `https://gnews.io/api/v4/top-headlines?category=general&apikey=${gnewsApiKey}`,
      `https://api.thenewsapi.com/v1/news/headlines?locale=us&language=en&api_token=${thenewsapiKey}`,
      `https://newsdata.io/api/1/latest?country=us&apikey=${newsdataApiKey}`
    ];

    console.log("Fetching from URLs:", URLs);

    const responses = await Promise.all(URLs.map(url => fetch(url)));
    const data = await Promise.all(responses.map(r => r.json()));

    // console.log("Raw API data:");
    // data.forEach((d, i) => console.log(`API ${i}:`, JSON.stringify(d, null, 2)));

    const merged = [];

    // NewsAPI
    if (data[0]?.articles?.length > 0) {
      console.log("NewsAPI returned articles:", data[0].articles.length);
      merged.push(...data[0].articles.map((a, idx) => ({
        id: `newsapi-${idx}`,
        title: a.title,
        date: a.publishedAt,
        content: a.description,
        url: a.url,
        image: a.urlToImage,
        source: "NewsAPI"
      })));
    } else console.log("NewsAPI returned no articles");

    // GNews
    if (data[1]?.articles?.length > 0) {
      console.log("GNews returned articles:", data[1].articles.length);
      merged.push(...data[1].articles.map((a, idx) => ({
        id: `gnews-${idx}`,
        title: a.title,
        date: a.publishedAt,
        content: a.description,
        url: a.url,
        image: a.image,
        source: "GNews"
      })));
    } else console.log("GNews returned no articles");

    // TheNewsAPI
    if (data[2]?.data?.length > 0) {
      console.log("TheNewsAPI returned articles:", data[2].data.length);
      merged.push(...data[2].data.map((a, idx) => ({
        id: `thenewsapi-${idx}`,
        title: a.title,
        date: a.published_at,
        content: a.description,
        url: a.url,
        image: a.image_url,
        source: a.source
      })));
    } else console.log("TheNewsAPI returned no articles");

    // NewsData.io
    if (data[3]?.results?.length > 0) {
      console.log("NewsData.io returned articles:", data[3].results.length);
      merged.push(...data[3].results.map((a, idx) => ({
        id: `newsdata-${idx}`,
        title: a.title,
        date: a.pubDate,
        content: a.description,
        url: a.link,
        image: a.image_url,
        source: "NewsData.io"
      })));
    } else console.log("NewsData.io returned no articles");

    if (merged.length === 0) console.log("Merged is empty, nothing to return");

    res.json({ count: merged.length, results: merged });

  } catch (err) {
    console.error("Error fetching news:", err);
    res.status(500).json({ error: "Gagal fetch API" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
