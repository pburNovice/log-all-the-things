const express = require('express');
const fs = require('fs');
const app = express();
const path = require("path");

app.use((req, res, next) => {
// write your logging code here
    let agent = req.headers["user-agent"] || "";
        agent = agent.replace(/,/g, "");

        const time = new Date().toISOString();
        const method = req.method;
        const resource = req.originalUrl;
        const version = "HTTP/" + req.httpVersion;
        const status = res.statusCode;

        const logLine = `${agent},${time},${method},${resource},${version},${status}\n`;

        console.log(logLine.trim());

    fs.appendFile(
        path.join(__dirname, "../log.csv"),
        logLine,
        (err) => { 
            if (err) console.error("Error writing to log file:", err);
        }
    );
    next();
});

app.get('/', (req, res) => {
res.send("ok");

});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
const filePath = path.join(__dirname, "../log.csv");

fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
        return res.status(500).json({ error: "Could not read log file"}) 
    }
    const lines = data.trim().split("\n");
    const headers = lines[0].split(",");
    
    const logs = lines.slice(1).map(line => {
        const values = line.split(",");
        const entry ={};

        headers.forEach((header, index) => {
            entry[header] = values[index];
            });
        return entry;
        });
    res.json(logs);
    });
});

module.exports = app;
