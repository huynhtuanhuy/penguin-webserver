const numberFormat = function (number) {
    if(number != 0) {
        if(typeof Number(number).toString().split('.')[1] != 'undefined' && Number(Number(number).toString().split('.')[1]) > 0) {
            return Number(number.toString().split('.')[0]).toLocaleString('en') + '.' + Number(number).toString().split('.')[1];
        } else {
            return Number(number.toString().split('.')[0]).toLocaleString('en');
        }
    } else {
        return 0;
    }
}

module.exports = {
    numberFormat
}