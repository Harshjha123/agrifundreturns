const crypto = require('crypto');
const axios = require('axios');

const md5Key = 'laGyNHVJRceojuFCmpsOnBAvTLXgEdih';

function generateOrderId() {
    return `ORDER-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
}

function generateMD5Signature(params, key) {
    const sortedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
    const stringToSign = `${sortedParams}&key=${key}`;
    return crypto.createHash('md5').update(stringToSign).digest('hex').toUpperCase();
}

const createPaymentRequest = async () => {
    const params = {
        merId: '20240834',
        orderId: generateOrderId(),
        orderAmt: '500.00',
        email: 'customer@example.com',
        mobile: '1234567890',
        firstname: 'Customer Name',
        channel: '101',
        desc: 'YourDescriptionHere',
        notifyUrl: 'https://yourdomain.com/notify',
        returnUrl: 'https://yourdomain.com/return',
        nonceStr: crypto.randomBytes(16).toString('hex')
    };

    params.sign = generateMD5Signature(params, md5Key);

    try {
        const response = await axios.post('https://api.mospays.com/pay', params);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

createPaymentRequest();