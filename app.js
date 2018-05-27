const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const configs = require('./configs.json');
const currency = require('./currency_convert');
const util = require('./util');

let app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/webhook", (req, res)=>{
    if(!req.body) res.status(400).send({ success: 0, msg: 'Body data is empty!' })
    else if(!req.headers.masterkey || req.headers.masterkey != configs.masterKey) res.status(400).send({ success: 0, msg: 'Master key is wrong or missing!' })
    else {
        let actions = req.body.result && req.body.result.action ? req.body.result.action.split(".") : "";
        switch (actions[0]) {
            case "currency":
                if(req.body.result && req.body.result.parameters && req.body.result.parameters["currency-from"] && req.body.result.parameters["currency-to"]) {
                    currency.convertCurrency(req.body.result.parameters["currency-from"], req.body.result.parameters["currency-to"], req.body.result.parameters["amount"] || 1, (err, result)=>{
                        if(err) console.error(err)
                        else {
                            res.json({
                                messages: [ { type: 0, speech: `Right now, if you exchange ${util.numberFormat(req.body.result.parameters["amount"])} ${req.body.result.parameters["currency-from"]} to ${req.body.result.parameters["currency-to"]}, you'll get ${util.numberFormat(result)} ${req.body.result.parameters["currency-to"]}` }],
                                source: "Penguin Webhook"
                            });
                        }
                    });
                } else {
                    res.json({
                        messages: [ { type: 0, speech: "Could you provide me more details?" }],
                        source: "Penguin Webhook"
                    });
                }
                break;
            default:
                res.json({
                    messages: [ { type: 0, speech: "I didn't get that." }],
                    source: "Penguin Webhook"
                });
                break;
        }
    }
});

app.use("/", (req, res)=>{
    res.send("Penguin ver1");
});

const port = process.env.PORT || 9669;

app.listen(port, (err)=>{
    if(err) console.error(err)
    else console.log("Hello, i'm Penguin!");
})