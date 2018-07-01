var host = "https://ndp6uzzo.qcloud.la";

var config = {
    service: {
        host,
        loginUrl: `${host}/weapp/login`,
        requestUrl: `${host}/weapp/user`,
        normalUserUrl: `${host}/weapp/user/normal`,
        memberUserUrl: `${host}/weapp/user/member`,
        informationUrl: `${host}/weapp/information`,
        decryptionUrl: `${host}/weapp/decryption`,
        classifyUrl: `${host}/weapp/classify`,
        goodsUrl: `${host}/weapp/goods`,
        goodsSearchUrl: `${host}/weapp/goods/search/all`,
        cartUrl: `${host}/weapp/cart`,
        cartClearUrl: `${host}/weapp/cart/clear`,
        defaultAddressUrl: `${host}/weapp/address/default`,
        addressUrl: `${host}/weapp/address`,
        orderUrl: `${host}/weapp/order`,
        uploadUrl: `${host}/weapp/upload`,
    }
}

module.exports = config;