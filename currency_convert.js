const axios = require('axios');

const convertCurrency = (from, to, amount, cb) => {
    let url = `https://free.currencyconverterapi.com/api/v5/convert?q=${from}_${to}&compact=y`

    axios.get(url)
        .then(function (response) {
            if(response.data && response.data[`${from}_${to}`]) {
                cb(null, response.data[`${from}_${to}`].val * amount);
            }
        })
        .catch(function (error) {
            cb(error);
        });
}

module.exports = {
    convertCurrency
}