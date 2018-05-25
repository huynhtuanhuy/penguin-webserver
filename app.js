const express = require('express');
const bodyParser = require('body-parser');

const configs = require('./configs.json');
const currency = require('./currency_convert');
const util = require('./util');
const port = process.env.PORT || 9669;

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/webhook", (req, res)=>{
    console.log("Some thing is comming!", JSON.stringify(req.headers.masterkey));
    if(!req.body) res.status(400).send({ success: 0, msg: 'Body data is empty!' })
    else if(!req.headers.masterkey || req.headers.masterkey != configs.masterKey) res.status(400).send({ success: 0, msg: 'Master key is wrong or missing!' })
    else {
        console.log("Body receiver: " + req.body.action);
        switch (req.body.action) {
            case "currency.convert":
                if(req.body.result && req.body.result.parameters && req.body.result.parameters["currency-from"] && req.body.result.parameters["currency-to"]) {
                    currency.convertCurrency(req.body.result.parameters["currency-from"], req.body.result.parameters["currency-to"], req.body.result.parameters["amount"] || 1, (err, result)=>{
                        if(err) console.error(err)
                        else {
                            console.log(`Right now, if you exchange ${util.numberFormat(req.body.result.parameters["amount"])}${req.body.result.parameters["currency-from"]} to ${req.body.result.parameters["currency-to"]}, you'll get ${util.numberFormat(result)}${req.body.result.parameters["currency-to"]}`)
                            res.json({
                                displayText: `Right now, if you exchange ${util.numberFormat(req.body.result.parameters["amount"])}${req.body.result.parameters["currency-from"]} to ${req.body.result.parameters["currency-to"]}, you'll get ${util.numberFormat(result)}${req.body.result.parameters["currency-to"]}`,
                                // displayText: [{ text: { text: [`Right now, if you exchange ${util.numberFormat(req.body.result.parameters["amount"])}${req.body.result.parameters["currency-from"]} to ${req.body.result.parameters["currency-to"]}, you'll get ${util.numberFormat(result)}${req.body.result.parameters["currency-to"]}`] }}],
                                source: "Penguin Webhook"
                            });
                        }
                    });
                } else {
                    res.json({
                        displayText: "Could you provide me the details?",
                        source: "Penguin Webhook"
                    });
                }
                break;
            default:
                res.json({
                    displayText: "Sorry, something went wrong and i can't do this for you right now.",
                    source: "Penguin Webhook"
                });
                break;
        }
    }
});

app.use("/", (req, res)=>{
    res.send("Penguin ver1");
});

app.listen(port, (err)=>{
    if(err) console.error(err)
    else console.log("Hello, i'm Penguin!");
})