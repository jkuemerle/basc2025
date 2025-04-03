require('dotenv').config()
const express = require("express");
const app = express();
const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const req = require("express/lib/request");
const fn = require('./functions');

const PORT = process.env.PORT || 3000

app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, 'public')))

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})

app.get('/api/challenges', (req, res) => {
    res.json(fn.listChallenges());
    res.end();
})


app.get('/api/challenge', (req, res) => {
    var code = req.query.code;
    if(code) {
        var chal = fn.getChallenge(code);
        if(chal) {
            res.json(chal);
            res.end()
        } else {
            res.status(404);
            res.end();    
        }
    } else {
        res.status(404);
        res.end();
    }
})

app.post('/api/prompt', async (req, res) => {
    var code  = req.body.code;
    var prompt = req.body.prompt;
    var result = await fn.runPrompt(code, prompt);
    res.json({ response: result });
    res.end();
})