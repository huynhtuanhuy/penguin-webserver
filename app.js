const express = require('express');
const bodyParser = require('body-parser');

const configs = require('./configs.json');
const currency = require('./currency_convert');
const port = process.env.PORT || 9669;

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/webhook", (req, res)=>{
    console.log("Some thing is comming!", JSON.stringify(req.headers.masterkey));
    if(!req.body) res.status(400).send({ success: 0, msg: 'Body data is empty!' })
    else if(!req.headers.masterkey || req.headers.masterkey != configs.masterKey) res.status(400).send({ success: 0, msg: 'Master key is wrong or missing!' })
    else {
        console.log("Body receiver: " + JSON.stringify(req.body.queryResult));
        if(req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.currency-from && req.body.queryResult.parameters.currency-to) {
            currency.convertCurrency(req.body.queryResult.parameters.currency-from, req.body.queryResult.parameters.currency-to, req.body.queryResult.parameters.amount || 1, (err, result)=>{
                if(err) console.error(err)
                else {
                    console.log(result)
                    // res.json({
                    //     fulfillmentText: `Right now, if you exchange `,
                    //     fulfillmentMessages: [{ text: { text: [w] }}],
                    //     source: ""
                    // });
                }
            });
        } else {
            res.status(400).send({ success: 0, msg: 'Nothing to convert' });
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