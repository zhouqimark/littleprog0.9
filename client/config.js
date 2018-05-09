var host = "https://ndp6uzzo.qcloud.la";

var config = {
    service: {
        host,
        loginUrl: `${host}/weapp/login`,
        requestUrl: `${host}/weapp/user`,
        infoPublish: `${host}/weapp/info`,
        decryptionUrl: `${host}/weapp/decryption`,
        bannerUrl: `${host}/weapp/banner`
    }
}

module.exports = config;