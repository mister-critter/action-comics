import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const myAPIkey = process.env.API_KEY;

app.get("/", async (req, res) => {
    try {
        const response = await axios.get(`https://comicvine.gamespot.com/api/issues/?api_key=${myAPIkey}&format=json&filter=volume:91078&sort=store_date:desc`);
        const result = response.data.results;

        // Format the store_date
        result.forEach(issue => {
            const date = new Date(issue.store_date);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            issue.store_date = date.toLocaleDateString('en-US', options);
        });

        res.render("index.ejs", { currentIssue: result[0] });

    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
            error: error.message,
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});  