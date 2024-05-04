import mysql from "mysql";
import config from "./config.js";
import fetch from "node-fetch";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import response from "express";
import { error } from "console";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.static(path.join(__dirname, "client/build")));

app.post("/api/addAccount", (req, res) => {
  const { email, firstName, lastName, photo } = req.body;
  const sql = `INSERT INTO users 
              (first_name, last_name, photo_url, email) 
              VALUES (?, ?, ?, ?)`;
  const data = [firstName, lastName, photo, email];

  let connection = mysql.createConnection(config);
  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log(JSON.stringify(results));
    res.send({ express: results });
  });
  connection.end();
});

app.post("/api/addApiKey", (req, res) => {
  const { apiKey, userId } = req.body;
  const sql =
    "UPDATE users SET api_key = ? WHERE id = ?";
  const data = [apiKey, userId];

  let connection = mysql.createConnection(config);
  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log(JSON.stringify(results));
    res.send({ express: results });
  });
  connection.end();
});

app.post("/api/createMessage", (req, res) => {
  const { time, type, message } = req.body;
  const sql = `INSERT INTO public_messages 
              (time, type, message) 
              VALUES (?, ?, ?)`;
  const data = [time, type, message];

  let connection = mysql.createConnection(config);
  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log(JSON.stringify(results));
    res.send({ express: results });
  });
  connection.end();
});

app.post("/api/deleteBlog", (req, res) => {
  const { id } = req.body;
  const sql = [
    "DELETE FROM comments WHERE post_id = ?",
    "DELETE FROM reactions WHERE post_id = ?",
    "DELETE FROM blog_posts WHERE id = ?",
  ];
  const data = [id];

  let connection = mysql.createConnection(config);
  const executeQuery = (query, data) =>
    new Promise((resolve, reject) => {
      connection.query(query, data, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

  Promise.all(sql.map((query) => executeQuery(query, data)))
    .then((results) => {
      console.log(JSON.stringify(results));
      res.send({ express: results });
    })
    .catch((error) => {
      console.error(error.message);
      res.status(500).send({ error: "An error occurred" });
    })
    .finally(() => {
      connection.end();
    });
});

app.post("/api/editBlog", (req, res) => {
  const { id, authorId, title, body, tags } = req.body;
  const sql =
    "UPDATE blog_posts SET title = ?, body = ?, author_id = ?, tags = ? WHERE id = ?";
  const data = [title, body, authorId, tags, id];

  let connection = mysql.createConnection(config);
  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log(JSON.stringify(results));
    res.send({ express: results });
  });
  connection.end();
});

app.post("/api/getAccount", (req, res) => {
  const { email } = req.body;
  let connection = mysql.createConnection(config);
  let sql = `SELECT * FROM users WHERE users.email = ?`;
  let data = [email];

  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    console.log(JSON.stringify(results));
    res.send({ express: results });
  });
  connection.end();
});

app.post("/api/getAuthor", (req, res) => {
  const { id } = req.body;
  let sql = `SELECT * FROM users WHERE users.id = ?`;
  const data = [id];

  let connection = mysql.createConnection(config);
  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    console.log(JSON.stringify(results));
    res.send({ express: results });
  });
  connection.end();
});

app.post("/api/getAllAccounts", (req, res) => {
  let connection = mysql.createConnection(config);
  let sql = `SELECT * FROM users`;

  connection.query(sql, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    console.log(JSON.stringify(results));
    res.send({ express: results });
  });
  connection.end();
});

app.post("/api/getComments", (req, res) => {
  const { postId } = req.body;
  let sql = `SELECT * FROM comments WHERE comments.post_id = ?`;
  const data = [postId];

  let connection = mysql.createConnection(config);
  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    console.log(JSON.stringify(results));
    res.send({ express: results });
  });
  connection.end();
});

app.post("/api/getMessages", (req, res) => {
  let sql = `SELECT * FROM public_messages`;

  let connection = mysql.createConnection(config);
  connection.query(sql, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    console.log(JSON.stringify(results));
    res.send({ express: results });
  });
  connection.end();
});

app.post("/api/getNotifications", (req, res) => {
  const { userId } = req.body;
  let sql = `SELECT * FROM notifications WHERE notifications.user_id = ?`;
  const data = [userId];

  let connection = mysql.createConnection(config);
  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    console.log(JSON.stringify(results));
    res.send({ express: results });
  });
  connection.end();
});

app.post("/api/getPostsByAuthor", (req, res) => {
  const { author_id } = req.body;
  let connection = mysql.createConnection(config);
  let sql = `SELECT * FROM blog_posts WHERE blog_posts.author_id = ?`;
  let data = [author_id];

  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    console.log(JSON.stringify(results));
    res.send({ express: results });
  });
  connection.end();
});

app.post("/api/getPostById", (req, res) => {
  const { id } = req.body;
  let connection = mysql.createConnection(config);
  let sql = `SELECT * FROM blog_posts WHERE blog_posts.id = ?`;
  let data = [id];

  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    console.log(JSON.stringify(results));
    res.send({ express: results });
  });
  connection.end();
});

app.post("/api/getPosts", (req, res) => {
  let connection = mysql.createConnection(config);
  let sql = `SELECT * FROM blog_posts`;

  connection.query(sql, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    console.log(JSON.stringify(results));
    res.send({ express: results });
  });
  connection.end();
});

app.post("/api/getLastPost", (req, res) => {
  let connection = mysql.createConnection(config);
  let sql = `SELECT id, title, body FROM blog_posts ORDER BY id DESC LIMIT 1`;

  connection.query(sql, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    console.log(JSON.stringify(results));
    res.send({ express: results });
  });

  connection.end();
});

app.post("/api/getReactions", (req, res) => {
  const { post_id } = req.body;
  let connection = mysql.createConnection(config);
  let sql = `SELECT * FROM reactions WHERE reactions.post_id = ?`;
  let data = [post_id];

  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    console.log(JSON.stringify(results));
    res.send({ express: results });
  });
  connection.end();
});

app.post("/api/getVideos", (req, res) => {
  let connection = mysql.createConnection(config);
  let sql = `SELECT * FROM videos`;

  connection.query(sql, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    console.log(JSON.stringify(results));
    res.send({ express: results });
  });
  connection.end();
});

app.post("/api/postVideo", (req, res) => {
  const { userId, title, url } = req.body;
  const sql = "INSERT INTO videos (user_id, title, url) VALUES (?, ?, ?)";
  const data = [userId, title, url];

  let connection = mysql.createConnection(config);
  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log(JSON.stringify(results));
    res.send({ express: results });
  });
  connection.end();
});

app.post("/api/updateNotifications", (req, res) => {
  const { user_id, posts, comments, reactions, videos, last_clear } = req.body;

  const sql = `
    INSERT INTO notifications (user_id, posts, comments, reactions, videos, last_clear)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    posts = VALUES(posts),
    comments = VALUES(comments),
    reactions = VALUES(reactions),
    videos = VALUES(videos),
    last_clear = VALUES(last_clear);
  `;

  const data = [user_id, posts, comments, reactions, videos, last_clear];

  let connection = mysql.createConnection(config);
  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log(JSON.stringify(results));
    res.send({ express: results });
  });
  connection.end();
});

app.post("/api/updateReactions", (req, res) => {
  const {
    Mood,
    SentimentVeryDissatisfied,
    ThumbUp,
    AttachMoney,
    author_id,
    post_id,
  } = req.body;

  const sql = `
    INSERT INTO reactions (author_id, post_id, Mood, SentimentVeryDissatisfied, ThumbUp, AttachMoney)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    Mood = VALUES(Mood),
    SentimentVeryDissatisfied = VALUES(SentimentVeryDissatisfied),
    ThumbUp = VALUES(ThumbUp),
    AttachMoney = VALUES(AttachMoney);
  `;

  const data = [
    author_id,
    post_id,
    Mood,
    SentimentVeryDissatisfied,
    ThumbUp,
    AttachMoney,
  ];

  let connection = mysql.createConnection(config);
  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log(JSON.stringify(results));
    res.send({ express: results });
  });
  connection.end();
});

app.post("/api/writeBlog", (req, res) => {
  const { authorId, title, body, tags } = req.body;
  const sql =
    "INSERT INTO blog_posts (title, body, author_id, tags) VALUES (?, ?, ?, ?)";
  const data = [title, body, authorId, tags];

  let connection = mysql.createConnection(config);
  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log(JSON.stringify(results));
    res.send({ express: results });
  });
  connection.end();
});

app.post("/api/writeComment", (req, res) => {
  const { authorId, postId, body } = req.body;
  const sql =
    "INSERT INTO comments (author_id, post_id, body) VALUES (?, ?, ?)";
  const data = [authorId, postId, body];

  let connection = mysql.createConnection(config);
  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log(JSON.stringify(results));
    res.send({ express: results });
  });
  connection.end();
});

app.post("/api/writeBudgetEntry", (req, res) => {
  const { amount, category, date, userid } = req.body; // Include userid in the request body

  const sql = "INSERT INTO budget (amount, category, date, userid) VALUES (?, ?, ?, ?)"; // Update SQL query to include userid
  const data = [amount, category, date, userid];

  let connection = mysql.createConnection(config);
  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log(JSON.stringify(results));
    res.send({ express: results });
  });
  connection.end();
});

app.post("/api/getAllOutlets", (req, res) => {
  const { apiKey } = req.body;

  const url = 'https://openapi.data.uwaterloo.ca/v3/FoodServices/outlets';

  const xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      const responseObj = JSON.parse(this.responseText);
      res.send(responseObj);
    }
  });

  xhr.open("GET", url);
  xhr.setRequestHeader("x-api-key", apiKey);

  xhr.send();
});

app.post("/api/getOutletById", (req, res) => {
  const { id, apiKey } = req.body;

  const url = `https://openapi.data.uwaterloo.ca/v3/FoodServices/outlets/${id}`;

  const xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      const responseObj = JSON.parse(this.responseText);
      res.send(responseObj);
    }
  });

  xhr.open("GET", url);
  xhr.setRequestHeader("x-api-key", apiKey);

  xhr.send();
});

app.post("/api/getAllFranchises", (req, res) => {
  const { apiKey } = req.body;

  const url = 'https://openapi.data.uwaterloo.ca/v3/FoodServices/franchises';

  const xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      const responseObj = JSON.parse(this.responseText);
      res.send(responseObj);
    }
  });

  xhr.open("GET", url);
  xhr.setRequestHeader("x-api-key", apiKey);

  xhr.send();
});

app.post("/api/getFranchiseById", (req, res) => {
  const { id, apiKey } = req.body;

  const url = `https://openapi.data.uwaterloo.ca/v3/FoodServices/franchises/${id}`;

  const xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      const responseObj = JSON.parse(this.responseText);
      res.send(responseObj);
    }
  });

  xhr.open("GET", url);
  xhr.setRequestHeader("x-api-key", apiKey);

  xhr.send();
});

app.post("/api/getDates", (req, res) => {
  const { apiKey } = req.body;

  const url = 'https://openapi.data.uwaterloo.ca/v3/ImportantDates';

  const xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      const responseObj = JSON.parse(this.responseText);
      res.send(responseObj);
    }
  });

  xhr.open("GET", url);
  xhr.setRequestHeader("x-api-key", apiKey);

  xhr.send();
});

app.get("/api/getCategories", (req, res) => {
  const sql =
    "SELECT category_id, category_name, category_limit, userid FROM categories";

  let connection = mysql.createConnection(config);
  connection.query(sql, (error, results, fields) => {
    if (error) {
      return res.status(500).json({ error: "Failed to fetch categories" });
    }
    console.log(JSON.stringify(results));
    res.send(results);
  });
  connection.end();
});

app.get("/api/categories", (req, res) => {
  const { name } = req.query;
  const sql = "SELECT * FROM categories WHERE category_name = ?";

  let connection = mysql.createConnection(config);
  connection.query(sql, [name], (error, results, fields) => {
    if (error) {
      connection.end();
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0) {
      // Category exists
      res.json({ exists: true });
    } else {
      // Category does not exist
      res.json({ exists: false });
    }
  });

  connection.end();
});

app.post("/api/registerEmailApi", (req, res) => {
  const { email } = req.body;

  const queryString = `email=${encodeURIComponent(email)}&project=MSCI%20342&uri=http%3A%2F%2Flocalhost%3A3000`;
  const url = `https://openapi.data.uwaterloo.ca/v3/Account/Register?${queryString}`;

  const xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      res.send(this.responseText);
    }
  });

  xhr.open("POST", url);
  xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");

  xhr.send();
});

app.post("/api/sendConfirmationCode", (req, res) => {
  const { email, code } = req.body;

  const queryString = `email=${encodeURIComponent(email)}&code=%7B${code}%7D`;
  const url = `https://openapi.data.uwaterloo.ca/v3/account/confirm?${queryString}`;

  const xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      res.send(this.responseText);
    }
  });

  xhr.open("POST", url);
  xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");

  xhr.send();
});

app.post("/api/writeCategoryEntry", (req, res) => {
  const { category_name, userid } = req.body; 

  const sql = "INSERT INTO categories (category_name, userid) VALUES (?, ?)"; 
  const data = [category_name, userid]; 

  let connection = mysql.createConnection(config);
  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      connection.end(); 
      return res.status(500).json({ error: "Failed to insert category entry" });
    }
    console.log(JSON.stringify(results));
    res.status(200).json({ success: true });
  });
  connection.end(); 
});

app.post("/api/updateCategoryLimit", (req, res) => {
  const { category, limitValue } = req.body;

  const sql =
    "UPDATE categories SET category_limit = ? WHERE category_name = ?";
  const data = [limitValue, category];

  let connection = mysql.createConnection(config);
  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      connection.end();
      return res.status(500).json({ error: "Failed to update category limit" });
    }
    console.log("Category limit updated:", results);
    res.json({ success: true });
    connection.end();
  });
});

app.get("/api/getTransactions", (req, res) => {
  const sql = "SELECT id, amount, category, date, userid FROM budget";

  let connection = mysql.createConnection(config);
  connection.query(sql, (error, results, fields) => {
    if (error) {
      return res.status(500).json({ error: "Failed to retrieve transactions" });
    }
    console.log(JSON.stringify(results));
    res.json(results);
  });
  connection.end();
});

app.delete("/api/deleteTransaction/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM budget WHERE id = ?";
  const data = [id];

  let connection = mysql.createConnection(config);
  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return res.status(500).json({ error: "Failed to delete transaction" });
    }
    console.log("Deleted transaction with ID:", id);
    res.json({ success: true });
  });
  connection.end();
});

app.delete("/api/deleteCategory/:category_id", (req, res) => {
  const category_id = req.params.category_id;
  const sql = "DELETE FROM categories WHERE category_id = ?";
  const data = [category_id];

  let connection = mysql.createConnection(config);
  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return res.status(500).json({ error: "Failed to delete category" });
    }
    console.log("Deleted category with ID:", category_id);
    res.json({ success: true });
  });
  connection.end();
});

app.post("/api/addFinancialGoal", (req, res) => {
  const { title, description, targetAmount, targetDate, userid } = req.body; // Added userid

  const sql =
    "INSERT INTO goals (title, description, targetAmount, targetDate, userid) VALUES (?, ?, ?, ?, ?)"; // Added userid to the SQL query
  const data = [title, description, targetAmount, targetDate, userid]; // Added userid to the data array

  let connection = mysql.createConnection(config);
  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log(JSON.stringify(results));
    res.send({ express: results });
  });
  connection.end();
});

app.get("/api/getGoals", (req, res) => {
  const sql = "SELECT id, title, description, targetAmount, targetDate, status, userid FROM goals";

  let connection = mysql.createConnection(config);
  connection.query(sql, (error, results, fields) => {
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch goals' });
    }
    console.log(JSON.stringify(results));
    res.send(results);
  });
  connection.end();
});

app.get("/api/getGoalsTitle", (req, res) => {
  const sql = "SELECT id, title FROM goals";

  let connection = mysql.createConnection(config);
  connection.query(sql, (error, results, fields) => {
    if (error) {
      return res.status(500).json({ error: "Failed to fetch goals" });
    }
    console.log(JSON.stringify(results));
    res.send(results);
  });
  connection.end();
});

app.put("/api/updateStatus/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = "UPDATE goals SET status = ? WHERE id = ?";
  const values = [status, id];

  let connection = mysql.createConnection(config);
  connection.query(sql, values, (error, results, fields) => {
    if (error) {
      console.error("Error updating goal status:", error);
      return res.status(500).json({ error: "Failed to update goal status" });
    }

    console.log("Updated goal status successfully");
    res.json({ success: true });
  });

  connection.end();
});

app.post("/api/addToWatchlist", (req, res) => {
  const { stockName } = req.body;

  let sql = "SELECT * FROM watchlist WHERE name = ?";
  let connection = mysql.createConnection(config);
  connection.query(sql, [stockName], (error, results) => {
    if (error) {
      connection.end();
      return res.status(500).json({ error: "Internal server error" });
    }
    if (results.length > 0) {
      connection.end();
      return res.status(400).json({ error: "Stock already in watchlist" });
    }

    sql = "INSERT INTO watchlist (name) VALUES (?)";
    connection.query(sql, [stockName], (error, results) => {
      connection.end();
      if (error) {
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.status(200).json({ message: "Stock added to watchlist" });
    });
  });
});

app.get("/api/getWatchlist", (req, res) => {
  let connection = mysql.createConnection(config);
  let sql = `SELECT * FROM watchlist`;

  connection.query(sql, (error, results, fields) => {
    connection.end();
    if (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(200).json({ watchlist: results });
  });
});

app.delete("/api/deleteFromWatchlist", (req, res) => {
  const stockNameToDelete = req.body.stockName;

  let connection = mysql.createConnection(config);
  let sql = `DELETE FROM watchlist WHERE name = ?`;

  connection.query(sql, [stockNameToDelete], (error, results, fields) => {
    connection.end();
    if (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(200).json({ message: "Stock deleted from watchlist" });
  });
});

app.post("/api/getStockData", async (req, res) => {
  const { symbol } = req.body;

  try {
    const apiKey = "3JW2V7MU7QSFDUS2"; // Alpha Vantage API key
    const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`;

    const alphaVantageResponse = await fetch(apiUrl);
    const alphaVantageData = await alphaVantageResponse.json();

    // Log the entire Alpha Vantage response to the console
    console.log("Alpha Vantage Response:", alphaVantageData);

    // Check if the response indicates rate limiting
    if (
      alphaVantageData["Information"] &&
      alphaVantageData["Information"].includes("API rate limit")
    ) {
      // Send a user-friendly message indicating API rate limit exceeded
      return res
        .status(429)
        .send({ error: "API rate limit exceeded. Please try again later." });
    }

    // Check if 'Meta Data' exists in the response
    if (!alphaVantageData["Meta Data"]) {
      throw new Error("Meta Data not found in Alpha Vantage response");
    }

    // Extract relevant data from Alpha Vantage response and send it to the client
    const metaData = alphaVantageData["Meta Data"];
    const timeSeriesData = alphaVantageData["Time Series (5min)"];
    const lastRefreshed = metaData["3. Last Refreshed"];

    // Extract latest stock information
    const latestData = timeSeriesData[lastRefreshed];
    const stockData = {
      symbol: metaData["2. Symbol"] || "N/A",
      latestPrice: parseFloat(latestData["4. close"]) || 0,
      open: parseFloat(latestData["1. open"]) || 0,
      high: parseFloat(latestData["2. high"]) || 0,
      low: parseFloat(latestData["3. low"]) || 0,
      close: parseFloat(latestData["4. close"]) || 0,
      volume: parseInt(latestData["5. volume"]) || 0,
    };

    res.send({ express: stockData });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: "Error fetching stock data" });
  }
});


// API endpoint to create a new community
app.post("/api/createCommunity", (req, res) => {
  const { name, description } = req.body;

  const sql = "INSERT INTO community (name, description) VALUES (?, ?)";
  const data = [name, description];

  let connection = mysql.createConnection(config);
  connection.query(sql, data, (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Error creating community", error: err.message });
    } else {
      res.status(201).json({
        message: "Community created successfully",
        communityId: result.insertId,
      });
    }
  });

  connection.end();
});

// API endpoint to get all communities
app.get("/api/getCommunities", (req, res) => {
  const sql = "SELECT * FROM community";

  let connection = mysql.createConnection(config);
  connection.query(sql, (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Error getting communities", error: err.message });
    } else {
      res.status(200).json({ communities: result });
    }
  });

  connection.end();
});

// API endpoint to add a new friend
app.post("/api/addFriend", (req, res) => {
  const { name, email } = req.body;

  const sql = "INSERT INTO friends (name, email) VALUES (?, ?)";
  const data = [name, email];

  let connection = mysql.createConnection(config);
  connection.query(sql, data, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error adding friend", error: err.message });
    } else {
      return res
        .status(201)
        .json({
          message: "Friend added successfully",
          friendId: result.insertId,
        });
    }
  });

  connection.end();
});

// API endpoint to fetch all friends
app.get("/api/getFriends", (req, res) => {
  const sql = "SELECT id, name, email FROM friends";

  let connection = mysql.createConnection(config);
  connection.query(sql, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error getting friends", error: err.message });
    } else {
      return res.status(200).json({ friends: result });
    }
  });

  connection.end();
});

// API endpoint to delete a friend
app.delete("/api/deleteFriend/:friendId", (req, res) => {
  const friendId = req.params.friendId;

  const sql = "DELETE FROM friends WHERE id = ?";
  const data = [friendId];

  let connection = mysql.createConnection(config);
  connection.query(sql, data, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error deleting friend", error: err.message });
    } else {
      return res.status(200).json({ message: "Friend deleted successfully" });
    }
  });

  connection.end();
});

// API endpoint to send a message
app.post("/api/sendMessage", (req, res) => {
  const { recipientName, messageText } = req.body;

  const sql =
    "INSERT INTO messages (recipient_name, message_text) VALUES (?, ?)";
  const data = [recipientName, messageText];

  // Create a MySQL connection
  let connection = mysql.createConnection(config);

  // Execute the SQL query
  connection.query(sql, data, (err, result) => {
    // Handle errors
    if (err) {
      // Close the connection
      connection.end();
      return res
        .status(500)
        .json({ message: "Error sending message", error: err.message });
    } else {
      // Close the connection
      connection.end();
      return res
        .status(201)
        .json({
          message: "Message sent successfully",
          messageId: result.insertId,
        });
    }
  });
});

// API endpoint to fetch sent messages
app.get("/api/getSentMessages", (req, res) => {
  const sql =
    "SELECT id, recipient_name, message_text, sent_time FROM messages";

  let connection = mysql.createConnection(config);
  connection.query(sql, (err, result) => {
    if (err) {
      // Close the connection
      connection.end();
      return res
        .status(500)
        .json({ message: "Error getting sent messages", error: err.message });
    } else {
      // Close the connection
      connection.end();
      return res.status(200).json({ messages: result });
    }
  });
});

// Function to calculate rough credit score
const calculateCreditScore = (data) => {
  let creditScore = 0;
  if (parseInt(data.age) >= 18) {
    creditScore += parseInt(data.age) - 18;
  }
  if (parseInt(data.income) >= 20000 && parseInt(data.income) < 50000) {
    creditScore += 50;
  } else if (parseInt(data.income) >= 50000) {
    creditScore += 100;
  }
  if (data.employmentStatus === "employed") {
    creditScore += 50;
  }
  creditScore += parseInt(data.monthlyExpenses) / 100;
  creditScore += parseInt(data.savings) / 500;
  creditScore -= parseInt(data.debt) / 1000;
  return creditScore;
};

app.post("/api/addCreditScore", (req, res) => {
  const {
    name,
    age,
    income,
    employmentStatus,
    monthlyExpenses,
    savings,
    debt,
  } = req.body;
  const roughCreditScore = calculateCreditScore({
    age,
    income,
    employmentStatus,
    monthlyExpenses,
    savings,
    debt,
  });

  const sql =
    "INSERT INTO creditScore (name, age, income, employmentStatus, monthlyExpenses, savings, debt, roughCreditScore) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    name,
    age,
    income,
    employmentStatus,
    monthlyExpenses,
    savings,
    debt,
    roughCreditScore,
  ];

  let connection = mysql.createConnection(config);
  connection.query(sql, values, (error, results, fields) => {
    if (error) {
      console.error("Error adding credit score:", error);
      return res.status(500).json({ error: "Failed to add credit score" });
    }
    console.log("Credit score added successfully");
    res.status(201).json({ success: true });
  });
});

app.get("/api/getCreditScores", (req, res) => {
  const sql = "SELECT * FROM creditScore";

  let connection = mysql.createConnection(config);
  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error("Error fetching credit scores:", error);
      return res.status(500).json({ error: "Failed to fetch credit scores" });
    }
    console.log("Credit scores fetched successfully");
    res.status(200).json(results);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
