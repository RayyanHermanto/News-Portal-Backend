# News Portal Backend

Backend service for the **News Portal** application built with **Node.js** and **Express**, deployed on **Railway**. This backend manages API Keys securely on the server and provides endpoints for retrieving news data, including dummy news for frontend debugging.

## Features

* Securely store API Keys on the server environment (e.g., Railway).
* Return dummy news data from `dummy.json` for testing.
* Fetch news based on search queries.
* Fetch initial news for page reload.

## Technology

* **Node.js** – JavaScript runtime
* **Express** – Web framework for APIs
* **CORS** – Allow cross-origin requests
* **dotenv** – Manage environment variables
* **fs** – Read dummy news JSON file
* **Railway** – Deployment platform for environment management

## Installation

1. Clone the repository:

```bash
git clone https://github.com/RayyanHermanto/News-Portal-Backend.git
cd News-Portal-Backend
```

2. Install dependencies:

```bash
npm install
```

3. Set environment variables on your server or locally (e.g., `.env` file):

```env
NEWSAPI_KEY=your-newsapi-key
GNEWS_KEY=your-gnews-key
THENEWSAPI_KEY=your-thenewsapi-key
NEWSDATA_KEY=your-newsdata-key
PORT=3000
```

4. Start the server:

```bash
npm start
```

The server will run at `http://localhost:3000` or the port defined by Railway.

## Project Structure

```
News-Portal-Backend/
│
├─ server.js             # Application entry point with API endpoints
├─ package.json          # Project configuration and dependencies
├─ package-lock.json     # Dependency lock file
├─ .gitignore            # Files and folders ignored by Git
└─ dummy.json            # Example news data for debugging
```

## API Endpoints

### `GET /api/dummy-news`

Return the contents of `dummy.json` for frontend debugging.

**Response:**

```json
[/* dummy news data */]
```

### `GET /api/news?query=keyword`

Fetch news articles based on a search query. Automatically prepends 'AI' to the search term.

**Query Parameter:**

* `query`: keyword to search for news articles

**Response:**

```json
{
  "query": "AI keyword",
  "count": 10,
  "results": [/* news articles from multiple APIs */]
}
```

### `GET /api/newStart`

Fetch initial news articles when the frontend page reloads.

**Response:**

```json
{
  "count": 10,
  "results": [/* latest news articles from multiple APIs */]
}
```

## Notes

* API Keys are stored in environment variables and never exposed in the code.
* `/api/dummy-news` is for frontend testing without live API calls.
* The backend aggregates news from multiple sources: NewsAPI, GNews, TheNewsAPI, NewsData.io.
* Deployments can be managed via Railway for seamless environment variable handling.

## License

This project is open-source and available under the [MIT License](LICENSE).
