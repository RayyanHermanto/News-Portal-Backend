import express from "express";
import fetch from "node-fetch";
import Fuse from "fuse.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Dummy fallback
const dummyNews = [
  { id: 1, title: "AI Mengubah Industri Teknologi", date: "2025-08-18", content: "AI semakin banyak digunakan di berbagai industri untuk meningkatkan produktivitas." },
  { id: 2, title: "React 19 Resmi Dirilis", date: "2025-08-17", content: "React 19 membawa banyak fitur baru termasuk server components dan peningkatan performance." },
  { id: 3, title: "OpenAI Luncurkan GPT-5", date: "2025-08-16", content: "GPT-5 memiliki kemampuan reasoning yang lebih baik dan dukungan multimodal." },
  { id: 4, title: "Vite Semakin Populer di Frontend Dev", date: "2025-08-15", content: "Vite menjadi pilihan utama developer karena build super cepat dan dukungan plugin ekosistem yang luas." },
];

// Fuse.js untuk fuzzy search (opsional di backend)
const fuse = new Fuse(dummyNews, {
  keys: ["title", "content"],
  threshold: 0.4,
});

app.get("/", (req, res) => {
  res.send("✅ News Backend API is running!");
});

app.get("/api/news", async (req, res) => {
  const query = req.query.q || "AI";

  try {
    // 🔐 API Keys dari ENV Render
    const newsApiKey = process.env.NEWSAPI_KEY;
    const gnewsApiKey = process.env.GNEWS_KEY;
    const newsdataApiKey = process.env.NEWSDATA_KEY;
    const thenewsapiKey = process.env.THENEWSAPI_KEY;

    const urls = [
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=popularity&apiKey=${newsApiKey}`,
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&sortby=relevance&apikey=${gnewsApiKey}`,
      `https://newsdata.io/api/1/latest?apikey=${newsdataApiKey}&q=${encodeURIComponent(query)}&country=id,us&language=id,en&timezone=Asia/Jakarta`,
      `https://api.thenewsapi.com/v1/news/all?api_token=${thenewsapiKey}&search=${encodeURIComponent(query)}`
    ];

    const responses = await Promise.all(urls.map(url => fetch(url)));
    const data = await Promise.all(responses.map(r => r.json()));

    // 🔄 Normalisasi
    const merged = [];

    if (data[0]?.articles) {
      merged.push(...data[0].articles.map((a, idx) => ({
        id: `newsapi-${idx}`,
        title: a.title,
        date: a.publishedAt,
        content: a.description,
        url: a.url,
        image: a.urlToImage,
        source: "NewsAPI"
      })));
    }

    if (data[1]?.articles) {
      merged.push(...data[1].articles.map((a, idx) => ({
        id: `gnews-${idx}`,
        title: a.title,
        date: a.publishedAt,
        content: a.description,
        url: a.url,
        image: a.image,
        source: "GNews"
      })));
    }

    if (data[2]?.results) {
      merged.push(...data[2].results.map((a, idx) => ({
        id: `newsdata-${idx}`,
        title: a.title,
        date: a.pubDate,
        content: a.description,
        url: a.link,
        image: a.image_url,
        source: "NewsData.io"
      })));
    }

    if (data[3]?.data) {
    merged.push(...data[3].data.map((a, idx) => ({
        id: `thenewsapi-${idx}`,
        title: a.title,
        date: a.published_at,
        content: a.description,
        url: a.url,
        image: a.image_url,
        source: a.source
    })));
    }


    // fallback fuzzy search ke dummy kalau kosong
    if (merged.length === 0) {
      const fuzzy = fuse.search(query);
      const result = fuzzy.length > 0 ? fuzzy.map(r => r.item) : dummyNews;
      return res.json({ query, count: result.length, results: result });
    }

    res.json({ query, count: merged.length, results: merged });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal fetch API" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
