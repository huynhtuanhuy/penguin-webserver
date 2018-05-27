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
    console.log("Something")
    if(!req.body) res.status(400).send({ success: 0, msg: 'Body data is empty!' })
    else if(!req.headers.masterkey || req.headers.masterkey != configs.masterKey) res.status(400).send({ success: 0, msg: 'Master key is wrong or missing!' })
    else if(req.body.result && req.body.result.action) {
        let actions = req.body.result.action;
        if(actions == "currency.convert") {
            if(req.body.result && req.body.result.parameters && req.body.result.parameters["currency-from"] && req.body.result.parameters["currency-to"]) {
                currency.convertCurrency(req.body.result.parameters["currency-from"], req.body.result.parameters["currency-to"], req.body.result.parameters["amount"] || 1, (err, result)=>{
                    if(err) console.error(err)
                    else {
                        let data = `Right now, if you exchange ${util.numberFormat(req.body.result.parameters["amount"])} ${req.body.result.parameters["currency-from"]} to ${req.body.result.parameters["currency-to"]}, you'll get ${util.numberFormat(result)} ${req.body.result.parameters["currency-to"]}`;
                        let jsonData = JSON.stringify({
                            messages: [{ type: 0, speech: data }],
                            source: "Penguin Webhook"
                        })
                        console.log(jsonData)
                        res.status(200).send();
                    }
                });
            } else {
                res.send({
                    messages: [{ type: 0, speech: "Could you provide me more details?" }],
                    source: "Penguin Webhook"
                });
            }
        } else {
            console.log("abc")
            // return res.send({
            //     messages: [ { type: 0, speech: "I didn't get that." }],
            //     source: "Penguin Webhook"
            // });
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