const express = require('express');
const bodyParser = require('body-parser');

const port = process.env.PORT || 9669;

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/webhook", (req, res)=>{
    console.log("Some thing is comming!");
    if(!req.body) res.status(400).send({ success: 0, msg: 'Body data is empty!' })
    else {
        console.log("Body receiver: " + JSON.stringify(req.body));
        // console.log()
    }
});

app.use("/", (req, res)=>{
    res.send("Penguin ver1");
});

app.listen(port, (err)=>{
    if(err) console.error(err)
    else console.log("Hello, i'm Penguin!");
})