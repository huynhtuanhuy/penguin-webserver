const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const configs = require('./configs.json');
const convert = require('./convert');
const util = require('./util');

let app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/webhook", (req, res)=>{
    if(!req.body) res.status(400).send({ success: 0, msg: 'Body data is empty!' })
    else if(!req.headers.masterkey || req.headers.masterkey != configs.masterKey) res.status(400).send({ success: 0, msg: 'Master key is wrong or missing!' })
    else if(req.body.result && req.body.result.action) {
        let actions = req.body.result.action;
        if(actions == "currency.convert") {
            if(req.body.result && req.body.result.parameters && req.body.result.parameters["currency-from"] && req.body.result.parameters["currency-to"]) {
                convert.convertCurrency(req.body.result.parameters["currency-from"], req.body.result.parameters["currency-to"], req.body.result.parameters["amount"] || 1, (err, result)=>{
                    if(err) console.error(err)
                    else {
                        let speech = `Right now, if you exchange ${util.numberFormat(req.body.result.parameters["amount"])} ${req.body.result.parameters["currency-from"]} to ${req.body.result.parameters["currency-to"]}, you'll get ${util.numberFormat(result)} ${req.body.result.parameters["currency-to"]}`;
                        res.send({
                            messages: [{ type: 0, speech: speech }],
                            source: "Penguin Webhook"
                        });
                    }
                });
            } else {
                res.send({
                    messages: [{ type: 0, speech: "Not enough parameter, please try again!" }],
                    source: "Penguin Webhook"
                });
            }
        } else if(actions == "units.convert") {
            if(req.body.result && req.body.result.parameters && req.body.result.parameters["unit-from"] && req.body.result.parameters["unit-to"]) {
                let result = convert.convertUnit(req.body.result.parameters["unit-from"], req.body.result.parameters["unit-to"], req.body.result.parameters["amount"]);
                let speech = `${util.numberFormat(req.body.result.parameters["amount"])}${req.body.result.parameters["unit-from"]} equals ${util.numberFormat(result.toFixed(2))}${req.body.result.parameters["unit-to"]}`;
                res.send({
                    messages: [{ type: 0, speech: speech }],
                    source: "Penguin Webhook"
                });
            } else {
                res.send({
                    messages: [{ type: 0, speech: "Not enough parameter, please try again!" }],
                    source: "Penguin Webhook"
                });
            }
        } else {
            return res.send({
                messages: [ { type: 0, speech: "I didn't get that." }],
                source: "Penguin Webhook"
            });
        }
    }
});

app.use("/", (req, res)=>{
    res.send("Penguin ver 1");
});

const port = process.env.PORT || 9669;

app.listen(port, (err)=>{
    if(err) console.error(err)
    else console.log("Hello, i'm Penguin!");
})